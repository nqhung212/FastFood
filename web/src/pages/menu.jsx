// src/pages/menu.jsx
import { Link } from 'react-router-dom'
import MenuLayout from '../layouts/menu-layout.jsx'
import { useProducts } from '../hooks/use-products.js'
import '../assets/styles/menu-categories.css'

export default function Menu() {
  const { products = [], loading, error } = useProducts()

  return (
    <MenuLayout>
      <div className="menu-page">
        {/* Page Title */}
        <div className="menu-header">
          <h2 className="menu-title">Tất cả sản phẩm</h2>
          <p className="menu-subtitle">Chọn những món ăn yêu thích của bạn</p>
        </div>

        {/* Loading & Error States */}
        {loading && (
          <div className="loading-state">
            <p>Đang tải sản phẩm...</p>
          </div>
        )}
        {error && (
          <div className="error-state">
            <p>❌ Lỗi tải dữ liệu: {error}</p>
          </div>
        )}

        {/* Products Grid */}
        <div className="product-grid">
          {!loading && products.length === 0 && (
            <div className="no-products">
              <p>Không có sản phẩm.</p>
            </div>
          )}

          {products.map((product) => (
            <Link key={product.id} to={`/product/${product.slug}`} className="product-card">
              <div className="product-image">
                <img src={`/images/${product.image}`} alt={product.name} />
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-footer">
                  <span className="product-price">{product.price.toLocaleString()}₫</span>
                  <button className="btn-add-to-cart">Thêm vào giỏ</button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </MenuLayout>
  )
}
