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
        const { data: customerData, error: customerError } = await supabase
          .from('customer')
          .select('default_address, latitude, longitude')
          .eq('customer_id', userId)
          .single()

        // If customer record doesn't exist, create one
        if (customerError?.code === 'PGRST116') {
          // Record not found, create it
          await supabase.from('customer').insert({
            customer_id: userId,
            default_address: null,
            phone: data.phone,
          })
          
          setUserData({
            ...data,
            fullname: data.full_name,
            address: '',
            latitude: null,
            longitude: null,
          })
        } else if (customerError) {
          throw customerError
        } else {
          setUserData({
            ...data,
            fullname: data.full_name,
            address: customerData?.default_address || '',
            latitude: customerData?.latitude || null,
            longitude: customerData?.longitude || null,
          })
        }
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
