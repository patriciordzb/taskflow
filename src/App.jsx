import React, { useState, useMemo } from 'react'
import { USERS, COLUMNS, TASK_TYPES, PRIORITIES } from './constants.js'
import { useTasks } from './hooks/useTasks.js'
import Column from './components/Column.jsx'
import TaskModal from './components/TaskModal.jsx'

export default function App() {
  const { tasks, addTask, updateTask, deleteTask, moveTask } = useTasks()
  const [activeUser, setActiveUser] = useState('pato')
  const [modal, setModal] = useState(null)   // null | { task?, defaultStatus? }
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')

  const filtered = useMemo(() => tasks.filter(t => {
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false
    if (filterType !== 'all' && t.type !== filterType) return false
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false
    return true
  }), [tasks, search, filterType, filterPriority])

  const handleSave = (data) => {
    if (modal.task) {
      updateTask(modal.task.id, data)
    } else {
      addTask(data)
    }
    setModal(null)
  }

  const handleDelete = (id) => {
    if (confirm('¿Eliminar esta tarea?')) deleteTask(id)
  }

  const stats = {
    total: filtered.length,
    done: filtered.filter(t => t.status === 'done').length,
    byUser: USERS.map(u => ({ ...u, count: filtered.filter(t => t.assignee === u.id).length })),
  }

  const FilterBtn = ({ value, label, group }) => {
    const active = group === 'type' ? filterType === value : filterPriority === value
    return (
      <button onClick={() => group === 'type' ? setFilterType(value) : setFilterPriority(value)}
        style={{
          fontSize: 12, padding: '4px 10px',
          border: '0.5px solid var(--border-strong)',
          borderRadius: 'var(--radius)',
          background: active ? 'var(--blue-light)' : 'var(--bg-primary)',
          color: active ? 'var(--blue-text)' : 'var(--text-secondary)',
          transition: 'all 0.12s',
        }}
      >{label}</button>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Topbar */}
      <div style={{
        background: 'var(--bg-primary)', borderBottom: '0.5px solid var(--border)',
        padding: '0 20px', height: 52,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6, background: '#185FA5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1.5" fill="white" opacity="0.9"/>
              <rect x="9" y="2" width="5" height="5" rx="1.5" fill="white" opacity="0.55"/>
              <rect x="2" y="9" width="5" height="5" rx="1.5" fill="white" opacity="0.55"/>
              <rect x="9" y="9" width="5" height="5" rx="1.5" fill="white" opacity="0.9"/>
            </svg>
          </div>
          <span style={{ fontSize: 15, fontWeight: 500 }}>TaskFlow</span>
          <span style={{
            fontSize: 12, padding: '3px 10px', borderRadius: 'var(--radius)',
            background: 'var(--blue-light)', color: 'var(--blue-text)', fontWeight: 500,
          }}>
            Sprint activo
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)', marginRight: 4 }}>Tú eres:</span>
          {USERS.map(u => (
            <div key={u.id}
              onClick={() => setActiveUser(u.id)}
              title={u.name}
              style={{
                width: 30, height: 30, borderRadius: '50%',
                background: u.bg, color: u.color,
                fontSize: 11, fontWeight: 500,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                border: activeUser === u.id ? `2px solid ${u.color}` : '0.5px solid var(--border-strong)',
                transition: 'all 0.12s',
              }}
            >{u.initials}</div>
          ))}
        </div>
      </div>

      {/* Subbar */}
      <div style={{
        background: 'var(--bg-primary)', borderBottom: '0.5px solid var(--border)',
        padding: '0 20px', height: 44,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 500 }}>Sprint 1</span>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            {new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })} – 2 semanas
          </span>
        </div>
        <button
          onClick={() => setModal({ defaultStatus: 'todo' })}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            fontSize: 13, padding: '5px 12px',
            background: 'var(--blue)', color: '#fff',
            border: 'none', borderRadius: 'var(--radius)',
          }}
        >
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M5.5 1v9M1 5.5h9" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Nueva tarea
        </button>
      </div>

      {/* Filters */}
      <div style={{
        padding: '8px 20px 4px', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
        background: 'var(--bg-tertiary)', flexShrink: 0,
      }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 220 }}>
          <span style={{
            position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-secondary)', fontSize: 13, pointerEvents: 'none',
          }}>⌕</span>
          <input
            type="text" placeholder="Buscar tareas..." value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '5px 10px 5px 26px', fontSize: 13,
              border: '0.5px solid var(--border-strong)', borderRadius: 'var(--radius)',
              background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <FilterBtn value="all"     label="Todo"    group="type" />
          {Object.entries(TASK_TYPES).map(([v, { label }]) => (
            <FilterBtn key={v} value={v} label={label} group="type" />
          ))}
        </div>

        <div style={{ display: 'flex', gap: 4, borderLeft: '0.5px solid var(--border-strong)', paddingLeft: 8 }}>
          <FilterBtn value="all" label="— Prioridad" group="prio" />
          {Object.entries(PRIORITIES).map(([v, { icon }]) => (
            <FilterBtn key={v} value={v} label={`${icon} ${v}`} group="prio" />
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'flex', gap: 8, padding: '4px 20px',
        background: 'var(--bg-tertiary)', flexShrink: 0, flexWrap: 'wrap',
      }}>
        <div style={{ fontSize: 11, padding: '2px 10px', borderRadius: 20, border: '0.5px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-secondary)', display: 'flex', gap: 5 }}>
          Progreso <strong style={{ color: 'var(--text-primary)' }}>{stats.done}/{stats.total}</strong>
        </div>
        {stats.byUser.map(u => (
          <div key={u.id} style={{ fontSize: 11, padding: '2px 10px', borderRadius: 20, border: '0.5px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-secondary)', display: 'flex', gap: 5, alignItems: 'center' }}>
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: u.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 500, color: u.color }}>
              {u.initials[0]}
            </div>
            {u.name} <strong style={{ color: 'var(--text-primary)' }}>{u.count}</strong>
          </div>
        ))}
      </div>

      {/* Board */}
      <div style={{
        display: 'flex', gap: 12, padding: '12px 20px 20px',
        overflowX: 'auto', flex: 1, alignItems: 'flex-start',
      }}>
        {COLUMNS.map(col => (
          <Column
            key={col.id}
            col={col}
            tasks={filtered.filter(t => t.status === col.id)}
            onEdit={task => setModal({ task })}
            onDelete={handleDelete}
            onAddInCol={status => setModal({ defaultStatus: status })}
            onDrop={moveTask}
          />
        ))}
      </div>

      {modal && (
        <TaskModal
          task={modal.task}
          defaultStatus={modal.defaultStatus}
          activeUser={activeUser}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      <style>{`
        .task-card .card-hover-actions { display: none; }
        .task-card:hover .card-hover-actions {
          display: flex; gap: 3px;
          position: absolute; top: 6px; right: 6px;
        }
        .card-hover-actions button {
          width: 20px; height: 20px; border-radius: 4px;
          border: none; background: var(--bg-secondary);
          cursor: pointer; font-size: 11px;
          display: flex; align-items: center; justify-content: center;
          color: var(--text-secondary);
        }
        .card-hover-actions button:hover { background: var(--bg-tertiary); }
        .card-hover-actions button.del:hover { background: var(--red-light); color: var(--red); }
        .task-card:hover { border-color: var(--border-strong) !important; }
      `}</style>
    </div>
  )
}
