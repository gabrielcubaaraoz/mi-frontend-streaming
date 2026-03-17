import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-carbon-900">
      <Sidebar />
      <main className="flex-1 ml-60 min-h-screen relative">
        {/* Subtle ambient glow top */}
        <div className="fixed top-0 left-60 right-0 h-px z-30"
             style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(0,255,136,0.2) 30%, transparent 100%)' }} />
        {/* Content */}
        <div className="relative z-10 p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
