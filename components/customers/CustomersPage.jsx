import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, RefreshCw, Pencil, UserX, Users, Bell } from 'lucide-react'
import toast from 'react-hot-toast'
import { customersApi } from '../../services/api'
import {
  PageHeader, SkeletonTable, EmptyState,
  ConfirmDialog, StatCard, Spinner,
} from '../../index'
import CustomerFormModal from './CustomerFormModal'
import { fmtDate } from '../../utils/helpers'

export default function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading]     = useState(true)
  const [total, setTotal]         = useState(0)
  const [search, setSearch]       = useState('')
  const [page, setPage]           = useState(1)
  const LIMIT = 20

  const [formOpen, setFormOpen]         = useState(false)
  const [editCustomer, setEdit]         = useState(null)
  const [deactivateTarget, setDeactTarget] = useState(null)
  const [deactLoading, setDeactLoad]    = useState(false)
  const [reminderLoading, setReminderLoad] = useState(null)

  const fetchCustomers = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, limit: LIMIT }
      if (search) params.search = search
      const res = await customersApi.list(params)
      setCustomers(res.data || [])
      setTotal(res.pagination?.total || 0)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => {
    const t = setTimeout(fetchCustomers, search ? 400 : 0)
    return () => clearTimeout(t)
  }, [fetchCustomers])

  const handleDeactivate = async () => {
    setDeactLoad(true)
    try {
      await customersApi.deactivate(deactivateTarget.id)
      toast.success('Cliente desactivado')
      setDeactTarget(null)
      fetchCustomers()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setDeactLoad(false)
    }
  }

  const handleSendReminder = async (customer) => {
    setReminderLoad(customer.id)
    try {
      await customersApi.sendReminder(customer.id)
      toast.success(`Recordatorio enviado a ${customer.full_name}`)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setReminderLoad(null)
    }
  }

  const active   = customers.filter((c) => c.is_active).length
  const inactive = customers.filter((c) => !c.is_active).length
  const totalPages = Math.ceil(total / LIMIT)

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Clientes"
        description={`${total} clientes registrados`}
        action={
          <button className="btn-primary" onClick={() => { setEdit(null); setFormOpen(true) }}>
            <Plus size={16} /> Nuevo cliente
          </button>
        }
      />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Total"    value={total}    />
        <StatCard label="Activos"  value={active}   accent />
        <StatCard label="Inactivos" value={inactive} />
      </div>

      {/* Filtros */}
      <div className="card mb-4 p-3 flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-carbon-400" />
          <input
            type="text"
            className="input-field pl-9 py-2 text-sm"
            placeholder="Buscar por nombre o WhatsApp..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <button className="btn-ghost py-2 text-xs" onClick={fetchCustomers}>
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Tabla */}
      <div className="card overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>WhatsApp</th>
              <th>Correo</th>
              <th>Registrado</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <SkeletonTable rows={8} cols={6} />
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-0">
                  <EmptyState
                    icon={Users}
                    title="Sin clientes"
                    description="Registra tu primer cliente para comenzar a vender."
                    action={
                      <button className="btn-primary" onClick={() => setFormOpen(true)}>
                        <Plus size={15} /> Nuevo cliente
                      </button>
                    }
                  />
                </td>
              </tr>
            ) : (
              customers.map((c, i) => (
                <tr key={c.id} style={{ animationDelay: `${i * 30}ms` }} className="animate-fade-in">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-carbon-700 flex items-center justify-center text-xs font-display font-bold text-carbon-300 flex-shrink-0">
                        {c.full_name?.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-medium text-carbon-100">{c.full_name}</span>
                    </div>
                  </td>
                  <td>
                    <a
                      href={`https://wa.me/${c.whatsapp_number?.replace('+', '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-sm text-[#25D366] hover:underline"
                    >
                      {c.whatsapp_number}
                    </a>
                  </td>
                  <td className="font-mono text-xs text-carbon-400">
                    {c.email || <span className="text-carbon-600">—</span>}
                  </td>
                  <td className="font-mono text-xs text-carbon-400">{fmtDate(c.created_at)}</td>
                  <td>
                    <span className={`badge ${c.is_active ? 'badge-available' : 'badge-expired'}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {c.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button
                        className="btn-ghost p-2 text-carbon-400 hover:text-carbon-100"
                        onClick={() => { setEdit(c); setFormOpen(true) }}
                        title="Editar"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        className="btn-whatsapp py-1.5 px-2.5 text-xs"
                        onClick={() => handleSendReminder(c)}
                        disabled={reminderLoading === c.id || !c.is_active}
                        title="Enviar recordatorio"
                      >
                        {reminderLoading === c.id
                          ? <Spinner size={12} className="text-[#25D366]" />
                          : <Bell size={12} />
                        }
                        Recordatorio
                      </button>
                      <button
                        className="btn-ghost p-2 text-carbon-400 hover:text-amber-400"
                        onClick={() => setDeactTarget(c)}
                        title="Desactivar"
                        disabled={!c.is_active}
                      >
                        <UserX size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-carbon-700">
            <span className="text-xs font-mono text-carbon-500">
              Página {page} de {totalPages}
            </span>
            <div className="flex gap-2">
              <button className="btn-secondary py-1.5 px-3 text-xs" onClick={() => setPage((p) => p - 1)} disabled={page === 1}>Anterior</button>
              <button className="btn-secondary py-1.5 px-3 text-xs" onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages}>Siguiente</button>
            </div>
          </div>
        )}
      </div>

      <CustomerFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSaved={fetchCustomers}
        editCustomer={editCustomer}
      />

      <ConfirmDialog
        open={!!deactivateTarget}
        onClose={() => setDeactTarget(null)}
        onConfirm={handleDeactivate}
        title="¿Desactivar este cliente?"
        description={`${deactivateTarget?.full_name} quedará inactivo. Los registros de ventas se mantienen.`}
        confirmLabel="Desactivar"
        loading={deactLoading}
      />
    </div>
  )
}
