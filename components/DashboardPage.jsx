import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Package, Users, ShoppingCart, TrendingUp,
  ArrowUpRight, Clock, AlertTriangle, Plus,
  Send, ChevronRight, Zap
} from 'lucide-react'
import api from '../services/api'
import { fmtDate, daysColor, PLATFORMS } from '../utils/helpers'

function StatCard({ icon: Icon, label, value, sub, color = 'accent', trend }) {
  const colors = {
    accent: { bg: 'rgba(0,255,136,0.08)', border: 'rgba(0,255,136,0.2)', text: '#00ff88', glow: '0 0 20px rgba(0,255,136,0.15)' },
    sky:    { bg: 'rgba(14,165,233,0.08)', border: 'rgba(14,165,233,0.2)', text: '#38bdf8', glow: '0 0 20px rgba(14,165,233,0.15)' },
    violet: { bg: 'rgba(124,58,237,0.08)', border: 'rgba(124,58,237,0.2)', text: '#a78bfa', glow: '0 0 20px rgba(124,58,237,0.15)' },
    amber:  { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', text: '#fbbf24', glow: '0 0 20px rgba(245,158,11,0.15)' },
  }
  const c = colors[color]
  return (
    <div className="relative rounded-2xl p-5 overflow-hidden transition-all duration-300 hover:-translate-y-1"
         style={{ background: 'linear-gradient(135deg, #151b23 0%, #0d1117 100%)', border: `1px solid ${c.border}`, boxShadow: c.glow }}>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${c.text}40, transparent)` }} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-mono text-carbon-400 uppercase tracking-widest mb-2">{label}</p>
          <p className="text-4xl font-display font-bold leading-none stat-number" style={{ color: c.text }}>{value}</p>
          {sub && <p className="text-xs text-carbon-400 mt-2">{sub}</p>}
        </div>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
             style={{ background: c.bg, border: `1px solid ${c.border}` }}>
          <Icon size={20} style={{ color: c.text }} />
        </div>
      </div>
      {trend !== undefined && (
        <div className="flex items-center gap-1 mt-3">
          <ArrowUpRight size={12} style={{ color: c.text }} />
          <span className="text-xs font-mono" style={{ color: c.text }}>{trend}</span>
        </div>
      )}
    </div>
  )
}

function QuickAction({ icon: Icon, label, sub, to, color = '#00ff88' }) {
  return (
    <Link to={to}
      className="flex items-center gap-4 p-4 rounded-2xl border border-carbon-700/50 bg-carbon-800/60
                 hover:border-carbon-600 hover:bg-carbon-800 transition-all duration-200 group">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200"
           style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-display font-semibold text-carbon-100">{label}</p>
        <p className="text-xs text-carbon-400 mt-0.5">{sub}</p>
      </div>
      <ChevronRight size={14} className="text-carbon-500 group-hover:text-carbon-300 transition-colors" />
    </Link>
  )
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [expiring, setExpiring] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/accounts?limit=1'),
      api.get('/accounts?status=available&limit=1'),
      api.get('/accounts?status=sold&limit=1'),
      api.get('/customers?limit=1'),
      api.get('/accounts/expiring?days=7'),
    ]).then(([all, avail, sold, cust, exp]) => {
      setStats({
        total:     all.data.pagination?.total ?? 0,
        available: avail.data.pagination?.total ?? 0,
        sold:      sold.data.pagination?.total ?? 0,
        customers: cust.data.pagination?.total ?? 0,
      })
      setExpiring(exp.data.data ?? [])
    }).finally(() => setLoading(false))
  }, [])

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Zap size={18} className="text-accent-500" />
          <h1 className="page-title">Dashboard</h1>
        </div>
        <p className="page-subtitle">Bienvenido a StreamPanel — tu centro de control</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? (
          Array(4).fill(0).map((_, i) => <div key={i} className="skeleton h-32" />)
        ) : (
          <>
            <StatCard icon={Package}      label="Total cuentas"  value={stats?.total ?? 0}     color="accent"  trend="+2 esta semana" />
            <StatCard icon={TrendingUp}   label="Disponibles"    value={stats?.available ?? 0} color="sky"     sub="Listas para vender" />
            <StatCard icon={ShoppingCart} label="Vendidas"       value={stats?.sold ?? 0}      color="violet"  trend="Activas ahora" />
            <StatCard icon={Users}        label="Clientes"       value={stats?.customers ?? 0} color="amber"   sub="Registrados" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accesos rápidos */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-carbon-100">Acciones rápidas</h2>
          </div>
          <div className="space-y-2.5">
            <QuickAction icon={Plus}  label="Nueva cuenta"    sub="Agrega al inventario"        to="/inventory" color="#00ff88" />
            <QuickAction icon={Users} label="Nuevo cliente"   sub="Registra un comprador"       to="/customers" color="#38bdf8" />
            <QuickAction icon={Send}  label="Entregar acceso" sub="Enviar credenciales por WA"  to="/sales"     color="#a78bfa" />
          </div>
        </div>

        {/* Próximos vencimientos */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-carbon-100 flex items-center gap-2">
              <AlertTriangle size={15} className="text-amber-400" />
              Vencen pronto
            </h2>
            <Link to="/inventory" className="text-xs text-accent-400 hover:text-accent-300 font-mono transition-colors">
              Ver todo →
            </Link>
          </div>
          {loading ? (
            <div className="space-y-2">
              {Array(3).fill(0).map((_, i) => <div key={i} className="skeleton h-12" />)}
            </div>
          ) : expiring.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 rounded-full bg-accent-500/10 flex items-center justify-center mb-3">
                <Clock size={20} className="text-accent-400" />
              </div>
              <p className="text-sm text-carbon-400">Sin vencimientos próximos</p>
              <p className="text-xs text-carbon-500 mt-1">Todas las cuentas están al día</p>
            </div>
          ) : (
            <div className="space-y-2">
              {expiring.slice(0, 5).map(acc => {
                const p = PLATFORMS[acc.platforms?.slug] || PLATFORMS.default
                const days = Math.ceil((new Date(acc.expiration_date) - new Date()) / 86400000)
                return (
                  <div key={acc.id}
                       className="flex items-center gap-3 p-3 rounded-xl bg-carbon-700/40 border border-carbon-700/50">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm"
                         style={{ background: `${p.color}20`, border: `1px solid ${p.color}30` }}>
                      {p.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-carbon-200 truncate">{acc.email}</p>
                      <p className="text-xs text-carbon-500 font-mono">{fmtDate(acc.expiration_date)}</p>
                    </div>
                    <span className={`text-xs font-mono font-bold px-2 py-1 rounded-lg ${daysColor(days)}`}>
                      {days}d
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
