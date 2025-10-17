// src/hooks/use-user.js
import { useEffect, useState } from 'react'
import { useAuth } from '../context/auth-context'

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
