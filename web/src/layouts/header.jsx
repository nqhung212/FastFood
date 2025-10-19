// src/layouts/header.jsx
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/cart-context'
import { useAuth } from '../context/auth-context'
import { useSearch } from '../hooks/use-search'
import { useState, useEffect, useRef } from 'react'
import getImage from '../utils/import-image.js'

const categories = [
  { name: 'Burger', image: '/images/burger.jpg' },
  { name: 'Chicken', image: '/images/pizza.jpg' },
  { name: 'Fries', image: '/images/cola.jpg' },
]

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const { cartItems } = useCart()
  const { user, logout } = useAuth()
  const { searchTerm, setSearchTerm, handleSearch, handleKeyPress } = useSearch()
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [showHeaderTop, setShowHeaderTop] = useState(true)
  const menuRef = useRef(null)
  const hideTimeoutRef = useRef(null)
  const lastScrollRef = useRef(0)
  const HIDE_DELAY = 100 // ms

  const handleAvatarClick = () => {
    navigate('/account')
  }

  const isMenuPage = location.pathname.includes('/menu')

  // Luôn mở dropdown khi ở /menu
  useEffect(() => {
    if (isMenuPage) {
      setShowCategoryDropdown(true)
    }
  }, [isMenuPage])

  // Close dropdown when clicking outside (chỉ khi không ở /menu)
  useEffect(() => {
    if (isMenuPage) return // Do not close dropdown when on /menu

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowCategoryDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMenuPage])

  // clear any pending hide timeout on unmount
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
        hideTimeoutRef.current = null
      }
    }
  }, [])

  // Handle scroll to hide/show header-top
  useEffect(() => {
    const handleScroll = () => {
      // Hide header-top when scrollY > 0, show only when at top (scrollY === 0)
      if (window.scrollY > 0) {
        setShowHeaderTop(false)
      } else {
        setShowHeaderTop(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
                    title="Tài khoản của bạn"
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

      {/* Navigation Bar */}
      <nav className="header-nav">
        <div className="nav-container">
          <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
            HOME
          </Link>
          <div
            ref={menuRef}
            className={`nav-item menu-item ${isMenuPage ? 'active' : ''}`}
            onMouseEnter={() => {
              // clear any pending hide timeout and show dropdown
              if (hideTimeoutRef.current) {
                clearTimeout(hideTimeoutRef.current)
                hideTimeoutRef.current = null
              }
              if (!isMenuPage) setShowCategoryDropdown(true)
            }}
            onMouseLeave={() => {
              // delay hiding so user can move into the dropdown without it disappearing
              if (isMenuPage) return
              if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
              hideTimeoutRef.current = setTimeout(() => {
                setShowCategoryDropdown(false)
                hideTimeoutRef.current = null
              }, HIDE_DELAY)
            }}
          >
            <button type="button" onClick={() => navigate('/menu')}>
              MENU
            </button>
            {showCategoryDropdown && !isMenuPage && (
              <div
                className="category-dropdown"
                onMouseEnter={() => {
                  if (hideTimeoutRef.current) {
                    clearTimeout(hideTimeoutRef.current)
                    hideTimeoutRef.current = null
                  }
                }}
                onMouseLeave={() => {
                  if (isMenuPage) return
                  if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
                  hideTimeoutRef.current = setTimeout(() => {
                    setShowCategoryDropdown(false)
                    hideTimeoutRef.current = null
                  }, HIDE_DELAY)
                }}
              >
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    className="dropdown-item"
                    type="button"
                    onClick={() => {
                      navigate(`/menu/${cat.name}`)
                      setShowCategoryDropdown(false)
                    }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <img src={getImage(cat.image)} alt={cat.name} />

                    <span>{cat.name}</span>
                  </button>
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

      {/* Category Dropdown khi ở /menu */}
      {isMenuPage && showCategoryDropdown && (
        <div className="menu-page-dropdown-section">
          <div className="menu-page-dropdown">
            {categories.map((cat) => (
              <button
                key={cat.name}
                className="dropdown-item"
                onClick={() => navigate(`/menu/${cat.name}`)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <img src={getImage(cat.image)} alt={cat.name} />
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
