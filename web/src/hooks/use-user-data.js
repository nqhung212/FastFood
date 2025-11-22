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
          .from('user_account')
          .select('email, full_name, phone')
          .eq('user_id', userId)
          .single()

        if (err) throw err
        
        // Get customer default address if exists
        const { data: customerData } = await supabase
          .from('customer')
          .select('default_address')
          .eq('customer_id', userId)
          .single()

        setUserData({
          ...data,
          fullname: data.full_name,
          address: customerData?.default_address || '',
        })
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
