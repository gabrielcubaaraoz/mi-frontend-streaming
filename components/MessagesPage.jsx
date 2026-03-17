import { useState, useEffect, useCallback } from 'react'
import { RefreshCw, MessageSquare, CheckCircle2, XCircle, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'
import { PageHeader, SkeletonTable, EmptyState, StatCard } from '../index'
import { fmtDate } from '../utils/helpers'
import { cn } from '../utils/helpers'

const TYPE_LABELS = {
  credentials:      { label: 'Credenciales',  color: 'text-sky-400'   },
  renewal_reminder: { label: 'Renovación',    color: 'text-amber-400' },
  expiry_warning:   { label: 'Vencimiento',   color: 'text-rose-400'  },
  custom:           { label: 'Personalizado', color: 'text-carbon-300'},
}

const STATUS_STYLES = {
  pending:   'badge-pending',
  sent:      'badge-available',
  failed:    'badge-expired',
  cancelled: 'badge',
}

export default function MessagesPage() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading]   = useState(true)
  const [total, setTotal]       = useState(0)
  const [page, setPage]         = useState(1)
  const LIMIT = 25

  const fetchMessages = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/messages', { params: { page, limit: LIMIT } })
      setMessages(res.data?.data || [])
      setTotal(res.data?.pagination?.total || 0)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => { fetchMessages() }, [fetchMessages])

  const pending   = messages.filter((m) => m.status === 'pending').length
  const sent      = messages.filter((m) => m.status === 'sent').length
  const failed    = messages.filter((m) => m.status === 'failed').length
  const totalPages = Math.ceil(total / LIMIT)

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Mensajes programados"
        description="Cola de envíos WhatsApp gestionada por el cron job"
        action={
          <button className="btn-ghost py-2" onClick={fetchMessages}>
            <RefreshCw size={14} /> Actualizar
          </button>
        }
      />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Total"     value={total}   />
        <StatCard label="Pendientes" value={pending} />
        <StatCard label="Enviados"  value={sent}    accent />
        <StatCard label="Fallidos"  value={failed}  />
      </div>

      {/* Indicador cron */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-carbon-800 border border-carbon-700 mb-5">
        <span className="w-2 h-2 rounded-full bg-accent-500 animate-pulse-dot flex-shrink-0" />
        <p className="text-xs font-mono text-carbon-400">
          Cron job activo — procesa mensajes pendientes cada minuto · Recordatorios automáticos a las 9:00 AM
        </p>
      </div>

      <div className="card overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Cliente</th>
              <th>Destino WA</th>
              <th>Programado</th>
              <th>Enviado</th>
              <th>Estado</th>
              <th>Reintentos</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <SkeletonTable rows={8} cols={7} />
            ) : messages.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-0">
                  <EmptyState
                    icon={MessageSquare}
                    title="Sin mensajes"
                    description="Los mensajes programados aparecerán aquí al registrar ventas o enviar credenciales."
                  />
                </td>
              </tr>
            ) : (
              messages.map((msg, i) => {
                const typeInfo = TYPE_LABELS[msg.message_type] || TYPE_LABELS.custom
                return (
                  <tr key={msg.id} style={{ animationDelay: `${i * 20}ms` }} className="animate-fade-in">
                    <td>
                      <span className={cn('text-xs font-mono font-medium', typeInfo.color)}>
                        {typeInfo.label}
                      </span>
                    </td>
                    <td className="text-sm text-carbon-200">
                      {msg.customers?.full_name || '—'}
                    </td>
                    <td>
                      <span className="font-mono text-xs text-[#25D366]">
                        {msg.customers?.whatsapp_number || '—'}
                      </span>
                    </td>
                    <td className="font-mono text-xs text-carbon-400">
                      {fmtDate(msg.scheduled_at)}
                    </td>
                    <td className="font-mono text-xs text-carbon-400">
                      {msg.sent_at ? fmtDate(msg.sent_at) : <span className="text-carbon-600">—</span>}
                    </td>
                    <td>
                      <span className={STATUS_STYLES[msg.status] || 'badge'}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {msg.status}
                      </span>
                    </td>
                    <td className="font-mono text-xs text-center">
                      {msg.status === 'failed'
                        ? <span className="text-rose-400">{msg.retry_count}/3</span>
                        : <span className="text-carbon-600">{msg.retry_count}</span>
                      }
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-carbon-700">
            <span className="text-xs font-mono text-carbon-500">
              Página {page} de {totalPages} · {total} mensajes
            </span>
            <div className="flex gap-2">
              <button className="btn-secondary py-1.5 px-3 text-xs" onClick={() => setPage((p) => p - 1)} disabled={page === 1}>Anterior</button>
              <button className="btn-secondary py-1.5 px-3 text-xs" onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages}>Siguiente</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
