// src/layouts/header.jsx
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/cart-context'
import { useAuth } from '../context/auth-context'
import { useSearch } from '../hooks/use-search'
import { useState } from 'react'
import { useHeaderScroll } from '../hooks/use-header-scroll'

export default function Header() {
  const navigate = useNavigate()
  const { cartItems } = useCart()
  const { user, logout } = useAuth()
  const { searchTerm, setSearchTerm, handleSearch, handleKeyPress } = useSearch()
  const [showHeaderTop, setShowHeaderTop] = useState(true)

  const handleAvatarClick = () => {
    navigate('/account')
  }

  // Use custom hook for header scroll behavior
  useHeaderScroll(setShowHeaderTop)

  return (
    <header className="header-banner">
      {/* Top Bar */}
      <div className={`header-top ${!showHeaderTop ? 'header-top-hidden' : ''}`}>
        <div className="header-top-container">
          <div className="header-top-left">
            <span className="language-selector">EN | VN</span>
            <span className="location">HO CHI MINH</span>
          </div>
          <div className="header-top-right">
            <span className="phone">1900-1533</span>
            <button className="btn-pickup">PICK UP</button>
            <button className="btn-delivery">DELIVERY</button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="header-main">
        <div className="header-container">
          <div className="header-left">
            <div className="header-logo">
              <Link to="/" aria-label="Homepage">
                <img src="/images/logo.png" alt="FastFood Logo" />
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
                placeholder="Search products, categories..."
                aria-label="Search"
              />
              <button type="button" className="search-button" onClick={handleSearch}>
                Search
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
                    title="Your account"
                  />
                  <span className="user-name">{user.name}</span>
                  <button className="btn-logout" onClick={logout}>
                    Logout
                  </button>
                </div>
              ) : (
                <div className="header-auth">
                  <Link to="/login">
                    <button type="button" className="btn-auth">
                      Login
                    </button>
                  </Link>
                  <Link to="/register">
                    <button type="button" className="btn-auth">
                      Register
                    </button>
                  </Link>
                </div>
              )}
            </div>

            <div className="header-cart">
              <Link to="/cart">
                <button type="button" className="btn-cart">
                  🛒 Cart <span className="cart-count">({cartItems.length})</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
