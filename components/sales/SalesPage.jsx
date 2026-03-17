import { useState, useEffect, useCallback } from 'react'
import {
  Plus, RefreshCw, ShoppingBag, Send,
  CheckCircle2, AlertCircle, MessageSquare,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { customersApi, accountsApi } from '../../services/api'
import {
  PageHeader, StatusBadge, SkeletonTable, EmptyState,
  PlatformDot, StatCard, Spinner, Modal,
} from '../../index'
import NewSaleModal from './NewSaleModal'
import { fmtDate, fmtPrice, daysUntil, daysColor, getPlatformInfo } from '../../utils/helpers'

// Panel de confirmación antes de enviar credenciales
function SendCredentialsPanel({ open, onClose, sale, onConfirm, loading }) {
  if (!sale) return null
  const acc  = sale.accounts
  const cust = sale.customers
  const pInfo = getPlatformInfo(acc?.platforms?.slug)

  return (
    <Modal open={open} onClose={onClose} title="Entregar credenciales por WhatsApp">
      <div className="space-y-4">
        {/* Preview del mensaje */}
        <div className="bg-carbon-900 border border-carbon-700 rounded-xl p-4 font-mono text-sm text-carbon-200 leading-relaxed whitespace-pre-wrap">
{`✅ *Hola ${cust?.full_name}!* Tus credenciales de *${acc?.platforms?.name || pInfo.name}* están listas:

📧 *Correo:* ${acc?.email}
🔑 *Contraseña:* [encriptada — se envía desencriptada]
👤 *Perfil:* ${acc?.profile_name || 'Principal'}
📅 *Vence:* ${fmtDate(acc?.expiration_date)}

⚠️ _No cambies la contraseña ni el correo._
Para soporte, escríbenos aquí. ¡Disfruta! 🎬`}
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-carbon-700/50 border border-carbon-600">
          <div className="w-8 h-8 rounded-full bg-[#25D366]/15 flex items-center justify-center flex-shrink-0">
            <MessageSquare size={14} className="text-[#25D366]" />
          </div>
          <div>
            <p className="text-sm font-medium text-carbon-100">Destino</p>
            <p className="text-xs font-mono text-[#25D366]">{cust?.whatsapp_number}</p>
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-2 border-t border-carbon-700">
          <button className="btn-secondary" onClick={onClose} disabled={loading}>Cancelar</button>
          <button className="btn-whatsapp px-5 py-2.5" onClick={onConfirm} disabled={loading}>
            {loading
              ? <Spinner size={14} className="text-[#25D366]" />
              : <Send size={14} />
            }
            Entregar por WhatsApp
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default function SalesPage() {
  // Cargamos ventas desde el endpoint de customers con sus sales
  const [sales, setSales]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [total, setTotal]         = useState(0)
  const [page, setPage]           = useState(1)
  const LIMIT = 20

  const [newSaleOpen, setNewSale] = useState(false)
  const [sendPanel, setSendPanel] = useState({ open: false, sale: null })
  const [sendLoading, setSendLoad] = useState(false)
  const [sentIds, setSentIds]     = useState(new Set())

  const fetchSales = useCallback(async () => {
    setLoading(true)
    try {
      // Obtenemos todos los clientes con sus ventas anidadas
      const res = await customersApi.list({ limit: LIMIT, page })
      // Aplanamos customer.sales en una lista de ventas enriquecidas
      const allSales = []
      ;(res.data || []).forEach((customer) => {
        ;(customer.sales || []).forEach((sale) => {
          if (sale.is_active) {
            allSales.push({ ...sale, customers: customer })
          }
        })
      })
      setSales(allSales)
      setTotal(res.pagination?.total || 0)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => { fetchSales() }, [fetchSales])

  const handleSendCredentials = async () => {
    if (!sendPanel.sale) return
    setSendLoad(true)
    try {
      // La ruta es /api/accounts/:id/send-credentials
      await accountsApi.sendCredentials(sendPanel.sale.accounts.id)
      toast.success(
        (t) => (
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-accent-400" />
            <span>Credenciales enviadas a <strong>{sendPanel.sale.customers.full_name}</strong></span>
          </div>
        ),
        { duration: 4000 }
      )
      setSentIds((prev) => new Set([...prev, sendPanel.sale.id]))
      setSendPanel({ open: false, sale: null })
    } catch (err) {
      toast.error(`Error: ${err.message}`)
    } finally {
      setSendLoad(false)
    }
  }

  const activeSales   = sales.length
  const totalRevenue  = sales.reduce((sum, s) => sum + (parseFloat(s.price) || 0), 0)
  const expiringSoon  = sales.filter((s) => {
    const d = daysUntil(s.renewal_date); return d !== null && d <= 3 && d >= 0
  }).length

  const totalPages = Math.ceil(total / LIMIT)

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Ventas"
        description="Gestiona las suscripciones activas y entrega credenciales"
        action={
          <button className="btn-primary" onClick={() => setNewSale(true)}>
            <Plus size={16} /> Nueva venta
          </button>
        }
      />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Suscripciones activas" value={activeSales} accent />
        <StatCard label="Ingresos (visible)" value={`S/. ${totalRevenue.toFixed(2)}`} />
        <StatCard label="Vencen pronto (3d)" value={expiringSoon} />
      </div>

      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-carbon-700">
          <p className="text-xs font-mono text-carbon-400 uppercase tracking-widest">
            Ventas activas — {activeSales}
          </p>
          <button className="btn-ghost py-1.5 text-xs" onClick={fetchSales}>
            <RefreshCw size={13} />
          </button>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Plataforma · Cuenta</th>
              <th>Precio</th>
              <th>Renovación</th>
              <th>Fecha venta</th>
              <th className="text-right">Entrega</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <SkeletonTable rows={8} cols={6} />
            ) : sales.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-0">
                  <EmptyState
                    icon={ShoppingBag}
                    title="Sin ventas activas"
                    description="Registra una venta vinculando un cliente con una cuenta del inventario."
                    action={
                      <button className="btn-primary" onClick={() => setNewSale(true)}>
                        <Plus size={15} /> Nueva venta
                      </button>
                    }
                  />
                </td>
              </tr>
            ) : (
              sales.map((sale, i) => {
                const acc    = sale.accounts || {}
                const cust   = sale.customers || {}
                const pInfo  = getPlatformInfo(acc.platforms?.slug)
                const days   = daysUntil(sale.renewal_date)
                const wasSent = sentIds.has(sale.id)

                return (
                  <tr key={sale.id} style={{ animationDelay: `${i * 25}ms` }} className="animate-fade-in">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-carbon-700 flex items-center justify-center text-xs font-bold text-carbon-300 flex-shrink-0">
                          {cust.full_name?.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-carbon-100">{cust.full_name}</p>
                          <p className="text-xs font-mono text-carbon-500">{cust.whatsapp_number}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <PlatformDot
                        color={acc.platforms?.color || pInfo.color}
                        name={acc.platforms?.name || pInfo.name}
                      />
                      <p className="text-xs font-mono text-carbon-500 mt-0.5 ml-4">
                        {acc.email} {acc.profile_name && `· ${acc.profile_name}`}
                      </p>
                    </td>
                    <td className="font-mono text-sm text-carbon-200">
                      {fmtPrice(sale.price)}
                    </td>
                    <td>
                      {sale.renewal_date ? (
                        <span className={`font-mono text-sm ${daysColor(days)}`}>
                          {fmtDate(sale.renewal_date)}
                          {days !== null && (
                            <span className="text-xs ml-1 opacity-70">
                              ({days > 0 ? `${days}d` : 'hoy'})
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className="text-carbon-600 font-mono text-xs">—</span>
                      )}
                    </td>
                    <td className="font-mono text-xs text-carbon-500">
                      {fmtDate(sale.sale_date)}
                    </td>
                    <td className="text-right">
                      {wasSent ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-mono text-accent-400">
                          <CheckCircle2 size={13} /> Enviado
                        </span>
                      ) : (
                        <button
                          className="btn-whatsapp py-1.5 px-3 text-xs"
                          onClick={() => setSendPanel({ open: true, sale })}
                          title="Entregar credenciales por WhatsApp"
                        >
                          <Send size={12} />
                          Entregar por WhatsApp
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-carbon-700">
            <span className="text-xs font-mono text-carbon-500">Página {page} de {totalPages}</span>
            <div className="flex gap-2">
              <button className="btn-secondary py-1.5 px-3 text-xs" onClick={() => setPage((p) => p - 1)} disabled={page === 1}>Anterior</button>
              <button className="btn-secondary py-1.5 px-3 text-xs" onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages}>Siguiente</button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <NewSaleModal
        open={newSaleOpen}
        onClose={() => setNewSale(false)}
        onSaved={fetchSales}
      />

      <SendCredentialsPanel
        open={sendPanel.open}
        onClose={() => setSendPanel({ open: false, sale: null })}
        sale={sendPanel.sale}
        onConfirm={handleSendCredentials}
        loading={sendLoading}
      />
    </div>
  )
}
