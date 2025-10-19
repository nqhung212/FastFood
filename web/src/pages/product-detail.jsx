// src/pages/product-detail.jsx
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import MainLayout from '../layouts/home-layout.jsx'
import '../assets/styles/product-detail.css'
import { useCart } from '../context/cart-context.jsx'
import { API_BASE_URL } from '../constants/index.js'

export default function ProductDetail() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()

  useEffect(() => {
    fetch(`${API_BASE_URL}/products`)
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((p) => p.slug === slug)
        setProduct(found)
      })
      .catch((err) => console.error('Lỗi khi tải sản phẩm:', err))
  }, [slug])

  const handleAddToCart = () => {
    if (product && quantity > 0) {
      addToCart(
        {
          ...product,
          image: `/images/${product.image}`,
        },
        quantity
      )
      setQuantity(1)
    }
  }

  if (!product)
    return (
      <MainLayout>
        <p>Đang tải...</p>
      </MainLayout>
    )

  return (
    <MainLayout>
      <div className="product-detail">
        <h2>{product.name}</h2>
        <div className="product-image-container">
          <img src={`/images/${product.image}`} alt={product.name} />
        </div>
        <div className="product-info">
          <div className="product-description">
            <p>{product.description}</p>
          </div>
          <div className="product-price">
            <span className="product-price-label">Giá:</span>
            <span className="product-price-value">{product.price.toLocaleString()}₫</span>
          </div>
          <div className="product-quantity-control">
            <label className="qty-label">Số lượng:</label>
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
          <button onClick={handleAddToCart}>Thêm vào giỏ</button>
        </div>
      </div>
    </MainLayout>
  )
}
