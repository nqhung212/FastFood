import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import RestaurantLayout from '../../layouts/restaurant-layout'
import { supabase } from '../../lib/supabaseClient'
import '../../assets/styles/restaurant-dashboard.css'

export default function RestaurantDashboard() {
  const navigate = useNavigate()
  const [restaurant, setRestaurant] = useState(null)
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
  })
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const ownerId = localStorage.getItem('restaurantOwnerId')
        if (!ownerId) {
          navigate('/restaurant/login')
          return
        }

        // Fetch restaurant info
        const { data: restaurantData, error: restaurantError } = await supabase
          .from('restaurant')
          .select('*')
          .eq('owner_id', ownerId)
          .single()

        if (restaurantError) {
          throw restaurantError
        }

        setRestaurant(restaurantData)

        // Fetch stats
        if (restaurantData) {
          // Total products
          const { count: productCount } = await supabase
            .from('product')
            .select('*', { count: 'exact' })
            .eq('restaurant_id', restaurantData.restaurant_id)

          // Total categories
          const { count: categoryCount } = await supabase
            .from('category')
            .select('*', { count: 'exact' })
            .eq('restaurant_id', restaurantData.restaurant_id)

          // Total orders
          const { count: orderCount } = await supabase
            .from('order')
            .select('*', { count: 'exact' })
            .eq('restaurant_id', restaurantData.restaurant_id)

          setStats({
            totalProducts: productCount || 0,
            totalCategories: categoryCount || 0,
            totalOrders: orderCount || 0,
          })
        }
      } catch (err) {
        console.error('Dashboard error:', err)
        setMessage(`❌ Error loading dashboard: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('restaurantOwnerId')
    localStorage.removeItem('restaurantOwnerEmail')
    navigate('/')
  }

  if (loading) {
    return (
      <RestaurantLayout>
        <div className="dashboard-page">
          <p>Loading dashboard...</p>
        </div>
      </RestaurantLayout>
    )
  }

  return (
    <RestaurantLayout>
      <div className="dashboard-page">
        <div className="dashboard-header">
          <h1>Restaurant Dashboard</h1>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>

        {message && (
          <p className={message.startsWith('❌') ? 'error-message' : 'success-message'}>
            {message}
          </p>
        )}

        {restaurant && (
          <>
            <div className="restaurant-info-card">
              <h2>{restaurant.name}</h2>
              <p>{restaurant.description}</p>
              <p>
                <strong>Status:</strong> {restaurant.status}
              </p>
              <Link to="/restaurant/info" className="btn-edit">
                Edit Restaurant Info
              </Link>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <h3>{stats.totalProducts}</h3>
                <p>Total Products</p>
                <Link to="/restaurant/products" className="btn-manage">
                  Manage Products
                </Link>
              </div>

              <div className="stat-card">
                <h3>{stats.totalCategories}</h3>
                <p>Total Categories</p>
                <Link to="/restaurant/categories" className="btn-manage">
                  Manage Categories
                </Link>
              </div>

              <div className="stat-card">
                <h3>{stats.totalOrders}</h3>
                <p>Total Orders</p>
                <Link to="/restaurant/orders" className="btn-manage">
                  View Orders
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </RestaurantLayout>
  )
}
