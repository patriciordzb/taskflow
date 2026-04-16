import React, { useState, useEffect, useRef } from 'react'
import { USERS, COLUMNS, TASK_TYPES, PRIORITIES } from '../constants.js'

const field = { display: 'flex', flexDirection: 'column', gap: 4 }
const label = { fontSize: 12, color: 'var(--text-secondary)' }
const input = {
  fontSize: 13, padding: '7px 10px',
  border: '0.5px solid var(--border-strong)',
  borderRadius: 'var(--radius)',
  background: 'var(--bg-primary)',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font)',
  outline: 'none',
  width: '100%',
}

export default function TaskModal({ task, defaultStatus, activeUser, onSave, onClose }) {
  const isNew = !task
  const titleRef = useRef(null)
  const [form, setForm] = useState({
    title:    task?.title    || '',
    desc:     task?.desc     || '',
    type:     task?.type     || 'task',
    priority: task?.priority || 'P2',
    assignee: task?.assignee || activeUser,
    status:   task?.status   || defaultStatus || 'todo',
  })

  useEffect(() => { titleRef.current?.focus() }, [])

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const handleSave = () => {
    if (!form.title.trim()) { titleRef.current?.focus(); return }
    onSave(form)
  }

  const handleKey = (e) => { if (e.key === 'Escape') onClose() }

  return (
    <div
      onClick={onClose}
      onKeyDown={handleKey}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100, padding: 16,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg-primary)',
          border: '0.5px solid var(--border-strong)',
          borderRadius: 'var(--radius-lg)',
          padding: 20, width: '100%', maxWidth: 420,
          display: 'flex', flexDirection: 'column', gap: 12,
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 500 }}>
          {isNew ? 'Nueva tarea' : 'Editar tarea'}
        </div>

        <div style={field}>
          <label style={label}>Título *</label>
          <input ref={titleRef} style={input} value={form.title} placeholder="Describe la tarea..."
            onChange={e => set('title', e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()} />
        </div>

        <div style={field}>
          <label style={label}>Descripción</label>
          <textarea style={{ ...input, minHeight: 64, resize: 'vertical' }}
            value={form.desc} placeholder="Contexto adicional..."
            onChange={e => set('desc', e.target.value)} />
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ ...field, flex: 1 }}>
            <label style={label}>Tipo</label>
            <select style={{ ...input }} value={form.type} onChange={e => set('type', e.target.value)}>
              {Object.entries(TASK_TYPES).map(([v, { label: l }]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
          <div style={{ ...field, flex: 1 }}>
            <label style={label}>Prioridad</label>
            <select style={{ ...input }} value={form.priority} onChange={e => set('priority', e.target.value)}>
              {Object.entries(PRIORITIES).map(([v, p]) => (
                <option key={v} value={v}>{p.icon} {v}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ ...field, flex: 1 }}>
            <label style={label}>Asignado a</label>
            <select style={{ ...input }} value={form.assignee} onChange={e => set('assignee', e.target.value)}>
              {USERS.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
          <div style={{ ...field, flex: 1 }}>
            <label style={label}>Columna</label>
            <select style={{ ...input }} value={form.status} onChange={e => set('status', e.target.value)}>
              {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
          <button onClick={onClose} style={{
            padding: '6px 14px', fontSize: 13,
            border: '0.5px solid var(--border-strong)',
            borderRadius: 'var(--radius)',
            background: 'none', color: 'var(--text-secondary)',
          }}>
            Cancelar
          </button>
          <button onClick={handleSave} style={{
            padding: '6px 16px', fontSize: 13,
            background: 'var(--blue)', color: '#fff',
            border: 'none', borderRadius: 'var(--radius)',
          }}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}
