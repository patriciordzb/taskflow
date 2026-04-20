import React from 'react'
import { USERS, TASK_TYPES, PRIORITIES } from '../constants.js'

const TAG_STYLES = {
  'tag-bug':  { background: 'var(--red-light)',   color: 'var(--red)'      },
  'tag-feat': { background: 'var(--blue-light)',  color: 'var(--blue-text)'},
  'tag-task': { background: 'var(--green-light)', color: 'var(--green)'   },
  'tag-docs': { background: 'var(--amber-light)', color: 'var(--amber)'   },
}

function deadlineStatus(deadline) {
  if (!deadline) return null
  const today = new Date(); today.setHours(0,0,0,0)
  const due = new Date(deadline + 'T00:00:00')
  const diff = Math.round((due - today) / (1000*60*60*24))
  if (diff < 0)  return { label: `Vencida hace ${Math.abs(diff)}d`, color: 'var(--red)',   bg: 'var(--red-light)'   }
  if (diff === 0) return { label: 'Vence hoy',                       color: 'var(--amber)', bg: 'var(--amber-light)' }
  if (diff <= 3)  return { label: `${diff}d restantes`,              color: 'var(--amber)', bg: 'var(--amber-light)' }
  return { label: `${diff}d restantes`, color: 'var(--green)', bg: 'var(--green-light)' }
}

export default function TaskCard({ task, onEdit, onDelete }) {
  const user     = USERS.find(u => u.id === task.assignee) || USERS[0]
  const typeInfo = TASK_TYPES[task.type] || TASK_TYPES.task
  const tagStyle = TAG_STYLES[typeInfo.cls] || {}
  const prio     = PRIORITIES[task.priority] || PRIORITIES.P2
  const dl       = deadlineStatus(task.deadline)

  return (
    <div className="task-card" style={{
      background: 'var(--bg-primary)',
      border: '0.5px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '10px 12px',
      cursor: 'grab',
      position: 'relative',
    }}
      draggable
      onDragStart={e => e.dataTransfer.setData('taskId', String(task.id))}
      onClick={() => onEdit(task)}
    >
      {/* Actions */}
      <div className="card-hover-actions">
        <button onClick={e => { e.stopPropagation(); onEdit(task) }} title="Editar">✎</button>
        <button className="del" onClick={e => { e.stopPropagation(); onDelete(task.id) }} title="Eliminar">✕</button>
      </div>

      {/* Title */}
      <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: 6, paddingRight: 40 }}>
        {task.title}
      </div>

      {/* Desc */}
      {task.desc && (
        <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8, lineHeight: 1.4 }}>
          {task.desc.slice(0, 90)}{task.desc.length > 90 ? '…' : ''}
        </div>
      )}

      {/* Deadline */}
      {dl && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          fontSize: 10, fontWeight: 500, padding: '2px 7px',
          borderRadius: 4, marginBottom: 8,
          background: dl.bg, color: dl.color,
        }}>
          ⏰ {dl.label}
        </div>
      )}

      {/* Meta */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
        <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, fontWeight: 500, ...tagStyle }}>
          {typeInfo.label}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ fontSize: 11 }} title={task.priority}>{prio.icon}</span>
          <div title={user.name} style={{
            width: 22, height: 22, borderRadius: '50%',
            background: user.bg, color: user.color,
            fontSize: 9, fontWeight: 500,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {user.initials}
          </div>
        </div>
      </div>
    </div>
  )
}
