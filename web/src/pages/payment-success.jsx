import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import MainLayout from '../layouts/home-layout.jsx'
import { useCart } from '../context/cart-context.jsx'

export default function PaymentSuccessPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { clearCart } = useCart()
  const [orderId, setOrderId] = useState('')

  useEffect(() => {
    const state = location.state
    if (state?.orderId) {
      setOrderId(state.orderId)
      clearCart()
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
        <h1 style={{ color: '#4CAF50' }}>✅ Thanh toán thành công!</h1>
        <p style={{ fontSize: '16px', marginBottom: '20px' }}>
          Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xác nhận.
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
            <strong>Mã đơn hàng:</strong>
            <p style={{ fontSize: '18px', color: '#4CAF50', margin: '5px 0' }}>{orderId}</p>
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
          Về Trang Chủ
        </button>
      </div>
    </MainLayout>
  )
}
