import { useEffect, useState } from 'react'
import AdminLayout from '../../layouts/admin-layout'
import { useAdminGuard } from '../../hooks/use-admin-guard'
import { supabase } from '../../lib/supabaseClient'

export default function AdminDashboard() {
  const { isAdmin, isLoading } = useAdminGuard()
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    totalCategories: 0,
  })
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    if (!isAdmin) return

    const fetchStats = async () => {
      try {
        // Fetch orders count
        const { count: ordersCount } = await supabase.from('orders').select('*', { count: 'exact' })

        // Fetch users count
        const { count: usersCount } = await supabase.from('users').select('*', { count: 'exact' })

        // Fetch products count
        const { count: productsCount } = await supabase
          .from('products')
          .select('*', { count: 'exact' })

        // Fetch categories count
        const { count: categoriesCount } = await supabase
          .from('categories')
          .select('*', { count: 'exact' })

        setStats({
          totalOrders: ordersCount || 0,
          totalUsers: usersCount || 0,
          totalProducts: productsCount || 0,
          totalCategories: categoriesCount || 0,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setStatsLoading(false)
      }
    }

    fetchStats()
  }, [isAdmin])

  if (isLoading) {
    return (
      <AdminLayout>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <p>Đang tải...</p>
        </div>
      </AdminLayout>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <AdminLayout>
      <div className="dashboard-welcome">
        <h1>👋 Chào mừng đến Admin Dashboard</h1>
        <p>Quản lý toàn bộ hệ thống bán hàng tại đây</p>
      </div>

      {statsLoading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>Đang tải thống kê...</p>
        </div>
      ) : (
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="dashboard-card-icon">📦</div>
            <div className="dashboard-card-label">Tổng Đơn Hàng</div>
            <div className="dashboard-card-value">{stats.totalOrders}</div>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card-icon">👥</div>
            <div className="dashboard-card-label">Tổng Người Dùng</div>
            <div className="dashboard-card-value">{stats.totalUsers}</div>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card-icon">🍔</div>
            <div className="dashboard-card-label">Tổng Sản Phẩm</div>
            <div className="dashboard-card-value">{stats.totalProducts}</div>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card-icon">📂</div>
            <div className="dashboard-card-label">Tổng Danh Mục</div>
            <div className="dashboard-card-value">{stats.totalCategories}</div>
          </div>
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '20px', background: 'white', borderRadius: '8px' }}>
        <h3>📝 Hướng dẫn nhanh</h3>
        <ul style={{ lineHeight: '1.8', color: '#666' }}>
          <li>Sử dụng menu bên trái để điều hướng đến các trang quản lý</li>
          <li>
            📦 <strong>Đơn hàng:</strong> Xem và quản lý các đơn hàng từ khách hàng
          </li>
          <li>
            👥 <strong>Người dùng:</strong> Quản lý tài khoản người dùng
          </li>
          <li>
            🍔 <strong>Sản phẩm:</strong> Thêm, sửa, xóa sản phẩm (sắp có)
          </li>
          <li>
            📂 <strong>Danh mục:</strong> Quản lý các danh mục sản phẩm (sắp có)
          </li>
        </ul>
      </div>
    </AdminLayout>
  )
}
