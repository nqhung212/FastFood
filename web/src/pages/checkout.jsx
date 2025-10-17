import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../layouts/home-layout.jsx'
import { getMoMoCheckoutUrl } from '../api/momo-payment.js'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const [checkoutData, setCheckoutData] = useState(null)
  const [selectedPayment, setSelectedPayment] = useState('momo')
  const [paymentInitiated, setPaymentInitiated] = useState(false)

  useEffect(() => {
    const data = sessionStorage.getItem('checkoutData')
    if (!data) {
      navigate('/cart')
      return
    }
    setCheckoutData(JSON.parse(data))
  }, [navigate])

  const handlePayment = () => {
    if (!checkoutData) return

    if (selectedPayment === 'momo') {
      const orderId = `ORDER_${Date.now()}`
      const checkoutUrl = getMoMoCheckoutUrl({
        amount: checkoutData.total,
        orderId: orderId,
        orderInfo: 'Thanh toan don hang',
      })

      sessionStorage.setItem('currentOrderId', orderId)
      setPaymentInitiated(true)
      window.open(checkoutUrl, '_blank')
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
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: '#FF6B6B',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Thanh Toán
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
