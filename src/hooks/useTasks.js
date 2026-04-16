import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabase.js'
import { DEFAULT_TASKS } from '../constants.js'

export function useTasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTasks() {
      const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: true })
      if (error) { console.error(error); setLoading(false); return }
      if (data.length === 0) {
        const seed = DEFAULT_TASKS.map(({ id, ...rest }) => rest)
        const { error: insertError } = await supabase.from('tasks').insert(seed)
        if (!insertError) {
          const { data: seeded } = await supabase.from('tasks').select('*').order('created_at', { ascending: true })
          setTasks(seeded || [])
        }
      } else {
        setTasks(data)
      }
      setLoading(false)
    }
    fetchTasks()
  }, [])

  useEffect(() => {
    const channel = supabase
      .channel('tasks-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, (payload) => {
        if (payload.eventType === 'INSERT') setTasks(prev => [...prev, payload.new])
        else if (payload.eventType === 'UPDATE') setTasks(prev => prev.map(t => t.id === payload.new.id ? payload.new : t))
        else if (payload.eventType === 'DELETE') setTasks(prev => prev.filter(t => t.id !== payload.old.id))
      })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  const addTask = useCallback(async (data) => {
    const { error } = await supabase.from('tasks').insert(data)
    if (error) console.error(error)
  }, [])

  const updateTask = useCallback(async (id, data) => {
    const { error } = await supabase.from('tasks').update(data).eq('id', id)
    if (error) console.error(error)
  }, [])

  const deleteTask = useCallback(async (id) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if (error) console.error(error)
  }, [])

  const moveTask = useCallback(async (id, newStatus) => {
    const { error } = await supabase.from('tasks').update({ status: newStatus }).eq('id', id)
    if (error) console.error(error)
  }, [])

  return { tasks, loading, addTask, updateTask, deleteTask, moveTask }
}