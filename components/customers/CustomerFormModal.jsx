import { useState, useEffect } from 'react'
import { Modal, Spinner } from '../../index'
import { customersApi } from '../../services/api'
import toast from 'react-hot-toast'

const EMPTY = { full_name: '', whatsapp_number: '', email: '', notes: '' }

export default function CustomerFormModal({ open, onClose, onSaved, editCustomer = null }) {
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(false)
  const isEdit = !!editCustomer

  useEffect(() => {
    setForm(
      editCustomer
        ? {
            full_name:        editCustomer.full_name || '',
            whatsapp_number:  editCustomer.whatsapp_number || '',
            email:            editCustomer.email || '',
            notes:            editCustomer.notes || '',
          }
        : EMPTY
    )
  }, [editCustomer, open])

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isEdit) {
        await customersApi.update(editCustomer.id, form)
        toast.success('Cliente actualizado')
      } else {
        await customersApi.create(form)
        toast.success('Cliente registrado')
      }
      onSaved()
      onClose()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Editar cliente' : 'Nuevo cliente'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="field-label">Nombre completo *</label>
          <input
            type="text"
            className="input-field"
            placeholder="Ana Ramos"
            value={form.full_name}
            onChange={set('full_name')}
            required
            minLength={2}
          />
        </div>

        <div>
          <label className="field-label">WhatsApp (formato internacional) *</label>
          <input
            type="tel"
            className="input-field"
            placeholder="+51987654321"
            value={form.whatsapp_number}
            onChange={set('whatsapp_number')}
            required
          />
          <p className="text-xs font-mono text-carbon-500 mt-1">Incluye el código de país. Ej: +51 para Perú</p>
        </div>

        <div>
          <label className="field-label">Correo electrónico</label>
          <input
            type="email"
            className="input-field"
            placeholder="cliente@gmail.com"
            value={form.email}
            onChange={set('email')}
          />
        </div>

        <div>
          <label className="field-label">Notas internas</label>
          <textarea
            className="input-field resize-none"
            rows={2}
            placeholder="Cliente frecuente, prefiere Netflix..."
            value={form.notes}
            onChange={set('notes')}
          />
        </div>

        <div className="flex gap-3 justify-end pt-2 border-t border-carbon-700">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading && <Spinner size={14} className="text-carbon-950" />}
            {isEdit ? 'Guardar cambios' : 'Registrar cliente'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
