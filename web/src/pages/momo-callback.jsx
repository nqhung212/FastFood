import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import MainLayout from '../layouts/home-layout.jsx'

export default function MoMoCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const timer = setTimeout(() => {
      const orderId = searchParams.get('orderId') || `ORDER_${Date.now()}`
      navigate('/payment-rollback', {
        state: { orderId },
      })
    }, 2000)

    return () => clearTimeout(timer)
  }, [navigate, searchParams])

  return (
    <MainLayout>
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>Đang xử lý kết quả thanh toán từ MoMo...</p>
      </div>
    </MainLayout>
  )
}
