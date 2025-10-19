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
          <h2 className="menu-title">All Products</h2>
          <p className="menu-subtitle">Choose your favorite dishes</p>
        </div>

        {/* Loading & Error States */}
        {loading && (
          <div className="loading-state">
            <p>Loading products...</p>
          </div>
        )}
        {error && (
          <div className="error-state">
            <p>❌ Data load error: {error}</p>
          </div>
        )}

        {/* Products Grid */}
        <div className="product-grid">
          {!loading && products.length === 0 && (
            <div className="no-products">
              <p>No products.</p>
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
                  <button className="btn-add-to-cart">Add to cart</button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </MenuLayout>
  )
}
