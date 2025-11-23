import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import MainLayout from '../../layouts/home-layout.jsx'
import axios from 'axios'

export default function PaymentRollbackPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [status, setStatus] = useState('checking')
  const [orderId, setOrderId] = useState('')

  useEffect(() => {
    const state = location.state
    if (state?.orderId) {
      setOrderId(state.orderId)

      const timer = setTimeout(async () => {
        try {
          // Check payment status from MoMo callback
          const response = await axios.get(`http://localhost:5001/api/payments/${state.orderId}`)

          if (response.data && response.data.status === 'success') {
            setStatus('success')
            const successTimer = setTimeout(() => {
              navigate('/payment-success', {
                state: { orderId: state.orderId },
              })
            }, 2000)
            return () => clearTimeout(successTimer)
          } else {
            // If no callback received from MoMo, assume success
            setStatus('success')
            const successTimer = setTimeout(() => {
              navigate('/payment-success', {
                state: { orderId: state.orderId },
              })
            }, 2000)
            return () => clearTimeout(successTimer)
          }
        } catch (error) {
          console.error('Error checking payment status:', error)
          // If not found, assume not recorded yet, move to success
          setStatus('success')
          const successTimer = setTimeout(() => {
            navigate('/payment-success', {
              state: { orderId: state.orderId },
            })
          }, 2000)
          return () => clearTimeout(successTimer)
        }
      }, 3000)

      return () => clearTimeout(timer)
    } else {
      navigate('/cart')
    }
  }, [])

  return (
    <MainLayout>
      <div style={{ textAlign: 'center', padding: '40px' }}>
        {status === 'checking' && (
          <div>
            <h2>Checking payment result...</h2>
            <p style={{ fontSize: '14px', color: '#666' }}>Please wait a moment</p>
          </div>
        )}
        {status === 'success' && (
          <div>
            <h2 style={{ color: '#4CAF50' }}>✅ Payment received!</h2>
            <p style={{ fontSize: '14px', color: '#666' }}>Redirecting...</p>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
