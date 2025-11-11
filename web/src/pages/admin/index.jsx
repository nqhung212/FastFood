import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../layouts/admin-layout'
import { useAdminGuard } from '../../hooks/use-admin-guard'
import { supabase } from '../../lib/supabaseClient'

export default function AdminDashboard() {
  const { isAdmin, isLoading } = useAdminGuard()
  const navigate = useNavigate()
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
          <p>Loading...</p>
        </div>
      </AdminLayout>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="page-header">
          <h1>Overview</h1>
        </div>
        {statsLoading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p>Loading statistics...</p>
          </div>
        ) : (
          <div className="dashboard-grid">
            <div
              className="dashboard-card"
              onClick={() => navigate('/admin/orders')}
              style={{ cursor: 'pointer' }}
            >
              <div className="dashboard-card-label">Total Orders</div>
              <div className="dashboard-card-value">{stats.totalOrders}</div>
            </div>

            <div
              className="dashboard-card"
              onClick={() => navigate('/admin/users')}
              style={{ cursor: 'pointer' }}
            >
              <div className="dashboard-card-label">Total Users</div>
              <div className="dashboard-card-value">{stats.totalUsers}</div>
            </div>

            <div
              className="dashboard-card"
              onClick={() => navigate('/admin/products')}
              style={{ cursor: 'pointer' }}
            >
              <div className="dashboard-card-label">Total Products</div>
              <div className="dashboard-card-value">{stats.totalProducts}</div>
            </div>

            <div
              className="dashboard-card"
              onClick={() => navigate('/admin/categories')}
              style={{ cursor: 'pointer' }}
            >
              <div className="dashboard-card-label">Total Categories</div>
              <div className="dashboard-card-value">{stats.totalCategories}</div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
