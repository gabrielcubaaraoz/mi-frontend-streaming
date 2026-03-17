import { useState, useEffect } from 'react'
import { Modal, Spinner } from '../../index'
import { accountsApi, customersApi } from '../../services/api'
import toast from 'react-hot-toast'
import { getPlatformInfo } from '../../utils/helpers'

export default function NewSaleModal({ open, onClose, onSaved }) {
  const [customers, setCustomers]   = useState([])
  const [accounts, setAccounts]     = useState([])
  const [customerId, setCustomerId] = useState('')
  const [accountId, setAccountId]   = useState('')
  const [price, setPrice]           = useState('')
  const [renewalDate, setRenewal]   = useState('')
  const [loading, setLoading]       = useState(false)
  const [fetching, setFetching]     = useState(false)

  useEffect(() => {
    if (!open) return
    setCustomerId(''); setAccountId(''); setPrice(''); setRenewal('')
    const load = async () => {
      setFetching(true)
      try {
        const [custRes, accRes] = await Promise.all([
          customersApi.list({ is_active: true, limit: 100 }),
          accountsApi.list({ status: 'available', limit: 100 }),
        ])
        setCustomers(custRes.data || [])
        setAccounts(accRes.data || [])
      } catch (err) {
        toast.error('Error cargando datos: ' + err.message)
      } finally {
        setFetching(false)
      }
    }
    load()
  }, [open])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!customerId) return toast.error('Selecciona un cliente')
    if (!accountId)  return toast.error('Selecciona una cuenta')
    setLoading(true)
    try {
      await customersApi.createSale(customerId, {
        account_id: accountId,
        price: price ? parseFloat(price) : undefined,
        renewal_date: renewalDate || undefined,
      })
      toast.success('Venta registrada correctamente')
      onSaved()
      onClose()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Registrar nueva venta">
      <form onSubmit={handleSubmit} className="space-y-4">
        {fetching && (
          <div className="flex items-center gap-2 text-sm text-carbon-400 py-2">
            <Spinner size={14} /> Cargando clientes y cuentas disponibles...
          </div>
        )}

        <div>
          <label className="field-label">Cliente *</label>
          <select className="select-field" value={customerId} onChange={(e) => setCustomerId(e.target.value)} required>
            <option value="">— Seleccionar cliente —</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.full_name} · {c.whatsapp_number}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="field-label">Cuenta disponible *</label>
          <select className="select-field" value={accountId} onChange={(e) => setAccountId(e.target.value)} required>
            <option value="">— Seleccionar cuenta —</option>
            {accounts.map((a) => {
              const pInfo = getPlatformInfo(a.platforms?.slug)
              return (
                <option key={a.id} value={a.id}>
                  {a.platforms?.name || pInfo.name} · {a.email} {a.profile_name ? `(${a.profile_name})` : ''}
                </option>
              )
            })}
          </select>
          {accounts.length === 0 && !fetching && (
            <p className="text-xs text-amber-400 font-mono mt-1">
              ⚠ No hay cuentas disponibles en el inventario.
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="field-label">Precio (S/.)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="input-field"
              placeholder="35.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">Renovación del cliente</label>
            <input
              type="date"
              className="input-field"
              value={renewalDate}
              onChange={(e) => setRenewal(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-2 border-t border-carbon-700">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>Cancelar</button>
          <button type="submit" className="btn-primary" disabled={loading || fetching}>
            {loading && <Spinner size={14} className="text-carbon-950" />}
            Registrar venta
          </button>
        </div>
      </form>
    </Modal>
  )
}
