import { useState, useEffect } from 'react'
import { Modal, Spinner } from '../../index'
import { PLATFORMS } from '../../utils/helpers'
import { accountsApi } from '../../services/api'
import toast from 'react-hot-toast'
import { Eye, EyeOff } from 'lucide-react'

const EMPTY = {
  platform_id: '',
  email: '',
  password: '',
  expiration_date: '',
  profile_name: '',
  pin: '',
  notes: '',
}

// Slug → UUID mapping se obtiene del backend. Aquí usamos los slugs
// que coinciden con la tabla `platforms` en Supabase.
// Si el usuario tiene acceso a /api/platforms, podemos cargarlos dinámicamente.
// Por ahora los slugs se usan como identificador visual; el form envía platform_id (UUID).

export default function AccountFormModal({ open, onClose, onSaved, editAccount = null, platformsList = [] }) {
  const [form, setForm] = useState(EMPTY)
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const isEdit = !!editAccount

  useEffect(() => {
    if (editAccount) {
      setForm({
        platform_id: editAccount.platforms?.id || '',
        email: editAccount.email || '',
        password: '',           // nunca se pre-rellena
        expiration_date: editAccount.expiration_date?.slice(0, 10) || '',
        profile_name: editAccount.profile_name || '',
        pin: editAccount.pin || '',
        notes: editAccount.notes || '',
      })
    } else {
      setForm(EMPTY)
    }
    setShowPass(false)
  }, [editAccount, open])

  const set = (field) => (e) =>
    setForm((p) => ({ ...p, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.platform_id) return toast.error('Selecciona una plataforma')
    if (!isEdit && !form.password) return toast.error('La contraseña es requerida')

    setLoading(true)
    try {
      const payload = { ...form }
      if (isEdit && !payload.password) delete payload.password

      if (isEdit) {
        await accountsApi.update(editAccount.id, payload)
        toast.success('Cuenta actualizada')
      } else {
        await accountsApi.create(payload)
        toast.success('Cuenta creada correctamente')
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
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Editar cuenta' : 'Nueva cuenta de streaming'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Plataforma */}
        <div>
          <label className="field-label">Plataforma *</label>
          <select
            className="select-field"
            value={form.platform_id}
            onChange={set('platform_id')}
            required
          >
            <option value="">— Seleccionar —</option>
            {platformsList.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Email */}
        <div>
          <label className="field-label">Correo de la cuenta *</label>
          <input
            type="email"
            className="input-field"
            placeholder="cuenta@gmail.com"
            value={form.email}
            onChange={set('email')}
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="field-label">
            Contraseña {isEdit && <span className="normal-case tracking-normal font-sans text-carbon-500">(dejar vacío para no cambiar)</span>}
          </label>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              className="input-field pr-10"
              placeholder={isEdit ? '••••••••' : 'Contraseña de la cuenta'}
              value={form.password}
              onChange={set('password')}
              required={!isEdit}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-carbon-400 hover:text-carbon-200 transition-colors"
              onClick={() => setShowPass((v) => !v)}
            >
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* Fecha + Perfil */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="field-label">Fecha de vencimiento *</label>
            <input
              type="date"
              className="input-field"
              value={form.expiration_date}
              onChange={set('expiration_date')}
              required
            />
          </div>
          <div>
            <label className="field-label">Perfil asignado</label>
            <input
              type="text"
              className="input-field"
              placeholder="Perfil 2"
              value={form.profile_name}
              onChange={set('profile_name')}
            />
          </div>
        </div>

        {/* PIN + Notes */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="field-label">PIN del perfil</label>
            <input
              type="text"
              className="input-field"
              placeholder="1234"
              maxLength={10}
              value={form.pin}
              onChange={set('pin')}
            />
          </div>
          <div>
            <label className="field-label">Notas</label>
            <input
              type="text"
              className="input-field"
              placeholder="Opcional"
              value={form.notes}
              onChange={set('notes')}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-2 border-t border-carbon-700 mt-2">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading && <Spinner size={14} className="text-carbon-950" />}
            {isEdit ? 'Guardar cambios' : 'Crear cuenta'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
