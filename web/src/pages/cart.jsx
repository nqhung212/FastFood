import { useNavigate } from 'react-router-dom'
import MainLayout from '../layouts/home-layout.jsx'
import { useCart } from '../context/cart-context.jsx'

export default function CartPage() {
  const { cartItems, removeFromCart } = useCart()
  const navigate = useNavigate()

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0)

  const handleCheckout = () => {
    const cartData = {
      items: cartItems,
      total: totalPrice,
      timestamp: new Date().toISOString(),
    }
    sessionStorage.setItem('checkoutData', JSON.stringify(cartData))
    navigate('/checkout')
  }

  return (
    <MainLayout>
      <div className="cart-page">
        <h2>🛒 Giỏ hàng của bạn</h2>

        {cartItems.length === 0 ? (
          <p>Giỏ hàng trống</p>
        ) : (
          <>
            <ul className="cart-list" style={{ listStyle: 'none' }}>
              {cartItems.map((item) => (
                <li key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} width={80} />
                  <div className="cart-info">
                    <h3>{item.name}</h3>
                    <p>{item.price.toLocaleString()}₫</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)}>Xóa</button>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <h3>Tổng cộng: {totalPrice.toLocaleString()}₫</h3>
              <button onClick={handleCheckout} style={{ padding: '10px 20px', marginTop: '10px' }}>
                Thanh Toán
              </button>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  )
}
