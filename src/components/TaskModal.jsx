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
  outline: 'none', width: '100%',
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
    deadline: task?.deadline || '',
  })

  useEffect(() => { titleRef.current?.focus() }, [])
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const handleSave = () => {
    if (!form.title.trim()) { titleRef.current?.focus(); return }
    onSave(form)
  }

  return (
    <div onClick={onClose} onKeyDown={e => e.key === 'Escape' && onClose()}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        zIndex: 100,
      }}
    >
      <div onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg-primary)',
          borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
          padding: '20px 20px 32px',
          width: '100%', maxWidth: 520,
          display: 'flex', flexDirection: 'column', gap: 12,
          maxHeight: '90vh', overflowY: 'auto',
        }}
      >
        {/* Handle */}
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border-strong)', margin: '-8px auto 4px' }} />

        <div style={{ fontSize: 15, fontWeight: 500 }}>
          {isNew ? 'Nueva tarea' : 'Editar tarea'}
        </div>

        <div style={field}>
          <label style={label}>Título *</label>
          <input ref={titleRef} style={input} value={form.title}
            placeholder="Describe la tarea..."
            onChange={e => set('title', e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()} />
        </div>

        <div style={field}>
          <label style={label}>Descripción</label>
          <textarea style={{ ...input, minHeight: 60, resize: 'vertical' }}
            value={form.desc} placeholder="Contexto adicional..."
            onChange={e => set('desc', e.target.value)} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={field}>
            <label style={label}>Tipo</label>
            <select style={input} value={form.type} onChange={e => set('type', e.target.value)}>
              {Object.entries(TASK_TYPES).map(([v, { label: l }]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
          <div style={field}>
            <label style={label}>Prioridad</label>
            <select style={input} value={form.priority} onChange={e => set('priority', e.target.value)}>
              {Object.entries(PRIORITIES).map(([v, p]) => (
                <option key={v} value={v}>{p.icon} {v}</option>
              ))}
            </select>
          </div>
          <div style={field}>
            <label style={label}>Asignado a</label>
            <select style={input} value={form.assignee} onChange={e => set('assignee', e.target.value)}>
              {USERS.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
          <div style={field}>
            <label style={label}>Columna</label>
            <select style={input} value={form.status} onChange={e => set('status', e.target.value)}>
              {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
        </div>

        <div style={field}>
          <label style={label}>Deadline</label>
          <input type="date" style={input} value={form.deadline}
            onChange={e => set('deadline', e.target.value)} />
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '10px', fontSize: 14,
            border: '0.5px solid var(--border-strong)',
            borderRadius: 'var(--radius)',
            background: 'none', color: 'var(--text-secondary)', cursor: 'pointer',
          }}>Cancelar</button>
          <button onClick={handleSave} style={{
            flex: 2, padding: '10px', fontSize: 14,
            background: 'var(--blue)', color: '#fff',
            border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer', fontWeight: 500,
          }}>Guardar</button>
        </div>
      </div>
    </div>
  )
}
