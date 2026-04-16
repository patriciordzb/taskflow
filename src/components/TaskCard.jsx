import React from 'react'
import { USERS, TASK_TYPES, PRIORITIES } from '../constants.js'

const TAG_STYLES = {
  'tag-bug':  { background: 'var(--red-light)',   color: 'var(--red)'   },
  'tag-feat': { background: 'var(--blue-light)',  color: 'var(--blue-text)' },
  'tag-task': { background: 'var(--green-light)', color: 'var(--green)' },
  'tag-docs': { background: 'var(--amber-light)', color: 'var(--amber)' },
}

export default function TaskCard({ task, onEdit, onDelete, onDragStart }) {
  const user = USERS.find(u => u.id === task.assignee) || USERS[0]
  const typeInfo = TASK_TYPES[task.type] || TASK_TYPES.task
  const tagStyle = TAG_STYLES[typeInfo.cls] || {}
  const prio = PRIORITIES[task.priority] || PRIORITIES.P2

  return (
    <div
      draggable
      onDragStart={e => { e.dataTransfer.setData('taskId', task.id); onDragStart?.(task.id) }}
      style={{
        background: 'var(--bg-primary)',
        border: '0.5px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '9px 10px',
        cursor: 'grab',
        position: 'relative',
      }}
      className="task-card"
    >
      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4, fontFamily: 'var(--mono)' }}>
        {task.id}
      </div>
      <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: 8 }}>
        {task.title}
      </div>
      {task.desc && (
        <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 7, lineHeight: 1.4 }}>
          {task.desc.slice(0, 80)}{task.desc.length > 80 ? '…' : ''}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
        <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, fontWeight: 500, ...tagStyle }}>
          {typeInfo.label}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ fontSize: 11 }} title={task.priority}>{prio.icon}</span>
          <div
            title={user.name}
            style={{
              width: 22, height: 22, borderRadius: '50%',
              background: user.bg, color: user.color,
              fontSize: 9, fontWeight: 500,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {user.initials}
          </div>
        </div>
      </div>
      <div className="card-hover-actions">
        <button onClick={() => onEdit(task)} title="Editar">✎</button>
        <button onClick={() => onDelete(task.id)} title="Eliminar" className="del">✕</button>
      </div>
    </div>
  )
}
