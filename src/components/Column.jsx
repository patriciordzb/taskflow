import React, { useState } from 'react'
import TaskCard from './TaskCard.jsx'

export default function Column({ col, tasks, onEdit, onDelete, onAddInCol, onDrop }) {
  const [over, setOver] = useState(false)

  return (
    <div style={{
      width: 240, minWidth: 240,
      background: 'var(--bg-secondary)',
      border: '0.5px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      display: 'flex', flexDirection: 'column',
      maxHeight: 'calc(100vh - 154px)',
    }}>
      <div style={{
        padding: '10px 12px 8px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '0.5px solid var(--border)',
        position: 'sticky', top: 0,
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: col.dot }} />
          <span style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {col.label}
          </span>
          <span style={{
            fontSize: 11, minWidth: 18, height: 18, borderRadius: 9,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px',
            background: 'var(--bg-primary)', color: 'var(--text-secondary)',
            border: '0.5px solid var(--border)',
          }}>
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAddInCol(col.id)}
          title="Agregar tarea"
          style={{
            width: 22, height: 22, borderRadius: 'var(--radius)',
            background: 'none', border: '0.5px solid var(--border-strong)',
            color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >+</button>
      </div>

      <div
        onDragOver={e => { e.preventDefault(); setOver(true) }}
        onDragLeave={() => setOver(false)}
        onDrop={e => { e.preventDefault(); setOver(false); onDrop(e.dataTransfer.getData('taskId'), col.id) }}
        style={{
          padding: 8, display: 'flex', flexDirection: 'column', gap: 6,
          overflowY: 'auto', flex: 1, minHeight: 60,
          background: over ? 'var(--blue-light)' : 'transparent',
          borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
          transition: 'background 0.12s',
        }}
      >
        {tasks.length === 0 ? (
          <div style={{
            color: 'var(--text-muted)', fontSize: 12, textAlign: 'center',
            padding: '16px 8px',
            border: '0.5px dashed var(--border)',
            borderRadius: 'var(--radius)', margin: 4,
          }}>
            Sin tareas
          </div>
        ) : (
          tasks.map(t => (
            <TaskCard key={t.id} task={t} onEdit={onEdit} onDelete={onDelete} />
          ))
        )}
      </div>
    </div>
  )
}
