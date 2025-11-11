import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * Hook để bảo vệ admin routes
 * Kiểm tra xem adminSession có trong localStorage không
 * Nếu không có -> redirect về /admin/login
 */
export function useAdminGuard() {
  const [adminSession, setAdminSession] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true

    const checkAdminSession = () => {
      try {
        const session = localStorage.getItem('adminSession')
        
        if (!session) {
          if (mounted) {
            setIsLoading(false)
            setIsAdmin(false)
            navigate('/admin/login')
          }
          return
        }

        const parsedSession = JSON.parse(session)
        
        if (mounted) {
          setAdminSession(parsedSession)
          setIsAdmin(true)
        }
      } catch (err) {
        console.error('Error checking admin session:', err)
        if (mounted) {
          setIsAdmin(false)
          navigate('/admin/login')
        }
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    checkAdminSession()

    return () => {
      mounted = false
    }
  }, [navigate])

  return { isAdmin, isLoading, adminSession }
}
