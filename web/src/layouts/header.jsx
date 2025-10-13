// src/layouts/header.jsx
import { Link } from 'react-router-dom'
import { useCart } from '../context/cart-context'
import { useAuth } from '../context/auth-context'

export default function Header() {
  const { cartItems } = useCart()
  const { user, logout } = useAuth()

  return (
    <header className="header-banner">
      <div className="header-container">
        <div className="header-left">
          <div className="header-logo" id="header-logo">
            <a href="/" aria-label="Homepage">
              <img src="/images/Mercedes-Logo.svg.png" alt="Logo" />
            </a>
          </div>
        </div>

        <div className="header-center">
          <div className="header-search" id="header-search">
            <input type="search" placeholder="Tìm kiếm sản phẩm, danh mục..." aria-label="Search" />
            <button type="button" className="search-button">Tìm</button>
          </div>
        </div>

        <div className="header-right">
          {user ? (
            <div className="header-user">
              <img src="/images/images.jpg" alt="User Avatar" className="user-avatar" />
              <button onClick={logout}>Đăng xuất</button>
            </div>
          ) : (
            <div className="header-auth">
              <Link to="/login"><button type="button">Đăng nhập</button></Link>
              <Link to="/register"><button type="button">Đăng ký</button></Link>
            </div>
          )}
          <div className="header-cart">
            <Link to="/cart">
              <button type="button">Giỏ hàng ({cartItems.length})</button>
            </Link>
          </div>
        </div>
      </div>

      <div className="header-separator">
        <nav className="header-categories" id="header-categories" aria-label="Danh mục">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/menu">Menu</Link></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Career</a></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
