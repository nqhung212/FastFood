import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import MainLayout from '../../layouts/home-layout.jsx'
import { supabase } from '../../lib/supabaseClient'
import { useCart } from '../../context/cart-context'
import { useAuth } from '../../context/auth-context'
import '../../assets/styles/restaurant-products.css'

export default function RestaurantProducts() {
  const { restaurantId, categoryName } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { user } = useAuth()
  const [restaurant, setRestaurant] = useState(null)
  const [categoryProducts, setCategoryProducts] = useState([])
  const [otherProducts, setOtherProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [notification, setNotification] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Lấy thông tin restaurant
        const { data: restaurantData, error: restError } = await supabase
          .from('restaurant')
          .select('restaurant_id, name, description, logo_url')
          .eq('restaurant_id', restaurantId)
          .single()

        if (restError || !restaurantData) {
          throw new Error('Restaurant not found')
        }

        setRestaurant(restaurantData)

        // Lấy tất cả categories để tìm match (case-insensitive)
        const { data: allCategories, error: catError } = await supabase
          .from('category')
          .select('category_id, name, status, restaurant_id')

        if (catError) {
          throw catError
        }

        if (!allCategories || allCategories.length === 0) {
          throw new Error('No categories found')
        }

        // Tìm category theo tên + restaurant_id (case-insensitive)
        let matchedCategory = allCategories.find(
          (cat) =>
            cat.name.toLowerCase() === categoryName.toLowerCase() &&
            cat.status === true &&
            cat.restaurant_id === restaurantId
        )

        // Nếu không tìm thấy category của nhà hàng này, tìm category tổng quát (null restaurant_id)
        if (!matchedCategory) {
          matchedCategory = allCategories.find(
            (cat) =>
              cat.name.toLowerCase() === categoryName.toLowerCase() &&
              cat.status === true &&
              !cat.restaurant_id
          )
        }

        if (!matchedCategory) {
          const availableCategories = allCategories.map((c) => c.name).join(', ')
          throw new Error(
            `Category "${categoryName}" not found for this restaurant. Available: ${
              availableCategories || 'none'
            }`
          )
        }

        // Lấy tất cả products của restaurant trong category này
        const { data: categoryProdsData, error: catProdError } = await supabase
          .from('product')
          .select('product_id, name, description, price, image_url, status')
          .eq('restaurant_id', restaurantId)
          .eq('category_id', matchedCategory.category_id)
          .eq('status', true)

        if (catProdError) throw catProdError

        setCategoryProducts(categoryProdsData || [])

        // Lấy tất cả products khác của restaurant (không trong category này)
        const { data: otherProdsData, error: otherProdError } = await supabase
          .from('product')
          .select('product_id, name, description, price, image_url, status')
          .eq('restaurant_id', restaurantId)
          .neq('category_id', matchedCategory.category_id)
          .eq('status', true)

        if (otherProdError) throw otherProdError

        setOtherProducts(otherProdsData || [])
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (restaurantId && categoryName) {
      fetchData()
    }
  }, [restaurantId, categoryName])

  const handleAddToCart = (product) => {
    if (!user) {
      navigate('/login')
      return
    }

    console.log('🔍 handleAddToCart - restaurantId from params:', restaurantId)
    addToCart(
      {
        id: product.product_id,
        name: product.name,
        price: product.price,
        image: product.image_url,
        description: product.description,
        restaurant_id: restaurantId,
      },
      1
    )

    // Show toast notification instead of alert
    setNotification(`✓ ${product.name} added to cart`)
    setTimeout(() => setNotification(''), 3000)
  }

  return (
    <MainLayout>
      <div className="restaurant-products-page">
        {notification && <div className="toast-notification">{notification}</div>}

        <div className="page-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            ← Back
          </button>
          {restaurant && (
            <div className="restaurant-header">
              {restaurant.logo_url && (
                <img
                  src={restaurant.logo_url}
                  alt={restaurant.name}
                  className="restaurant-logo-large"
                />
              )}
              <div className="restaurant-info">
                <h1>{restaurant.name}</h1>
                {restaurant.description && <p>{restaurant.description}</p>}
                <p className="category-label">{categoryName}</p>
              </div>
            </div>
          )}
        </div>

        {loading && <p className="loading">Loading products...</p>}

        {error && <p className="error">Error: {error}</p>}

        {!loading && categoryProducts.length === 0 && otherProducts.length === 0 && (
          <p className="no-products">No products found</p>
        )}

        {!loading && categoryProducts.length > 0 && (
          <div className="products-section featured-section">
            <h2 className="section-title">{categoryName}</h2>
            <div className="products-grid">
              {categoryProducts.map((product) => (
                <div key={product.product_id} className="product-card">
                  {product.image_url && (
                    <img src={product.image_url} alt={product.name} className="product-image" />
                  )}
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    {product.description && (
                      <p className="product-description">{product.description}</p>
                    )}
                    <div className="product-footer">
                      <span className="product-price">{product.price.toLocaleString()}₫</span>
                      <button className="btn-add-cart" onClick={() => handleAddToCart(product)}>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && otherProducts.length > 0 && (
          <div className="products-section other-section">
            <h2 className="section-title">
              Other Items from {restaurant?.name || 'this restaurant'}
            </h2>
            <div className="products-grid">
              {otherProducts.map((product) => (
                <div key={product.product_id} className="product-card">
                  {product.image_url && (
                    <img src={product.image_url} alt={product.name} className="product-image" />
                  )}
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    {product.description && (
                      <p className="product-description">{product.description}</p>
                    )}
                    <div className="product-footer">
                      <span className="product-price">{product.price.toLocaleString()}₫</span>
                      <button className="btn-add-cart" onClick={() => handleAddToCart(product)}>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
