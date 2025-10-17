import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../layouts/home-layout.jsx'
import { initiateMoMoPayment } from '../api/momo-payment.js'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const [checkoutData, setCheckoutData] = useState(null)
  const [selectedPayment, setSelectedPayment] = useState('momo')
  const [paymentInitiated, setPaymentInitiated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const data = sessionStorage.getItem('checkoutData')
    if (!data) {
      navigate('/cart')
      return
    }
    setCheckoutData(JSON.parse(data))
  }, [navigate])

  const handlePayment = async () => {
    if (!checkoutData) return

    if (selectedPayment === 'momo') {
      setLoading(true)
      setError(null)
      try {
        const orderId = `ORDER_${Date.now()}`
        sessionStorage.setItem('currentOrderId', orderId)
        sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData))
        setPaymentInitiated(true)

        // Gọi hàm initiateMoMoPayment với callback
        await initiateMoMoPayment(
          {
            amount: checkoutData.total,
            orderId: orderId,
            orderInfo: 'Thanh toán đơn hàng FastFood',
            items: checkoutData.items,
          },
          (orderId) => {
            // Callback khi tab MoMo đóng - chuyển sang payment success
            console.log('💚 Redirecting to payment success...')
            sessionStorage.removeItem('checkoutData')
            navigate('/payment-success', { state: { orderId } })
          }
        )
      } catch (err) {
        setError(err.message)
        setPaymentInitiated(false)
        console.error('Payment error:', err)
      } finally {
        setLoading(false)
      }
    }
  }

  const handlePaymentComplete = () => {
    const orderId = sessionStorage.getItem('currentOrderId')
    sessionStorage.setItem('orderData', JSON.stringify(checkoutData))
    sessionStorage.removeItem('checkoutData')
    sessionStorage.removeItem('currentOrderId')
    navigate('/payment-rollback', {
      state: { orderId },
    })
  }

  if (!checkoutData) {
    return (
      <MainLayout>
        <p>Đang tải...</p>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        <h2>Thanh Toán</h2>

        <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
          <h3>Chi tiết đơn hàng</h3>
          <div style={{ marginBottom: '10px' }}>
            <strong>Số lượng sản phẩm:</strong> {checkoutData.items.length}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Tổng tiền:</strong> {checkoutData.total.toLocaleString()}₫
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Thời gian:</strong> {new Date(checkoutData.timestamp).toLocaleString('vi-VN')}
          </div>
        </div>

        <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
          <h3>Chọn phương thức thanh toán</h3>
          <label style={{ display: 'block', marginBottom: '10px' }}>
            <input
              type="radio"
              value="momo"
              checked={selectedPayment === 'momo'}
              onChange={(e) => setSelectedPayment(e.target.value)}
              disabled={paymentInitiated}
            />
            <span style={{ marginLeft: '8px' }}>MoMo Wallet</span>
          </label>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: '#ffebee',
              border: '1px solid #ef5350',
              color: '#c62828',
              padding: '12px',
              borderRadius: '4px',
              marginBottom: '20px',
            }}
          >
            ❌ {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => navigate('/cart')}
            disabled={paymentInitiated}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: paymentInitiated ? '#ddd' : '#ccc',
              border: 'none',
              borderRadius: '4px',
              cursor: paymentInitiated ? 'not-allowed' : 'pointer',
            }}
          >
            Quay Lại
          </button>
          {!paymentInitiated ? (
            <button
              onClick={handlePayment}
              disabled={loading}
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: loading ? '#ddd' : '#FF6B6B',
                color: loading ? '#666' : 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
              }}
            >
              {loading ? 'Đang xử lý...' : 'Thanh Toán'}
            </button>
          ) : (
            <button
              onClick={handlePaymentComplete}
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              Tôi đã thanh toán
            </button>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
