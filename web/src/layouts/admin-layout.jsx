import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import '../assets/styles/admin-layout.css'

export default function AdminLayout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Get admin session from localStorage
  const adminSession = JSON.parse(localStorage.getItem('adminSession') || '{}')

  const handleLogout = () => {
    localStorage.removeItem('adminSession')
    navigate('/admin/login')
  }

  const isActive = (path) => {
    return location.pathname === path ? 'active' : ''
  }

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h1 className="sidebar-brand">HELLO ADMIN</h1>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
          </button>
        </div>

        <nav className="sidebar-nav">
          <Link to="/admin" className={`nav-item ${isActive('/admin')}`}>
            <span className="nav-label">Dashboard</span>
          </Link>
          <Link to="/admin/orders" className={`nav-item ${isActive('/admin/orders')}`}>
            <span className="nav-label">Orders</span>
          </Link>
          <Link to="/admin/users" className={`nav-item ${isActive('/admin/users')}`}>
            <span className="nav-label">Users</span>
          </Link>
          <Link to="/admin/products" className={`nav-item ${isActive('/admin/products')}`}>
            <span className="nav-label">Products</span>
          </Link>
          <Link to="/admin/categories" className={`nav-item ${isActive('/admin/categories')}`}>
            <span className="nav-label">Categories</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-content">{children}</div>
      </main>
    </div>
  )
}
