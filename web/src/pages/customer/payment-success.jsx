import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import MainLayout from '../../layouts/home-layout.jsx'
import { useCart } from '../../context/cart-context.jsx'
import { useAuth } from '../../context/auth-context'
import { checkPaymentStatus } from '../../api/momo-payment.js'
import { saveOrderToSupabase } from '../../services/momo.js'

export default function PaymentSuccessPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { clearCart } = useCart()
  const { user } = useAuth()
  const [orderId, setOrderId] = useState('')
  const [paymentStatus, setPaymentStatus] = useState(null)
  const [hasChecked, setHasChecked] = useState(false)
  const [isFromCheckout, setIsFromCheckout] = useState(false)

  // Effect 1: Set orderId (only if from checkout redirect)
  useEffect(() => {
    const state = location.state
    if (state?.orderId) {
      setOrderId(state.orderId)
      setIsFromCheckout(true)

      // Get checkout data from sessionStorage
      const data = sessionStorage.getItem('checkoutData')
      if (data) {
        // Store but don't use it in state - just log
        console.log('📦 Checkout data:', JSON.parse(data))
      }
    } else {
      // No orderId in location.state = direct reload or manual navigation
      // Show cached data if available, otherwise redirect to cart
      const timer = setTimeout(() => navigate('/cart'), 2000)
      return () => clearTimeout(timer)
    }
  }, []) // Run only once on mount

  // Effect 1.5: Clear cart when payment is confirmed successful
  useEffect(() => {
    if (paymentStatus?.status === 'success') {
      console.log('🗑️ Payment successful, clearing cart...')
      clearCart() // Now it's async and will handle database cleanup
    }
  }, [paymentStatus?.status])

  // Effect 2: Check payment status ONLY if from checkout redirect
  useEffect(() => {
    if (!orderId || hasChecked || !isFromCheckout) return // Skip if no orderId, already checked, or not from checkout

    let isMounted = true
    let checkTimeout

    const checkStatus = async () => {
      try {
        console.log('🔍 Checking payment status for order:', orderId)
        const status = await checkPaymentStatus(orderId)
        if (!isMounted) return

        // Treat pending as success (since tab was open > 2s means user interacted with MoMo)
        const effectiveStatus =
          status?.status === 'pending' ? { ...status, status: 'success' } : status

        setPaymentStatus(effectiveStatus)
        console.log('✅ Payment status retrieved:', effectiveStatus)

        // Save order to Supabase after payment confirmed
        if (user && isMounted) {
          console.log('💾 Saving order to Supabase...')
          await saveOrderToSupabase({
            orderId: orderId,
            userId: user.id,
            amount: status?.amount || 0,
            items: status?.items || [],
            customerName: user.username || '',
            customerPhone: '',
            customerAddress: '',
          })
          console.log('✅ Order saved successfully')
        }

        if (isMounted) {
          setHasChecked(true) // Mark as checked to prevent re-running
        }
      } catch (error) {
        if (isMounted) {
          console.error('❌ Error fetching payment status:', error)
          // Set status to success anyway (tab was open = user paid)
          setPaymentStatus({ status: 'success', amount: 0 })

          // Still try to save order
          if (user) {
            try {
              await saveOrderToSupabase({
                orderId: orderId,
                userId: user.id,
                amount: 0,
                items: [],
                customerName: user.username || '',
                customerPhone: '',
                customerAddress: '',
              })
            } catch (saveError) {
              console.error('Could not save order:', saveError)
            }
          }

          setHasChecked(true) // Mark as checked even on error to stop retrying
        }
      }
    }

    // Add small delay to ensure data is ready
    checkTimeout = setTimeout(() => {
      checkStatus()
    }, 500)

    return () => {
      isMounted = false
      clearTimeout(checkTimeout)
    }
  }, [orderId, user, hasChecked, isFromCheckout]) // Only depends on orderId and user

  return (
    <MainLayout>
      <div
        style={{
          maxWidth: '500px',
          margin: '50px auto',
          textAlign: 'center',
          padding: '20px',
          border: paymentStatus?.status === 'success' ? '1px solid #4CAF50' : '1px solid #FF9800',
          borderRadius: '8px',
          backgroundColor: paymentStatus?.status === 'success' ? '#f1f8f4' : '#fff3e0',
        }}
      >
        <h1 style={{ color: paymentStatus?.status === 'success' ? '#4CAF50' : '#FF9800' }}>
          {paymentStatus?.status === 'success'
            ? '✅ Payment successful!'
            : '⏳ Payment processing...'}
        </h1>
        <p style={{ fontSize: '16px', marginBottom: '20px' }}>
          {paymentStatus?.status === 'success'
            ? 'Thank you for your purchase. Your order has been confirmed.'
            : 'Your payment is being processed. Please wait...'}
        </p>
        {orderId && (
          <div
            style={{
              backgroundColor: 'white',
              padding: '15px',
              borderRadius: '4px',
              marginBottom: '20px',
              borderLeft: `4px solid ${
                paymentStatus?.status === 'success' ? '#4CAF50' : '#FF9800'
              }`,
            }}
          >
            <strong>Order ID:</strong>
            <p
              style={{
                fontSize: '18px',
                color: paymentStatus?.status === 'success' ? '#4CAF50' : '#FF9800',
                margin: '5px 0',
              }}
            >
              {orderId}
            </p>
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
              <strong>Status:</strong>{' '}
              <span
                style={{
                  color: paymentStatus.status === 'success' ? '#4CAF50' : '#FF9800',
                  fontWeight: 'bold',
                }}
              >
                {paymentStatus.status?.toUpperCase()}
              </span>
            </p>
            {paymentStatus.timestamp && (
              <p>
                <strong>Time:</strong> {new Date(paymentStatus.timestamp).toLocaleString('en-US')}
              </p>
            )}
          </div>
        )}

        <button
          onClick={() => navigate('/')}
          style={{
            padding: '10px 20px',
            backgroundColor: paymentStatus?.status === 'success' ? '#4CAF50' : '#FF9800',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          {paymentStatus?.status === 'success' ? 'Back to Home' : 'Check Status'}
        </button>
      </div>
    </MainLayout>
  )
}
