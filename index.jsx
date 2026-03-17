import { X, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { cn, STATUS_MAP } from './utils/helpers'

// ──────────────────────────────────────────
// Modal
// ──────────────────────────────────────────
export function Modal({ open, onClose, title, children, width = 'max-w-lg' }) {
  if (!open) return null
  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div
        className={cn('modal-panel', width)}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-carbon-700">
          <h2 className="font-display font-semibold text-base text-carbon-50">{title}</h2>
          <button
            onClick={onClose}
            className="btn-ghost p-1.5 rounded-lg text-carbon-400 hover:text-carbon-100"
          >
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────
// Badge de estado
// ──────────────────────────────────────────
export function StatusBadge({ status }) {
  const info = STATUS_MAP[status] || { label: status, className: 'badge' }
  return (
    <span className={info.className}>
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-current animate-pulse-dot" />
      {info.label}
    </span>
  )
}

// ──────────────────────────────────────────
// Skeleton loader
// ──────────────────────────────────────────
export function SkeletonRow({ cols = 5 }) {
  return (
    <tr className="border-b border-carbon-700/50">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-4">
          <div className={cn('skeleton h-4 rounded', i === 0 ? 'w-32' : 'w-24')} />
        </td>
      ))}
    </tr>
  )
}

export function SkeletonTable({ rows = 5, cols = 5 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} cols={cols} />
      ))}
    </>
  )
}

// ──────────────────────────────────────────
// Empty state
// ──────────────────────────────────────────
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-carbon-700 flex items-center justify-center mb-4">
        {Icon && <Icon size={24} className="text-carbon-400" />}
      </div>
      <p className="font-display font-semibold text-carbon-200 mb-1">{title}</p>
      {description && (
        <p className="text-sm text-carbon-400 mb-4 max-w-xs">{description}</p>
      )}
      {action}
    </div>
  )
}

// ──────────────────────────────────────────
// Spinner inline
// ──────────────────────────────────────────
export function Spinner({ size = 16, className = '' }) {
  return (
    <Loader2
      size={size}
      className={cn('animate-spin text-accent-500', className)}
    />
  )
}

// ──────────────────────────────────────────
// Stat card
// ──────────────────────────────────────────
export function StatCard({ label, value, sub, accent = false }) {
  return (
    <div className={cn(
      'card p-5 flex flex-col gap-1',
      accent && 'border-accent-500/30 bg-accent-500/5'
    )}>
      <span className="text-xs font-mono text-carbon-400 uppercase tracking-widest">{label}</span>
      <span className={cn(
        'text-3xl font-display font-bold',
        accent ? 'text-accent-400' : 'text-carbon-50'
      )}>
        {value}
      </span>
      {sub && <span className="text-xs text-carbon-500">{sub}</span>}
    </div>
  )
}

// ──────────────────────────────────────────
// Confirm dialog
// ──────────────────────────────────────────
export function ConfirmDialog({ open, onClose, onConfirm, title, description, confirmLabel = 'Confirmar', danger = false, loading = false }) {
  if (!open) return null
  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal-panel max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 pt-6 pb-2">
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center mb-4',
            danger ? 'bg-rose-500/15' : 'bg-amber-500/15'
          )}>
            <AlertCircle size={20} className={danger ? 'text-rose-400' : 'text-amber-400'} />
          </div>
          <h3 className="font-display font-semibold text-carbon-50 mb-2">{title}</h3>
          <p className="text-sm text-carbon-400">{description}</p>
        </div>
        <div className="flex gap-3 justify-end px-6 py-4 border-t border-carbon-700 mt-4">
          <button className="btn-secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </button>
          <button
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-display font-semibold text-sm transition-all',
              danger
                ? 'bg-rose-500 hover:bg-rose-400 text-white'
                : 'bg-amber-500 hover:bg-amber-400 text-carbon-950'
            )}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading && <Spinner size={14} className="text-current" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────
// Platform dot
// ──────────────────────────────────────────
export function PlatformDot({ color, name }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-sm">
      <span
        className="inline-block w-2 h-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: color }}
      />
      {name}
    </span>
  )
}

// ──────────────────────────────────────────
// Page header
// ──────────────────────────────────────────
export function PageHeader({ title, description, action }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-carbon-50 tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-carbon-400 mt-0.5">{description}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}
