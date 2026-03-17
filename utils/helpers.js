import { clsx } from 'clsx'
export { clsx as cn }

export const PLATFORMS = {
  netflix:      { name: 'Netflix',         color: '#E50914', icon: '🎬' },
  disney_plus:  { name: 'Disney+',         color: '#113CCF', icon: '✨' },
  prime_video:  { name: 'Prime Video',     color: '#00A8E0', icon: '📦' },
  crunchyroll:  { name: 'Crunchyroll',     color: '#F47521', icon: '⛩️' },
  max:          { name: 'Max',             color: '#002BE7', icon: '🎭' },
  youtube:      { name: 'YouTube Premium', color: '#FF0000', icon: '▶️' },
  spotify:      { name: 'Spotify',         color: '#1DB954', icon: '🎵' },
  adobe:        { name: 'Adobe Creative',  color: '#FF0000', icon: '🎨' },
  office365:    { name: 'Office 365',      color: '#D83B01', icon: '💼' },
  canva:        { name: 'Canva Pro',       color: '#00C4CC', icon: '🖌️' },
  default:      { name: 'Streaming',       color: '#8899aa', icon: '📺' },
}

// Función con ambos nombres para retrocompatibilidad
export const getPlatformInfo = (slug) => PLATFORMS[slug] || PLATFORMS.default
export const getPlatform = getPlatformInfo

export const STATUS_MAP = {
  available: { label: 'Disponible', className: 'badge-available' },
  sold:      { label: 'Vendido',    className: 'badge-sold'      },
  expired:   { label: 'Vencido',   className: 'badge-expired'   },
  pending:   { label: 'Pendiente', className: 'badge-pending'   },
}

export const fmtDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('es-PE', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

export const daysUntil = (dateStr) => {
  if (!dateStr) return null
  return Math.ceil((new Date(dateStr) - new Date()) / 86400000)
}

export const daysColor = (days) => {
  if (days == null) return 'text-carbon-400'
  if (days <= 0) return 'text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded-lg'
  if (days <= 3) return 'text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded-lg'
  if (days <= 7) return 'text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-lg'
  return 'text-carbon-300'
}

export const fmtPrice = (n, currency = 'S/') =>
  n != null ? `${currency} ${parseFloat(n).toFixed(2)}` : '—'

export const truncate = (str, n = 28) =>
  str?.length > n ? str.slice(0, n) + '…' : (str || '—')
