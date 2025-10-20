import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../layouts/home-layout.jsx'
import { initiateMoMoPayment, savePaymentToSupabase } from '../api/momo-payment.js'
import { useAuth } from '../context/auth-context'
import { supabase } from '../lib/supabaseClient'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
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

  // Check if user is logged in, redirect to login if not
  useEffect(() => {
    if (!user && checkoutData) {
      navigate('/login', { state: { from: '/checkout' } })
    }
  }, [user, checkoutData, navigate])

  const handlePayment = async () => {
    if (!checkoutData || !user) return

    if (selectedPayment === 'momo') {
      setLoading(true)
      setError(null)
      try {
        // Generate UUID for orderId
        const orderId = crypto.randomUUID()
        sessionStorage.setItem('currentOrderId', orderId)
        sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData))
        setPaymentInitiated(true)

        // Step 1: Create order first (required for FK constraint)
        const { error: orderError } = await supabase.from('orders').insert([
          {
            id: orderId,
            user_id: user.id,
            total_amount: checkoutData.total,
            status: 'pending',
          },
        ])

        if (orderError) throw new Error(`Failed to create order: ${orderError.message}`)

        // Step 2: Save payment to Supabase
        await savePaymentToSupabase({
          orderId: orderId,
          amount: checkoutData.total,
          orderInfo: 'Payment for FastFood order',
          paymentData: {
            items: checkoutData.items,
            userId: user?.id,
            timestamp: new Date().toISOString(),
          },
        })

        // Step 3: Gọi hàm initiateMoMoPayment với callback
        await initiateMoMoPayment(
          {
            amount: checkoutData.total,
            orderId: orderId,
            orderInfo: 'Payment for FastFood order',
            items: checkoutData.items,
          },
          (orderId) => {
            // Callback when MoMo tab closes - navigate to payment success
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
        <p>Loading...</p>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        <h2>Checkout</h2>

        <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
          <h3>Order details</h3>
          <div style={{ marginBottom: '10px' }}>
            <strong>Items count:</strong> {checkoutData.items.length}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Total:</strong> {checkoutData.total.toLocaleString()}₫
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Time:</strong> {new Date(checkoutData.timestamp).toLocaleString('en-US')}
          </div>
        </div>

        <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
          <h3>Select payment method</h3>
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
            Back
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
              {loading ? 'Processing...' : 'Pay now'}
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
              I have paid
            </button>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
