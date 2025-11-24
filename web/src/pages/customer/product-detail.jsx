// src/pages/product-detail.jsx
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import MainLayout from '../../layouts/home-layout.jsx'
import '../../assets/styles/product-detail.css'
import { useCart } from '../../context/cart-context.jsx'
import { useAuth } from '../../context/auth-context.jsx'
import { supabase } from '../../lib/supabaseClient'

export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const { user } = useAuth()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from('product')
          .select('*, restaurant_id')
          .eq('slug', slug)
          .limit(1)
        if (error) throw error
        const fetchedProduct = data && data.length ? data[0] : null
        console.log('🛍️ Fetched product:', fetchedProduct)
        setProduct(fetchedProduct)
      } catch (err) {
        console.error('Error loading product:', err)
      }
    }

    fetchProduct()
  }, [slug])

  const handleAddToCart = () => {
    if (!user) {
      // Redirect to login if user is not authenticated
      navigate('/login')
      return
    }

    if (product && quantity > 0) {
      console.log('➕ Adding to cart. Product object:', product)
      console.log('   restaurant_id in product:', product.restaurant_id)
      addToCart(
        {
          ...product,
          image: getImageUrl(product.image),
        },
        quantity
      )
      setQuantity(1)
    }
  }

  if (!product)
    return (
      <MainLayout>
        <p>Loading...</p>
      </MainLayout>
    )

  const getImageUrl = (imageField) => {
    if (!imageField) return '/images/placeholder.png'
    if (imageField.startsWith('http://') || imageField.startsWith('https://')) {
      return imageField
    }
    return `/images/${imageField}`
  }

  return (
    <MainLayout>
      <div className="product-detail">
        <h2>{product.name}</h2>
        <div className="product-image-container">
          <img src={getImageUrl(product.image)} alt={product.name} />
        </div>
        <div className="product-info">
          <div className="product-description">
            <p>{product.description}</p>
          </div>
          <div className="product-price">
            <span className="product-price-label">Price:</span>
            <span className="product-price-value">{product.price.toLocaleString()}₫</span>
          </div>
          <div className="product-quantity-control">
            <label className="qty-label">Quantity:</label>
            <div className="qty-selector">
              <button
                className="qty-btn-small"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                −
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="qty-input"
              />
              <button className="qty-btn-small" onClick={() => setQuantity(quantity + 1)}>
                +
              </button>
            </div>
          </div>
          <button onClick={handleAddToCart}>Add to cart</button>
        </div>
      </div>
    </MainLayout>
  )
}
