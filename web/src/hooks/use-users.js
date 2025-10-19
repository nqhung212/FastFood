// src/hooks/use-users.js
import { useEffect, useState } from 'react'
import { ENDPOINTS } from '../constants'

export function useUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(ENDPOINTS.USERS)
      .then(res => {
        if (!res.ok) throw new Error('Error loading users')
        return res.json()
      })
      .then(data => setUsers(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return { users, loading, error }
}
