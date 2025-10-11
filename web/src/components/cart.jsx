// // src/components/cart.jsx
// import { useCart } from "../context/cart-context";

// export default function Cart() {
//   const { cartItems, removeFromCart, isCartOpen, toggleCart } = useCart();

//   if (!isCartOpen) return null; // ẩn khi chưa mở

//   return (
//     <div className="cart-overlay">
//       <div className="cart-container">
//         <h2>🛒 Giỏ hàng của bạn</h2>
//         <button onClick={toggleCart}>Đóng</button>

//         {cartItems.length === 0 ? (
//           <p>Giỏ hàng trống</p>
//         ) : (
//           <ul>
//             {cartItems.map((item) => (
//               <li key={item.id}>
//                 <img src={item.image} alt={item.name} width={60} />
//                 <div>
//                   <p>{item.name}</p>
//                   <p>{item.price.toLocaleString()}₫</p>
//                 </div>
//                 <button onClick={() => removeFromCart(item.id)}>Xóa</button>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }
