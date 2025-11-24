import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import '../assets/styles/restaurant-layout.css'

export default function RestaurantLayout({ children }) {
  const navigate = useNavigate()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const restaurantOwnerId = localStorage.getItem('restaurantOwnerId')
  const restaurantOwnerEmail = localStorage.getItem('restaurantOwnerEmail')

  const handleLogout = () => {
    localStorage.removeItem('restaurantOwnerId')
    localStorage.removeItem('restaurantOwnerEmail')
    navigate('/restaurant/login')
  }

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu)
  }

  return (
    <div className="restaurant-layout">
      {/* Sidebar Navigation */}
      <aside className={`restaurant-sidebar ${showMobileMenu ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <h2>FastFood Admin</h2>
          <button className="close-mobile-menu" onClick={toggleMobileMenu}>
            ×
          </button>
        </div>

        <nav className="sidebar-nav">
          <Link
            to="/restaurant/dashboard"
            className="nav-item"
            onClick={() => setShowMobileMenu(false)}
          >
            📊 Dashboard
          </Link>
          <Link
            to="/restaurant/products"
            className="nav-item"
            onClick={() => setShowMobileMenu(false)}
          >
            🍕 Products
          </Link>
          <Link
            to="/restaurant/categories"
            className="nav-item"
            onClick={() => setShowMobileMenu(false)}
          >
            📂 Categories
          </Link>
          <Link
            to="/restaurant/orders"
            className="nav-item"
            onClick={() => setShowMobileMenu(false)}
          >
            📦 Orders
          </Link>
          <Link to="/restaurant/info" className="nav-item" onClick={() => setShowMobileMenu(false)}>
            ⚙️ Settings
          </Link>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="btn-logout-sidebar">
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="mobile-menu-overlay" onClick={() => setShowMobileMenu(false)} />
      )}

      {/* Main Content */}
      <div className="restaurant-main">
        {/* Top Header Bar */}
        <header className="restaurant-header">
          <div className="header-left">
            <button className="menu-toggle" onClick={toggleMobileMenu}>
              ☰
            </button>
            <h1 className="page-title">FastFood Restaurant Manager</h1>
          </div>

          <div className="header-right">
            <div className="user-info">
              <span className="user-email">{restaurantOwnerEmail}</span>
              <button onClick={handleLogout} className="btn-logout-header">
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="restaurant-content">{children}</main>

        {/* Footer */}
        <footer className="restaurant-footer">
          <p>&copy; 2025 FastFood. All rights reserved for Restaurant Owners.</p>
        </footer>
      </div>
    </div>
  )
}
