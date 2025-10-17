// src/layouts/header.jsx
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/cart-context'
import { useAuth } from '../context/auth-context'
import { useSearch } from '../hooks/use-search'
import { useCategories } from '../hooks/use-categories'
import { useState } from 'react'

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const { cartItems } = useCart()
  const { user, logout } = useAuth()
  const { searchTerm, setSearchTerm, handleSearch, handleKeyPress } = useSearch()
  const { categories = [] } = useCategories()
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)

  const handleAvatarClick = () => {
    navigate('/account')
  }

  const isMenuPage = location.pathname.includes('/menu')

  return (
    <header className="header-banner">
      {/* Top Bar */}
      <div className="header-top">
        <div className="header-top-container">
          <div className="header-top-left">
            <span className="language-selector">EN | VN</span>
            <span className="location">HỒ CHÍ MINH</span>
          </div>
          <div className="header-top-right">
            <span className="phone">1900-1533</span>
            <button className="btn-pickup">PICK UP</button>
            <button className="btn-delivery">GIAO HÀNG TẬN NƠI</button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="header-main">
        <div className="header-container">
          <div className="header-left">
            <div className="header-logo">
              <Link to="/" aria-label="Homepage">
                <img src="/images/Mercedes-Logo.svg.png" alt="FastFood Logo" />
              </Link>
            </div>
          </div>

          <div className="header-center">
            <div className="header-search">
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tìm kiếm sản phẩm, danh mục..."
                aria-label="Search"
              />
              <button type="button" className="search-button" onClick={handleSearch}>
                Tìm
              </button>
            </div>
          </div>

          <div className="header-right">
            <div className="header-user-section">
              {user ? (
                <div className="header-user">
                  <img
                    src="/images/images.jpg"
                    alt="User Avatar"
                    className="user-avatar"
                    onClick={handleAvatarClick}
                    title="Tài khoản của bạn"
                  />
                  <span className="user-name">{user.name}</span>
                  <button className="btn-logout" onClick={logout}>
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="header-auth">
                  <Link to="/login">
                    <button type="button" className="btn-auth">
                      Đăng nhập
                    </button>
                  </Link>
                  <Link to="/register">
                    <button type="button" className="btn-auth">
                      Đăng ký
                    </button>
                  </Link>
                </div>
              )}
            </div>

            <div className="header-cart">
              <Link to="/cart">
                <button type="button" className="btn-cart">
                  🛒 Giỏ hàng <span className="cart-count">({cartItems.length})</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="header-nav">
        <div className="nav-container">
          <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
            HOME
          </Link>
          <div
            className={`nav-item menu-item ${isMenuPage ? 'active' : ''}`}
            onMouseEnter={() => setShowCategoryDropdown(true)}
            onMouseLeave={() => setShowCategoryDropdown(false)}
          >
            <Link to="/menu">MENU</Link>
            {showCategoryDropdown && (
              <div className="category-dropdown">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/menu/${cat.slug}`}
                    className="dropdown-item"
                    onClick={() => setShowCategoryDropdown(false)}
                  >
                    <img src={cat.icon} alt={cat.name} />
                    <span>{cat.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <a href="#" className="nav-item">
            PROMOTION
          </a>
          <a href="#" className="nav-item">
            CONTACT
          </a>
          <a href="#" className="nav-item">
            ABOUT
          </a>
        </div>
      </nav>
    </header>
  )
}
