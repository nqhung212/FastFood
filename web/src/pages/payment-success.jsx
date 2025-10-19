import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import MainLayout from '../layouts/home-layout.jsx'
import { useCart } from '../context/cart-context.jsx'
import { checkPaymentStatus } from '../api/momo-payment.js'

export default function PaymentSuccessPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { clearCart } = useCart()
  const [orderId, setOrderId] = useState('')
  const [paymentStatus, setPaymentStatus] = useState(null)

  useEffect(() => {
    const state = location.state
    if (state?.orderId) {
      setOrderId(state.orderId)
      clearCart()

      // Check payment status from server (run only once)
      const checkStatus = async () => {
        try {
          const status = await checkPaymentStatus(state.orderId)
          setPaymentStatus(status)
          console.log('✅ Payment status:', status)
        } catch (error) {
          console.error('Error fetching payment status:', error)
        }
      }

      checkStatus()
    } else {
      const timer = setTimeout(() => navigate('/cart'), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <MainLayout>
      <div
        style={{
          maxWidth: '500px',
          margin: '50px auto',
          textAlign: 'center',
          padding: '20px',
          border: '1px solid #4CAF50',
          borderRadius: '8px',
          backgroundColor: '#f1f8f4',
        }}
      >
        <h1 style={{ color: '#4CAF50' }}>✅ Payment successful!</h1>
        <p style={{ fontSize: '16px', marginBottom: '20px' }}>
          Thank you for your purchase. Your order has been confirmed.
        </p>
        {orderId && (
          <div
            style={{
              backgroundColor: 'white',
              padding: '15px',
              borderRadius: '4px',
              marginBottom: '20px',
              borderLeft: '4px solid #4CAF50',
            }}
          >
            <strong>Order ID:</strong>
            <p style={{ fontSize: '18px', color: '#4CAF50', margin: '5px 0' }}>{orderId}</p>
          </div>
        )}

        {paymentStatus && (
          <div
            style={{
              backgroundColor: 'white',
              padding: '12px',
              borderRadius: '4px',
              marginBottom: '20px',
              fontSize: '14px',
              color: '#666',
            }}
          >
            <p>
              <strong>Amount:</strong> {paymentStatus.amount?.toLocaleString() || '...'} ₫
            </p>
            <p>
              <strong>Time:</strong> {new Date(paymentStatus.timestamp).toLocaleString('en-US')}
            </p>
          </div>
        )}

        <button
          onClick={() => navigate('/')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Back to Home
        </button>
      </div>
    </MainLayout>
  )
}
