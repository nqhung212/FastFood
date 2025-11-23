import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../../layouts/home-layout.jsx'

export default function PaymentCancelPage() {
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    const redirectTimer = setTimeout(() => {
      navigate('/cart')
    }, 5000)

    return () => {
      clearInterval(timer)
      clearTimeout(redirectTimer)
    }
  }, [navigate])

  return (
    <MainLayout>
      <div
        style={{
          maxWidth: '500px',
          margin: '50px auto',
          textAlign: 'center',
          padding: '20px',
          border: '1px solid #FF6B6B',
          borderRadius: '8px',
          backgroundColor: '#ffe0e0',
        }}
      >
        <h1 style={{ color: '#FF6B6B' }}>❌ Payment canceled</h1>
        <p style={{ fontSize: '16px', marginBottom: '20px' }}>
          You have canceled the payment transaction. Please try again if you want to continue.
        </p>
        <div
          style={{
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '4px',
            marginBottom: '20px',
            borderLeft: '4px solid #FF6B6B',
          }}
        >
          <p>
            Returning to cart in <strong>{countdown}</strong>s...
          </p>
        </div>
        <button
          onClick={() => navigate('/cart')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#FF6B6B',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            marginRight: '10px',
          }}
        >
          Back to Cart
        </button>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#666',
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
