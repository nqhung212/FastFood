import { useNavigate } from 'react-router-dom'
import MainLayout from '../layouts/home-layout.jsx'
import { useCart } from '../context/cart-context.jsx'
import '../assets/styles/cart.css'

const getImageUrl = (imageField) => {
  if (!imageField) return '/images/placeholder.png'
  if (imageField.startsWith('http://') || imageField.startsWith('https://')) {
    return imageField
  }
  return `/images/${imageField}`
}

export default function CartPage() {
  const { cartItems, removeFromCart, incrementQuantity, decrementQuantity } = useCart()
  const navigate = useNavigate()

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleCheckout = () => {
    const cartData = {
      items: cartItems.map((item) => ({
        ...item,
        quantity: item.quantity || 1,
        subtotal: item.price * (item.quantity || 1),
      })),
      total: totalPrice,
      timestamp: new Date().toISOString(),
    }
    sessionStorage.setItem('checkoutData', JSON.stringify(cartData))
    navigate('/checkout')
  }

  return (
    <MainLayout>
      <div className="cart-page">
        <h2>🛒 Your Cart</h2>

        {cartItems.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <>
            <ul className="cart-list">
              {cartItems.map((item) => {
                const imgSrc = getImageUrl(item.image)

                return (
                  <li key={item.id} className="cart-item">
                    <img src={imgSrc} alt={item.name} />
                    <div className="cart-info">
                      <h3>{item.name}</h3>
                      <p>{item.price.toLocaleString()}₫</p>
                    </div>
                    <div className="cart-quantity">
                      <button onClick={() => decrementQuantity(item.id)} className="qty-btn">
                        −
                      </button>
                      <span className="qty-value">{item.quantity || 1}</span>
                      <button onClick={() => incrementQuantity(item.id)} className="qty-btn">
                        +
                      </button>
                    </div>
                    <div className="cart-subtotal">
                      <p>{(item.price * (item.quantity || 1)).toLocaleString()}₫</p>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="btn-remove">
                      Remove
                    </button>
                  </li>
                )
              })}
            </ul>
            <div className="cart-summary">
              <h3>Total: {totalPrice.toLocaleString()}₫</h3>
              <button onClick={handleCheckout}>Checkout</button>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  )
}
