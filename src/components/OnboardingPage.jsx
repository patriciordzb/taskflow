import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function OnboardingPage({ onCreateWorkspace }) {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCreate = async () => {
    if (!name.trim()) return
    setLoading(true)
    setError('')
    const { error } = await onCreateWorkspace(name.trim())
    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--bg-tertiary)', padding: 16
    }}>
      <div style={{
        width: '100%', maxWidth: 440,
        background: 'var(--bg-primary)',
        borderRadius: 'var(--radius-lg)',
        border: '0.5px solid var(--border)',
        padding: 40, display: 'flex', flexDirection: 'column', gap: 24,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 52, height: 52, borderRadius: 12, background: '#185FA5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <svg width="28" height="28" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1.5" fill="white" opacity="0.9"/>
              <rect x="9" y="2" width="5" height="5" rx="1.5" fill="white" opacity="0.55"/>
              <rect x="2" y="9" width="5" height="5" rx="1.5" fill="white" opacity="0.55"/>
              <rect x="9" y="9" width="5" height="5" rx="1.5" fill="white" opacity="0.9"/>
            </svg>
          </div>
          <div style={{ fontSize: 22, fontWeight: 500, marginBottom: 6 }}>
            Crea tu workspace
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Un workspace es el espacio de trabajo de tu equipo. Puedes invitar a otros después.
          </div>
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', gap: 8 }}>
          {['Crear workspace', 'Invitar equipo', 'Empezar'].map((step, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', margin: '0 auto 6px',
                background: i === 0 ? '#185FA5' : 'var(--bg-secondary)',
                color: i === 0 ? '#fff' : 'var(--text-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 500,
                border: i === 0 ? 'none' : '0.5px solid var(--border)',
              }}>{i + 1}</div>
              <div style={{ fontSize: 11, color: i === 0 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                {step}
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Nombre del workspace
          </label>
          <input
            type="text"
            placeholder="Ej: GRX-810 Research, Mi Startup..."
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
            autoFocus
            style={{
              padding: '10px 12px', fontSize: 14,
              border: '0.5px solid var(--border-strong)',
              borderRadius: 'var(--radius)',
              background: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font)', outline: 'none', width: '100%',
            }}
          />
          {error && (
            <div style={{ fontSize: 13, color: 'var(--red)', background: 'var(--red-light)', padding: '8px 12px', borderRadius: 'var(--radius)' }}>
              {error}
            </div>
          )}
        </div>

        <button
          onClick={handleCreate}
          disabled={loading || !name.trim()}
          style={{
            padding: '12px', fontSize: 14, fontWeight: 500,
            background: name.trim() ? '#185FA5' : 'var(--bg-secondary)',
            color: name.trim() ? '#fff' : 'var(--text-muted)',
            border: 'none', borderRadius: 'var(--radius)',
            cursor: name.trim() ? 'pointer' : 'default',
            transition: 'all 0.15s',
          }}
        >
          {loading ? 'Creando...' : 'Crear workspace →'}
        </button>
      </div>
    </div>
  )
}
