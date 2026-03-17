import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Package, Users, ShoppingCart,
  MessageSquare, Settings, Zap, Activity
} from 'lucide-react'

const NAV = [
  { to: '/',          icon: LayoutDashboard, label: 'Dashboard'   },
  { to: '/inventory', icon: Package,         label: 'Inventario'  },
  { to: '/customers', icon: Users,           label: 'Clientes'    },
  { to: '/sales',     icon: ShoppingCart,    label: 'Ventas'      },
  { to: '/messages',  icon: MessageSquare,   label: 'Mensajes'    },
]

export default function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 h-screen w-60 flex flex-col z-40 border-r border-carbon-700/50"
           style={{ background: 'linear-gradient(180deg, #0d1117 0%, #090c12 100%)' }}>

      {/* Logo */}
      <div className="px-5 py-5 border-b border-carbon-700/40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
               style={{ background: 'linear-gradient(135deg, #00ff88, #00cc6a)', boxShadow: '0 0 16px rgba(0,255,136,0.3)' }}>
            <Zap size={18} className="text-carbon-950" fill="currentColor" />
          </div>
          <div>
            <div className="font-display font-bold text-sm text-carbon-50 leading-tight">StreamPanel</div>
            <div className="text-xs text-carbon-400 font-mono">Admin v2.0</div>
          </div>
        </div>
      </div>

      {/* Status badge */}
      <div className="px-4 pt-4">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-accent-500/5 border border-accent-500/15">
          <span className="w-2 h-2 rounded-full bg-accent-500 animate-pulse-dot flex-shrink-0" />
          <span className="text-xs text-accent-400 font-mono">Sistema activo</span>
          <Activity size={11} className="text-accent-500 ml-auto" />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 mt-2">
        <p className="text-xs font-mono text-carbon-500 uppercase tracking-widest px-3 mb-2">Navegación</p>
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) =>
              `nav-item group ${isActive ? 'active' : ''}`
            }>
            {({ isActive }) => (
              <>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200
                  ${isActive ? 'bg-accent-500/20' : 'bg-carbon-700/50 group-hover:bg-carbon-700'}`}>
                  <Icon size={15} className={isActive ? 'text-accent-400' : 'text-carbon-400 group-hover:text-carbon-200'} />
                </div>
                <span>{label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-500" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Settings link */}
      <div className="px-3 pb-4 border-t border-carbon-700/40 pt-3">
        <NavLink to="/settings"
          className={({ isActive }) => `nav-item group ${isActive ? 'active' : ''}`}>
          {({ isActive }) => (
            <>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                ${isActive ? 'bg-accent-500/20' : 'bg-carbon-700/50 group-hover:bg-carbon-700'}`}>
                <Settings size={15} className={isActive ? 'text-accent-400' : 'text-carbon-400 group-hover:text-carbon-200'} />
              </div>
              <span>Personalización</span>
            </>
          )}
        </NavLink>
      </div>
    </aside>
  )
}
