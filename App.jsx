import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout            from './components/layout/Layout'
import DashboardPage     from './components/DashboardPage'
import InventoryPage     from './components/inventory/InventoryPage'
import CustomersPage     from './components/customers/CustomersPage'
import SalesPage         from './components/sales/SalesPage'
import MessagesPage      from './components/MessagesPage'
import PersonalizacionPage from './components/PersonalizacionPage'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#151b23',
            color: '#d8e8f5',
            border: '1px solid rgba(255,255,255,0.08)',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '13px',
            borderRadius: '14px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          },
          success: { iconTheme: { primary: '#00ff88', secondary: '#0d1117' } },
          error:   { iconTheme: { primary: '#f43f5e', secondary: '#0d1117' } },
          duration: 3000,
        }}
      />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/"          element={<DashboardPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/sales"     element={<SalesPage />} />
          <Route path="/messages"  element={<MessagesPage />} />
          <Route path="/settings"  element={<PersonalizacionPage />} />
          <Route path="*"          element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
