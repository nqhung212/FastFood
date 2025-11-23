// src/pages/menu-categories.jsx
import { useParams, Link } from 'react-router-dom'
import MenuLayout from '../../layouts/menu-layout.jsx'
import { useProductsByCategory } from '../../hooks/use-categories.js'
import '../../assets/styles/menu-categories.css'

export default function MenuCategories() {
  const { category } = useParams()
  const { products = [], loading, error } = useProductsByCategory(category)

  return (
    <MenuLayout>
      <div className="menu-page">
        {/* Page Title */}
        <div className="menu-header">
          <h2 className="menu-title">{category?.toUpperCase()}</h2>
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
            <p>❌ Load error: {error}</p>
          </div>
        )}

        {/* Products Grid */}
        <div className="product-grid">
          {!loading && products.length === 0 && (
            <div className="no-products">
              <p>No products in this category.</p>
            </div>
          )}

          {products.map((product, index) => {
            const imgSrc =
              product?.image &&
              (product.image.startsWith('http') || product.image.startsWith('https'))
                ? product.image
                : `/images/${product.image}`

            return (
              <Link key={product.id} to={`/product/${product.slug}`} className="product-card">
                <div className="product-image">
                  <img src={imgSrc} alt={product.name} />
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-footer">
                    <span className="product-price">{product.price.toLocaleString()}₫</span>
                    <button className="btn-add-to-cart">ADD TO CART</button>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </MenuLayout>
  )
}
