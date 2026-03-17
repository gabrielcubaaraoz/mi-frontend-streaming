import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, RefreshCw, Pencil, Trash2, Package } from 'lucide-react'
import toast from 'react-hot-toast'
import { accountsApi, platformsApi } from '../../services/api'
import {
  PageHeader, StatusBadge, SkeletonTable, EmptyState,
  PlatformDot, ConfirmDialog, StatCard,
} from '../../index'
import AccountFormModal from './AccountFormModal'
import { fmtDate, daysUntil, daysColor, getPlatformInfo } from '../../utils/helpers'

const STATUS_FILTERS = [
  { value: '',          label: 'Todos'       },
  { value: 'available', label: 'Disponibles' },
  { value: 'sold',      label: 'Vendidos'    },
  { value: 'expired',   label: 'Vencidos'    },
]

export default function InventoryPage() {
  const [accounts, setAccounts]     = useState([])
  const [platforms, setPlatforms]   = useState([])
  const [loading, setLoading]       = useState(true)
  const [total, setTotal]           = useState(0)

  // Filters
  const [statusFilter, setStatus]   = useState('')
  const [search, setSearch]         = useState('')
  const [page, setPage]             = useState(1)
  const LIMIT = 20

  // Modals
  const [formOpen, setFormOpen]     = useState(false)
  const [editAccount, setEdit]      = useState(null)
  const [deleteTarget, setDelTarget] = useState(null)
  const [deleteLoading, setDelLoad] = useState(false)

  // Stats
  const available = accounts.filter((a) => a.status === 'available').length
  const sold      = accounts.filter((a) => a.status === 'sold').length
  const expired   = accounts.filter((a) => a.status === 'expired').length

  const fetchAccounts = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, limit: LIMIT }
      if (statusFilter) params.status = statusFilter
      if (search)       params.search = search
      const res = await accountsApi.list(params)
      setAccounts(res.data || [])
      setTotal(res.pagination?.total || 0)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter, search])

  const fetchPlatforms = useCallback(async () => {
    try {
      const res = await platformsApi.list()
      setPlatforms(res.data || [])
    } catch {
      // silencioso — usamos lista local de fallback
    }
  }, [])

  useEffect(() => { fetchPlatforms() }, [fetchPlatforms])
  useEffect(() => {
    const t = setTimeout(fetchAccounts, search ? 400 : 0)
    return () => clearTimeout(t)
  }, [fetchAccounts])

  const handleOpenAdd = () => { setEdit(null); setFormOpen(true) }
  const handleOpenEdit = (acc) => { setEdit(acc); setFormOpen(true) }

  const handleDelete = async () => {
    setDelLoad(true)
    try {
      await accountsApi.delete(deleteTarget.id)
      toast.success('Cuenta eliminada')
      setDelTarget(null)
      fetchAccounts()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setDelLoad(false)
    }
  }

  const totalPages = Math.ceil(total / LIMIT)

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Inventario"
        description={`${total} cuentas en total`}
        action={
          <button className="btn-primary" onClick={handleOpenAdd}>
            <Plus size={16} />
            Nueva cuenta
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Disponibles" value={available} accent />
        <StatCard label="Vendidas"    value={sold} />
        <StatCard label="Vencidas"    value={expired} />
      </div>

      {/* Filtros */}
      <div className="card mb-4 p-3 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-carbon-400" />
          <input
            type="text"
            className="input-field pl-9 py-2 text-sm"
            placeholder="Buscar por email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => { setStatus(f.value); setPage(1) }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                statusFilter === f.value
                  ? 'bg-accent-500/15 text-accent-400 border border-accent-500/30'
                  : 'text-carbon-400 hover:text-carbon-200 hover:bg-carbon-800 border border-transparent'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button
          className="btn-ghost py-2 text-xs ml-auto"
          onClick={fetchAccounts}
          title="Recargar"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Tabla */}
      <div className="card overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Plataforma</th>
              <th>Correo</th>
              <th>Perfil</th>
              <th>Vencimiento</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <SkeletonTable rows={8} cols={6} />
            ) : accounts.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-0">
                  <EmptyState
                    icon={Package}
                    title="Sin cuentas"
                    description="Agrega tu primera cuenta de streaming al inventario."
                    action={
                      <button className="btn-primary" onClick={handleOpenAdd}>
                        <Plus size={15} /> Nueva cuenta
                      </button>
                    }
                  />
                </td>
              </tr>
            ) : (
              accounts.map((acc, i) => {
                const pInfo = getPlatformInfo(acc.platforms?.slug)
                const days  = daysUntil(acc.expiration_date)
                return (
                  <tr key={acc.id} style={{ animationDelay: `${i * 30}ms` }} className="animate-fade-in">
                    <td>
                      <PlatformDot
                        color={acc.platforms?.color || pInfo.color}
                        name={acc.platforms?.name || acc.platform_id}
                      />
                    </td>
                    <td className="font-mono text-carbon-200">{acc.email}</td>
                    <td className="text-carbon-400 font-mono text-xs">
                      {acc.profile_name || <span className="text-carbon-600">—</span>}
                    </td>
                    <td>
                      <span className={`font-mono text-sm ${daysColor(days)}`}>
                        {fmtDate(acc.expiration_date)}
                        {days !== null && (
                          <span className="text-xs ml-1.5 opacity-70">
                            ({days > 0 ? `${days}d` : 'vencida'})
                          </span>
                        )}
                      </span>
                    </td>
                    <td><StatusBadge status={acc.status} /></td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button
                          className="btn-ghost p-2 text-carbon-400 hover:text-carbon-100"
                          onClick={() => handleOpenEdit(acc)}
                          title="Editar"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          className="btn-ghost p-2 text-carbon-400 hover:text-rose-400"
                          onClick={() => setDelTarget(acc)}
                          title="Eliminar"
                          disabled={acc.status === 'sold'}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-carbon-700">
            <span className="text-xs font-mono text-carbon-500">
              Página {page} de {totalPages} · {total} registros
            </span>
            <div className="flex gap-2">
              <button
                className="btn-secondary py-1.5 px-3 text-xs"
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
              >
                Anterior
              </button>
              <button
                className="btn-secondary py-1.5 px-3 text-xs"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AccountFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSaved={fetchAccounts}
        editAccount={editAccount}
        platformsList={platforms}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDelTarget(null)}
        onConfirm={handleDelete}
        title="¿Eliminar esta cuenta?"
        description={`Se eliminará la cuenta ${deleteTarget?.email}. Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        danger
        loading={deleteLoading}
      />
    </div>
  )
}
