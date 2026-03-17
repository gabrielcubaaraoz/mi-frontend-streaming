import { useState, useEffect } from 'react'
import { Save, RefreshCw, Palette, MessageSquare, Building2, Zap, Check, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

const STORAGE_KEY = 'streampanel_config'

const DEFAULT_CONFIG = {
  businessName:   'Cine Con Gabo',
  businessPhone:  '+51969334902',
  currency:       'S/',
  accentColor:    '#00ff88',
  credentialsMsg: '✅ *Hola {nombre}!* Tus credenciales de *{plataforma}* están listas:\n\n📧 *Correo:* {email}\n🔑 *Contraseña:* {password}\n👤 *Perfil:* {perfil}\n🔢 *PIN:* {pin}\n📅 *Vence:* {vencimiento}\n\n⚠️ _No cambies la contraseña ni el correo._\nPara soporte, escríbenos aquí. ¡Disfruta! 🎬',
  renewalMsg:     '⏰ *Recordatorio de renovación* — {plataforma}\n\nHola *{nombre}*, tu suscripción vence en *{dias} día(s)* ({fecha}).\n\nPara renovar y no perder acceso, contáctanos 💬',
  showWAButton:   true,
  compactTable:   false,
}

const ACCENT_PRESETS = [
  { color: '#00ff88', label: 'Verde neón' },
  { color: '#38bdf8', label: 'Azul cielo' },
  { color: '#a78bfa', label: 'Violeta' },
  { color: '#fb923c', label: 'Naranja' },
  { color: '#f472b6', label: 'Rosa' },
  { color: '#facc15', label: 'Amarillo' },
]

function Section({ icon: Icon, title, sub, children }) {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center">
          <Icon size={16} className="text-accent-400" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-carbon-100 text-sm">{title}</h3>
          {sub && <p className="text-xs text-carbon-400 mt-0.5">{sub}</p>}
        </div>
      </div>
      <div className="section-divider !my-4" />
      {children}
    </div>
  )
}

function Field({ label, hint, children }) {
  return (
    <div className="mb-4">
      <label className="field-label">{label}</label>
      {children}
      {hint && <p className="text-xs text-carbon-500 mt-1.5 font-mono">{hint}</p>}
    </div>
  )
}

function Toggle({ value, onChange, label }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-carbon-700/40 last:border-0">
      <span className="text-sm text-carbon-200">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`toggle-base w-11 h-6 ${value ? 'bg-accent-500' : 'bg-carbon-600'}`}>
        <span className={`toggle-thumb ${value ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  )
}

export function getConfig() {
  try {
    return { ...DEFAULT_CONFIG, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }
  } catch { return DEFAULT_CONFIG }
}

export default function PersonalizacionPage() {
  const [config, setConfig] = useState(getConfig)
  const [saved, setSaved] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const set = (key, val) => setConfig(c => ({ ...c, [key]: val }))

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
    // Aplicar color acento al documento
    document.documentElement.style.setProperty('--color-accent', config.accentColor)
    setSaved(true)
    toast.success('¡Configuración guardada!')
    setTimeout(() => setSaved(false), 2500)
  }

  const reset = () => {
    setConfig(DEFAULT_CONFIG)
    localStorage.removeItem(STORAGE_KEY)
    toast('Configuración restablecida', { icon: '↺' })
  }

  // Generar preview del mensaje de credenciales
  const previewMsg = config.credentialsMsg
    .replace('{nombre}',     'Juan Pérez')
    .replace('{plataforma}', 'Netflix')
    .replace('{email}',      'cuenta@gmail.com')
    .replace('{password}',   'Clave2026#')
    .replace('{perfil}',     'Perfil1')
    .replace('{pin}',        '8520')
    .replace('{vencimiento}','17/04/2026')

  return (
    <div className="animate-fade-in max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="page-title flex items-center gap-2">
          <Palette size={22} className="text-accent-500" />
          Personalización
        </h1>
        <p className="page-subtitle">Configura el nombre, apariencia y mensajes de tu plataforma</p>
      </div>

      <div className="space-y-5">

        {/* Negocio */}
        <Section icon={Building2} title="Información del negocio" sub="Datos generales de tu negocio">
          <Field label="Nombre del negocio">
            <input className="input-field" value={config.businessName}
              onChange={e => set('businessName', e.target.value)}
              placeholder="Cine Con Gabo" />
          </Field>
          <Field label="Número de WhatsApp" hint="Con código de país, ej: +51987654321">
            <input className="input-field" value={config.businessPhone}
              onChange={e => set('businessPhone', e.target.value)}
              placeholder="+51987654321" />
          </Field>
          <Field label="Símbolo de moneda">
            <select className="select-field" value={config.currency}
              onChange={e => set('currency', e.target.value)}>
              <option value="S/">S/ (Sol peruano)</option>
              <option value="$">$ (Dólar)</option>
              <option value="€">€ (Euro)</option>
              <option value="COP">COP (Peso colombiano)</option>
              <option value="MXN">MXN (Peso mexicano)</option>
            </select>
          </Field>
        </Section>

        {/* Apariencia */}
        <Section icon={Palette} title="Apariencia" sub="Color principal de la interfaz">
          <label className="field-label">Color de acento</label>
          <div className="flex items-center gap-3 flex-wrap mb-4">
            {ACCENT_PRESETS.map(({ color, label }) => (
              <button key={color} title={label}
                onClick={() => set('accentColor', color)}
                className={`w-9 h-9 rounded-xl border-2 transition-all duration-150 hover:scale-110 ${config.accentColor === color ? 'border-white ring-2 ring-white/30 scale-110' : 'border-transparent'}`}
                style={{ background: color }} />
            ))}
            <div className="flex items-center gap-2 ml-2">
              <label className="text-xs text-carbon-400">Personalizado:</label>
              <input type="color" value={config.accentColor}
                onChange={e => set('accentColor', e.target.value)}
                className="w-9 h-9 rounded-xl cursor-pointer border border-carbon-600 bg-transparent" />
            </div>
          </div>
          <div className="p-4 rounded-xl border border-carbon-700 bg-carbon-800/50">
            <p className="text-xs text-carbon-400 mb-3 font-mono">Vista previa</p>
            <div className="flex items-center gap-3 flex-wrap">
              <button className="btn-primary text-xs" style={{ background: config.accentColor, color: '#0d1117' }}>
                Botón primario
              </button>
              <span className="badge" style={{ background: `${config.accentColor}15`, color: config.accentColor, border: `1px solid ${config.accentColor}30` }}>
                ● Disponible
              </span>
              <span className="text-sm font-display font-bold" style={{ color: config.accentColor }}>
                Texto activo
              </span>
            </div>
          </div>

          <div className="mt-4">
            <label className="field-label">Opciones de visualización</label>
            <div className="card p-2">
              <Toggle value={config.showWAButton}  onChange={v => set('showWAButton', v)}  label="Mostrar botón de WhatsApp en ventas" />
              <Toggle value={config.compactTable}  onChange={v => set('compactTable', v)}  label="Tablas compactas (más filas visibles)" />
            </div>
          </div>
        </Section>

        {/* Mensajes WhatsApp */}
        <Section icon={MessageSquare} title="Mensajes de WhatsApp" sub="Personaliza los textos que se envían automáticamente">
          <div className="mb-1 flex items-center justify-between">
            <label className="field-label mb-0">Mensaje de credenciales</label>
            <button onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-1 text-xs text-carbon-400 hover:text-carbon-200 transition-colors">
              {showPreview ? <EyeOff size={12} /> : <Eye size={12} />}
              {showPreview ? 'Ocultar' : 'Vista previa'}
            </button>
          </div>
          <p className="text-xs text-carbon-500 font-mono mb-2">
            Variables: {'{nombre}'} {'{plataforma}'} {'{email}'} {'{password}'} {'{perfil}'} {'{pin}'} {'{vencimiento}'}
          </p>
          <textarea className="input-field resize-none" rows={6} value={config.credentialsMsg}
            onChange={e => set('credentialsMsg', e.target.value)} />

          {showPreview && (
            <div className="mt-3 p-4 rounded-xl bg-[#075E54]/20 border border-[#075E54]/30">
              <p className="text-xs text-carbon-400 mb-2 font-mono">WhatsApp preview:</p>
              <div className="bg-[#DCF8C6]/10 border border-[#DCF8C6]/20 rounded-xl p-3 max-w-sm">
                <p className="text-xs text-carbon-200 whitespace-pre-wrap leading-relaxed">{previewMsg}</p>
              </div>
            </div>
          )}

          <div className="mt-4">
            <label className="field-label">Mensaje de recordatorio de renovación</label>
            <p className="text-xs text-carbon-500 font-mono mb-2">
              Variables: {'{nombre}'} {'{plataforma}'} {'{dias}'} {'{fecha}'}
            </p>
            <textarea className="input-field resize-none" rows={4} value={config.renewalMsg}
              onChange={e => set('renewalMsg', e.target.value)} />
          </div>
        </Section>

        {/* Botones de acción */}
        <div className="flex items-center justify-between pt-2 pb-8">
          <button onClick={reset} className="btn-ghost text-carbon-400 hover:text-rose-400">
            <RefreshCw size={14} />
            Restablecer por defecto
          </button>
          <button onClick={save} className="btn-primary gap-2 px-6">
            {saved ? <Check size={15} /> : <Save size={15} />}
            {saved ? 'Guardado ✓' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  )
}
