import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type Task = Database['public']['Tables']['tasks']['Row']
type TaskInsert = Database['public']['Tables']['tasks']['Insert']
type TaskUpdate = Database['public']['Tables']['tasks']['Update']

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch tasks from Supabase
  const fetchTasks = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setTasks([])
        return
      }

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setTasks(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  // Add a new task
  const addTask = async (title: string) => {
    try {
      setError(null)

      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User must be authenticated to add tasks')
      }

      const newTask: TaskInsert = {
        title,
        user_id: user.id,
        completed: false
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert([newTask])
        .select()
        .single()

      if (error) throw error

      setTasks(prev => [data, ...prev])
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add task')
      console.error('Error adding task:', err)
      throw err
    }
  }

  // Update a task
  const updateTask = async (id: string, updates: TaskUpdate) => {
    try {
      setError(null)

      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setTasks(prev => 
        prev.map(task => 
          task.id === id ? data : task
        )
      )
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task')
      console.error('Error updating task:', err)
      throw err
    }
  }

  // Toggle task completion
  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return

    return updateTask(id, { completed: !task.completed })
  }

  // Delete a task
  const deleteTask = async (id: string) => {
    try {
      setError(null)

      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)

      if (error) throw error

      setTasks(prev => prev.filter(task => task.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task')
      console.error('Error deleting task:', err)
      throw err
    }
  }

  // Load tasks on mount
  useEffect(() => {
    fetchTasks()
  }, [])

  // Set up real-time subscription
  useEffect(() => {
    const setupSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      const subscription = supabase
        .channel('tasks_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'tasks',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            fetchTasks() // Refetch tasks when changes occur
          }
        )
        .subscribe()

      return () => {
        subscription.unsubscribe()
      }
    }

    setupSubscription()
  }, [])

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    refetch: fetchTasks
  }
}