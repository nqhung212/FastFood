import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useUserData(userId) {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const fetchUserData = async () => {
      try {
        const { data, error: err } = await supabase
          .from('users')
          .select('fullname, phone, address, username, email')
          .eq('id', userId)
          .single()

        if (err) throw err
        setUserData(data)
      } catch (err) {
        console.error('Error fetching user data:', err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [userId])

  return { userData, loading, error }
}
