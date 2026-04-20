import React, { useState, useMemo } from 'react'
import { USERS, COLUMNS, TASK_TYPES, PRIORITIES } from './constants.js'
import { useTasks } from './hooks/useTasks.js'
import TaskModal from './components/TaskModal.jsx'
import TaskCard from './components/TaskCard.jsx'

export default function App() {
  const { tasks, loading, addTask, updateTask, deleteTask, moveTask } = useTasks()
  const [activeUser, setActiveUser] = useState('pato')
  const [activeTab, setActiveTab]   = useState('todo')
  const [filterUser, setFilterUser] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [search, setSearch]         = useState('')
  const [modal, setModal]           = useState(null)
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => tasks.filter(t => {
    if (t.status !== activeTab) return false
    if (filterUser !== 'all' && t.assignee !== filterUser) return false
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false
    if (filterType !== 'all' && t.type !== filterType) return false
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }), [tasks, activeTab, filterUser, filterPriority, filterType, search])

  const countFor = (colId) => tasks.filter(t =>
    t.status === colId &&
    (filterUser === 'all' || t.assignee === filterUser) &&
    (filterPriority === 'all' || t.priority === filterPriority) &&
    (filterType === 'all' || t.type === filterType)
  ).length

  const handleSave = (data) => {
    if (modal.task) updateTask(modal.task.id, data)
    else addTask(data)
    setModal(null)
  }

  const handleDelete = (id) => {
    if (confirm('¿Eliminar esta tarea?')) deleteTask(id)
  }

  // Tap avatar = toggle filter by that user
  const handleAvatarTap = (uid) => {
    setActiveUser(uid)
    setFilterUser(prev => prev === uid ? 'all' : uid)
  }

  const activeCol = COLUMNS.find(c => c.id === activeTab)
  const hasFilters = filterUser !== 'all' || filterPriority !== 'all' || filterType !== 'all'

  const selStyle = {
    fontSize: 13, padding: '6px 10px',
    border: '0.5px solid var(--border-strong)',
    borderRadius: 'var(--radius)',
    background: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font)',
    outline: 'none', cursor: 'pointer', width: '100%',
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: 12 }}>
      <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTop: '3px solid var(--blue)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Conectando...</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', maxWidth: 640, margin: '0 auto' }}>

      {/* Topbar */}
      <div style={{
        background: 'var(--bg-primary)', borderBottom: '0.5px solid var(--border)',
        padding: '0 16px', height: 52,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 26, height: 26, borderRadius: 6, background: '#185FA5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1.5" fill="white" opacity="0.9"/>
              <rect x="9" y="2" width="5" height="5" rx="1.5" fill="white" opacity="0.55"/>
              <rect x="2" y="9" width="5" height="5" rx="1.5" fill="white" opacity="0.55"/>
              <rect x="9" y="9" width="5" height="5" rx="1.5" fill="white" opacity="0.9"/>
            </svg>
          </div>
          <span style={{ fontSize: 15, fontWeight: 500 }}>TaskFlow</span>
        </div>

        {/* Avatars — tap to filter by user */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {filterUser !== 'all' && (
            <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
              Solo {USERS.find(u => u.id === filterUser)?.name}
            </span>
          )}
          {USERS.map(u => (
            <div key={u.id} onClick={() => handleAvatarTap(u.id)} title={`Ver tareas de ${u.name}`}
              style={{
                width: 34, height: 34, borderRadius: '50%',
                background: u.bg, color: u.color,
                fontSize: 11, fontWeight: 500,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                border: filterUser === u.id ? `2.5px solid ${u.color}` : '0.5px solid var(--border-strong)',
                opacity: filterUser !== 'all' && filterUser !== u.id ? 0.4 : 1,
                transition: 'all 0.15s',
              }}
            >{u.initials}</div>
          ))}
        </div>
      </div>

      {/* Search + Filter toggle */}
      <div style={{ padding: '8px 16px', background: 'var(--bg-tertiary)', display: 'flex', gap: 8, flexShrink: 0 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <span style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', fontSize: 13, pointerEvents: 'none' }}>⌕</span>
          <input type="text" placeholder="Buscar tareas..." value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '7px 10px 7px 26px', fontSize: 13, border: '0.5px solid var(--border-strong)', borderRadius: 'var(--radius)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'var(--font)' }}
          />
        </div>
        <button onClick={() => setShowFilters(f => !f)}
          style={{
            padding: '7px 12px', fontSize: 13, borderRadius: 'var(--radius)',
            border: hasFilters ? '1.5px solid var(--blue)' : '0.5px solid var(--border-strong)',
            background: hasFilters ? 'var(--blue-light)' : 'var(--bg-primary)',
            color: hasFilters ? 'var(--blue-text)' : 'var(--text-secondary)',
            display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', flexShrink: 0,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M1 3h11M3 6.5h7M5 10h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          Filtros{hasFilters ? ' •' : ''}
        </button>
        <button onClick={() => setModal({ defaultStatus: activeTab })}
          style={{
            padding: '7px 14px', fontSize: 13, borderRadius: 'var(--radius)',
            background: 'var(--blue)', color: '#fff', border: 'none',
            display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', flexShrink: 0, fontWeight: 500,
          }}
        >
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M5.5 1v9M1 5.5h9" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Nueva
        </button>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div style={{ padding: '0 16px 12px', background: 'var(--bg-tertiary)', display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0, borderBottom: '0.5px solid var(--border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>Usuario</div>
              <select style={selStyle} value={filterUser} onChange={e => setFilterUser(e.target.value)}>
                <option value="all">Todos</option>
                {USERS.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>Prioridad</div>
              <select style={selStyle} value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
                <option value="all">Todas</option>
                {Object.entries(PRIORITIES).map(([v, p]) => <option key={v} value={v}>{p.icon} {v}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>Tipo</div>
              <select style={selStyle} value={filterType} onChange={e => setFilterType(e.target.value)}>
                <option value="all">Todos</option>
                {Object.entries(TASK_TYPES).map(([v, { label }]) => <option key={v} value={v}>{label}</option>)}
              </select>
            </div>
          </div>
          {hasFilters && (
            <button onClick={() => { setFilterUser('all'); setFilterPriority('all'); setFilterType('all') }}
              style={{ fontSize: 12, color: 'var(--blue-text)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
              Limpiar filtros
            </button>
          )}
        </div>
      )}

      {/* Tab bar */}
      <div style={{
        display: 'flex', background: 'var(--bg-primary)',
        borderBottom: '0.5px solid var(--border)',
        flexShrink: 0,
      }}>
        {COLUMNS.map(col => {
          const count = countFor(col.id)
          const active = activeTab === col.id
          return (
            <button key={col.id} onClick={() => setActiveTab(col.id)}
              style={{
                flex: 1, padding: '10px 4px 8px',
                background: 'none', border: 'none', cursor: 'pointer',
                borderBottom: active ? `2.5px solid ${col.dot}` : '2.5px solid transparent',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                transition: 'all 0.12s',
              }}
            >
              <span style={{ fontSize: 11, fontWeight: active ? 500 : 400, color: active ? 'var(--text-primary)' : 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                {col.label}
              </span>
              <span style={{
                fontSize: 10, minWidth: 16, height: 16, borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px',
                background: active ? col.dot : 'var(--bg-secondary)',
                color: active ? '#fff' : 'var(--text-muted)',
                fontWeight: 500,
              }}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Column header */}
      <div style={{ padding: '10px 16px 4px', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: activeCol?.dot }} />
        <span style={{ fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-secondary)' }}>
          {activeCol?.label}
        </span>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>— {filtered.length} tarea{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Task list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 16px 100px' }}>
        {filtered.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '48px 20px',
            color: 'var(--text-muted)', fontSize: 13,
            border: '0.5px dashed var(--border)', borderRadius: 'var(--radius-lg)', marginTop: 8,
          }}>
            Sin tareas aquí
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 4 }}>
            {filtered.map(t => (
              <TaskCard key={t.id} task={t}
                onEdit={task => setModal({ task })}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button onClick={() => setModal({ defaultStatus: activeTab })}
        style={{
          position: 'fixed', bottom: 28, right: 20,
          width: 54, height: 54, borderRadius: '50%',
          background: 'var(--blue)', color: '#fff', border: 'none',
          fontSize: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 50,
          boxShadow: '0 4px 16px rgba(24,95,165,0.35)',
        }}
      >+</button>

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
        .task-card:active .card-hover-actions {
          display: flex; gap: 4px;
          position: absolute; top: 8px; right: 8px;
        }
        .card-hover-actions button {
          width: 30px; height: 30px; border-radius: 6px;
          border: none; background: var(--bg-secondary);
          cursor: pointer; font-size: 13px;
          display: flex; align-items: center; justify-content: center;
          color: var(--text-secondary);
        }
        .card-hover-actions button.del { background: var(--red-light); color: var(--red); }
        .task-card:hover { border-color: var(--border-strong) !important; }
        ::-webkit-scrollbar { width: 0; height: 0; }
      `}</style>
    </div>
  )
}
