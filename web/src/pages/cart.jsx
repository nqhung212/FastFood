// src/pages/cart.jsx
import MainLayout from "../layouts/home-layout.jsx";
import { useCart } from "../context/cart-context.jsx";

export default function CartPage() {
  const { cartItems, removeFromCart } = useCart();

  return (
    <MainLayout>
      <div className="cart-page">
        <h2>🛒 Giỏ hàng của bạn</h2>

        {cartItems.length === 0 ? (
          <p>Giỏ hàng trống</p>
        ) : (
          <ul className="cart-list">
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
        )}
      </div>
    </MainLayout>
  );
}
