import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import MainLayout from '../layouts/home-layout.jsx'
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
          const orderData = sessionStorage.getItem('orderData')
          if (orderData) {
            const data = JSON.parse(orderData)
            await axios.post('http://localhost:4001/api/momo/checkout', {
              orderId: state.orderId,
              amount: data.total,
              items: data.items,
              orderInfo: 'Thanh toan don hang',
              timestamp: new Date().toISOString(),
            })
            sessionStorage.removeItem('orderData')
          }
        } catch (error) {
          console.error('Error saving payment:', error)
        }

        setStatus('success')
        const successTimer = setTimeout(() => {
          navigate('/payment-success', {
            state: { orderId: state.orderId },
          })
        }, 2000)
        return () => clearTimeout(successTimer)
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
            <h2>Đang kiểm tra kết quả thanh toán...</h2>
            <p style={{ fontSize: '14px', color: '#666' }}>Vui lòng đợi trong giây lát</p>
          </div>
        )}
        {status === 'success' && (
          <div>
            <h2 style={{ color: '#4CAF50' }}>✅ Thanh toán đã nhận được!</h2>
            <p style={{ fontSize: '14px', color: '#666' }}>Đang chuyển hướng...</p>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
