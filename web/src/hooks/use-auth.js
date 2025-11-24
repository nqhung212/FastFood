// src/hooks/use-auth.js
import { useEffect, useState } from 'react'
import { useAuth } from '../context/auth-context'
import { supabase } from '../lib/supabaseClient'

/**
 * Hook to listen to Supabase authentication state changes
 * Returns current authenticated user and manages subscription cleanup
 * @returns {Object} { user: currentUser | null }
 */
export function useAuthListener() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    // Get current session user
    const getUser = async () => {
      try {
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser()
        if (mounted) {
          setUser(currentUser)
          setIsLoading(false)
        }
      } catch (err) {
        console.error('Error getting supabase user', err)
        if (mounted) setIsLoading(false)
      }
    }

    getUser()

    // Listen for auth changes (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null)
        setIsLoading(false)
      }
    })

    // Cleanup: prevent state updates after unmount and unsubscribe from listener
    return () => {
      mounted = false
      listener?.subscription?.unsubscribe?.()
    }
  }, [])

  return { user, isLoading }
}

// Hook for current authenticated user (reads from auth context)
export function useUser() {
  const { user } = useAuth()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user) {
      try {
        setUserData(user)
        setError(null)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }, [user])

  const updateUser = (updatedData) => {
    setUserData((prev) => ({
      ...prev,
      ...updatedData,
    }))
  }

  return {
    user: userData,
    loading,
    error,
    updateUser,
  }
}

// Hook for fetching list of users from Supabase
export function useUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true

    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase.from('user_account').select('*')
        if (error) throw error
        if (mounted) setUsers(data || [])
      } catch (err) {
        setError(err.message || String(err))
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchUsers()

    return () => {
      mounted = false
    }
  }, [])

  return { users, loading, error }
}
