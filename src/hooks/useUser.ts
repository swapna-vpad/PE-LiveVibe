import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type User = Database['public']['Tables']['users']['Row']
type UserUpdate = Database['public']['Tables']['users']['Update']

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch user profile
  const fetchUser = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (!authUser) {
        setUser(null)
        return
      }

      // Use upsert to handle both creating and fetching user profile
      const { data, error } = await supabase
        .from('users')
        .upsert([{
          id: authUser.id,
          email: authUser.email || '',
          username: authUser.email?.split('@')[0] || 'user'
        }], {
          onConflict: 'id'
        })
        .select()
        .single()

      if (error) throw error

      setUser(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching user:', err)
    } finally {
      setLoading(false)
    }
  }

  // Update user profile
  const updateUser = async (updates: UserUpdate) => {
    try {
      setError(null)

      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (!authUser) {
        throw new Error('User must be authenticated')
      }

      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', authUser.id)
        .select()
        .single()

      if (error) throw error

      setUser(data)
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user')
      console.error('Error updating user:', err)
      throw err
    }
  }

  // Load user on mount and auth changes
  useEffect(() => {
    fetchUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchUser()
    })

    return () => subscription.unsubscribe()
  }, [])

  return {
    user,
    loading,
    error,
    updateUser,
    refetch: fetchUser
  }
}