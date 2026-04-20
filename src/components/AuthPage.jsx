import React, { useState } from 'react'
import { supabase } from '../supabase.js'
import { useTranslation } from 'react-i18next'
import i18n from '../i18n/index.js'

const LANGUAGES = [
  { code: 'es', label: 'Español', flag: '🇲🇽' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
]

export default function AuthPage() {
  const { t } = useTranslation()
  const [mode, setMode] = useState('login') // login | register | forgot
  const [step, setStep] = useState(mode === 'register' ? 'lang' : 'form') // lang | form
  const [lang, setLang] = useState(localStorage.getItem('tf_lang') || 'es')
  const [form, setForm] = useState({ email: '', password: '', fullName: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const selectLang = (code) => {
    setLang(code)
    localStorage.setItem('tf_lang', code)
    i18n.changeLanguage(code)
    setStep('form')
  }

  const handleSubmit = async () => {
    setError(''); setLoading(true)
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
        if (error) setError(error.message)
      } else if (mode === 'register') {
        const { error } = await supabase.auth.signUp({
          email: form.email, password: form.password,
          options: { data: { full_name: form.fullName, language: lang } }
        })
        if (error) setError(error.message)
        else setSuccess('Revisa tu correo para confirmar tu cuenta')
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(form.email)
        if (error) setError(error.message)
        else setSuccess('Revisa tu correo para restablecer tu contraseña')
      }
    } finally { setLoading(false) }
  }

  const inputStyle = {
    width: '100%', padding: '10px 12px', fontSize: 14,
    border: '0.5px solid var(--border-strong)',
    borderRadius: 'var(--radius)', background: 'var(--bg-primary)',
    color: 'var(--text-primary)', fontFamily: 'var(--font)', outline: 'none',
  }
  const btnStyle = {
    width: '100%', padding: '11px', fontSize: 14, fontWeight: 500,
    background: '#185FA5', color: '#fff', border: 'none',
    borderRadius: 'var(--radius)', cursor: 'pointer',
  }
  const linkStyle = {
    fontSize: 13, color: '#185FA5', background: 'none',
    border: 'none', cursor: 'pointer', textDecoration: 'underline',
    fontFamily: 'var(--font)',
  }

  // Language selector step
  if (mode === 'register' && step === 'lang') return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-tertiary)', padding: 16 }}>
      <div style={{ width: '100%', maxWidth: 380, background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', border: '0.5px solid var(--border)', padding: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: '#185FA5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1.5" fill="white" opacity="0.9"/>
              <rect x="9" y="2" width="5" height="5" rx="1.5" fill="white" opacity="0.55"/>
              <rect x="2" y="9" width="5" height="5" rx="1.5" fill="white" opacity="0.55"/>
              <rect x="9" y="9" width="5" height="5" rx="1.5" fill="white" opacity="0.9"/>
            </svg>
          </div>
          <div style={{ fontSize: 16, fontWeight: 500 }}>{t('chooseLanguage')}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {LANGUAGES.map(l => (
            <button key={l.code} onClick={() => selectLang(l.code)}
              style={{
                padding: '12px 16px', fontSize: 15,
                border: lang === l.code ? '2px solid #185FA5' : '0.5px solid var(--border-strong)',
                borderRadius: 'var(--radius)',
                background: lang === l.code ? 'var(--blue-light)' : 'var(--bg-primary)',
                color: 'var(--text-primary)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'var(--font)',
              }}
            >
              <span style={{ fontSize: 22 }}>{l.flag}</span>
              <span>{l.label}</span>
            </button>
          ))}
        </div>
        <button onClick={() => setMode('login')} style={{ ...linkStyle, textAlign: 'center' }}>
          {t('alreadyHaveAccount')}
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-tertiary)', padding: 16 }}>
      <div style={{ width: '100%', maxWidth: 380, background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', border: '0.5px solid var(--border)', padding: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 4 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: '#185FA5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1.5" fill="white" opacity="0.9"/>
              <rect x="9" y="2" width="5" height="5" rx="1.5" fill="white" opacity="0.55"/>
              <rect x="2" y="9" width="5" height="5" rx="1.5" fill="white" opacity="0.55"/>
              <rect x="9" y="9" width="5" height="5" rx="1.5" fill="white" opacity="0.9"/>
            </svg>
          </div>
          <div style={{ fontSize: 20, fontWeight: 500 }}>TaskFlow</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{t('tagline')}</div>
        </div>

        {/* Lang selector for login */}
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
          {LANGUAGES.map(l => (
            <button key={l.code} onClick={() => { setLang(l.code); localStorage.setItem('tf_lang', l.code); i18n.changeLanguage(l.code) }}
              style={{
                padding: '4px 10px', fontSize: 12,
                border: lang === l.code ? '1.5px solid #185FA5' : '0.5px solid var(--border-strong)',
                borderRadius: 20, background: 'none', cursor: 'pointer',
                color: lang === l.code ? '#185FA5' : 'var(--text-secondary)',
                fontFamily: 'var(--font)',
              }}
            >{l.flag} {l.label}</button>
          ))}
        </div>

        {/* Form */}
        {mode === 'register' && (
          <input style={inputStyle} type="text" placeholder={t('fullName')}
            value={form.fullName} onChange={e => set('fullName', e.target.value)} />
        )}
        <input style={inputStyle} type="email" placeholder={t('email')}
          value={form.email} onChange={e => set('email', e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        {mode !== 'forgot' && (
          <input style={inputStyle} type="password" placeholder={t('password')}
            value={form.password} onChange={e => set('password', e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        )}

        {error && <div style={{ fontSize: 13, color: 'var(--red)', background: 'var(--red-light)', padding: '8px 12px', borderRadius: 'var(--radius)' }}>{error}</div>}
        {success && <div style={{ fontSize: 13, color: 'var(--green)', background: 'var(--green-light)', padding: '8px 12px', borderRadius: 'var(--radius)' }}>{success}</div>}

        <button onClick={handleSubmit} disabled={loading} style={{ ...btnStyle, opacity: loading ? 0.7 : 1 }}>
          {loading ? '...' : mode === 'login' ? t('login') : mode === 'register' ? t('register') : t('resetPassword')}
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          {mode === 'login' && (
            <>
              <button onClick={() => setMode('forgot')} style={linkStyle}>{t('forgotPassword')}</button>
              <button onClick={() => { setMode('register'); setStep('lang') }} style={linkStyle}>{t('dontHaveAccount')}</button>
            </>
          )}
          {mode === 'register' && (
            <button onClick={() => setMode('login')} style={linkStyle}>{t('alreadyHaveAccount')}</button>
          )}
          {mode === 'forgot' && (
            <button onClick={() => setMode('login')} style={linkStyle}>{t('login')}</button>
          )}
        </div>
      </div>
    </div>
  )
}
