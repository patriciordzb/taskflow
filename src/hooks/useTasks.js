import { useState, useEffect, useCallback } from 'react'
import { DEFAULT_TASKS } from '../constants.js'

const STORAGE_KEY = 'taskflow_tasks'
const COUNTER_KEY = 'taskflow_counter'

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : DEFAULT_TASKS
  } catch { return DEFAULT_TASKS }
}

function loadCounter() {
  return parseInt(localStorage.getItem(COUNTER_KEY) || '8', 10)
}

export function useTasks() {
  const [tasks, setTasks] = useState(loadTasks)
  const [counter, setCounter] = useState(loadCounter)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem(COUNTER_KEY, String(counter))
  }, [counter])

  const addTask = useCallback((data) => {
    const id = `TF-${String(counter).padStart(3, '0')}`
    setCounter(c => c + 1)
    setTasks(prev => [...prev, { id, ...data }])
    return id
  }, [counter])

  const updateTask = useCallback((id, data) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...data } : t))
  }, [])

  const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }, [])

  const moveTask = useCallback((id, newStatus) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t))
  }, [])

  return { tasks, addTask, updateTask, deleteTask, moveTask }
}
