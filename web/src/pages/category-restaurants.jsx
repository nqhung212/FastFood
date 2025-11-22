import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import MainLayout from '../layouts/home-layout.jsx'
import { supabase } from '../lib/supabaseClient'
import '../assets/styles/category-restaurants.css'

export default function CategoryRestaurants() {
  const { categoryName } = useParams()
  const navigate = useNavigate()
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true)

        // Lấy tất cả categories để tìm match (case-insensitive)
        const { data: allCategories, error: catError } = await supabase
          .from('category')
          .select('category_id, name, status')

        if (catError) {
          throw catError
        }

        if (!allCategories || allCategories.length === 0) {
          throw new Error('No categories found in database')
        }

        // Tìm category theo tên (case-insensitive)
        const matchedCategory = allCategories.find(
          (cat) => cat.name.toLowerCase() === categoryName.toLowerCase() && cat.status === true
        )

        if (!matchedCategory) {
          const availableCategories = allCategories.map((c) => c.name).join(', ')
          throw new Error(
            `Category "${categoryName}" not found. Available: ${availableCategories || 'none'}`
          )
        }

        // Lấy tất cả restaurants có products trong category này
        const { data: productsData, error: prodError } = await supabase
          .from('product')
          .select('restaurant_id')
          .eq('category_id', matchedCategory.category_id)

        if (prodError) throw prodError

        if (!productsData || productsData.length === 0) {
          setRestaurants([])
          setLoading(false)
          return
        }

        // Lấy unique restaurant_ids
        const uniqueRestaurantIds = [...new Set(productsData.map((p) => p.restaurant_id))]

        // Lấy thông tin restaurants
        const { data: restaurantsData, error: restError } = await supabase
          .from('restaurant')
          .select('restaurant_id, name, description, logo_url, status')
          .in('restaurant_id', uniqueRestaurantIds)
          .eq('status', 'active')

        if (restError) throw restError

        setRestaurants(restaurantsData || [])
      } catch (err) {
        console.error('Error fetching restaurants:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (categoryName) {
      fetchRestaurants()
    }
  }, [categoryName])

  return (
    <MainLayout>
      <div className="category-restaurants-page">
        <div className="page-header">
          <button className="back-button" onClick={() => navigate('/')}>
            ← Back
          </button>
          <h1>{categoryName}</h1>
        </div>

        {loading && <p className="loading">Loading restaurants...</p>}

        {error && <p className="error">Error: {error}</p>}

        {!loading && restaurants.length === 0 && (
          <p className="no-restaurants">No restaurants found for this category</p>
        )}

        {!loading && restaurants.length > 0 && (
          <div className="restaurants-grid">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant.restaurant_id}
                className="restaurant-card"
                onClick={() => navigate(`/restaurant/${restaurant.restaurant_id}/${categoryName}`)}
                style={{ cursor: 'pointer' }}
              >
                {restaurant.logo_url && (
                  <img
                    src={restaurant.logo_url}
                    alt={restaurant.name}
                    className="restaurant-logo"
                  />
                )}
                <div className="restaurant-info">
                  <h3 className="restaurant-name">{restaurant.name}</h3>
                  {restaurant.description && (
                    <p className="restaurant-description">{restaurant.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}
