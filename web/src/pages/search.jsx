// src/pages/search.jsx
import { Link, useParams } from 'react-router-dom'
import MenuLayout from '../layouts/menu-layout.jsx'
import { useProducts } from '../hooks/use-products.js'
import '../assets/styles/menu-categories.css'

export default function Search() {
  const { searchTerm } = useParams()
  const { products = [], loading, error } = useProducts()

  const filteredProducts = products.filter((product) => {
    if (!searchTerm) return false
    const search = searchTerm.toLowerCase()
    return (
      (product.name && product.name.toLowerCase().includes(search)) ||
      (product.category && product.category.toLowerCase().includes(search)) ||
      (product.description && product.description.toLowerCase().includes(search))
    )
  })

  return (
    <MenuLayout>
      <div className="menu-page">
        <div className="menu-header">
          <h2 className="menu-title">Kết quả tìm kiếm: "{searchTerm}"</h2>
          <p className="menu-subtitle">Tìm thấy {filteredProducts.length} sản phẩm</p>
        </div>

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

        <div className="product-grid">
          {!loading && filteredProducts.length === 0 && (
            <div className="no-products">
              <p>Không tìm thấy sản phẩm nào phù hợp với "{searchTerm}"</p>
            </div>
          )}

          {filteredProducts.map((p) => (
            <Link key={p.id} to={`/product/${p.slug}`} className="product-card">
              <div className="product-image">
                <img src={`/images/${p.image}`} alt={p.name} />
              </div>
              <div className="product-info">
                <h3 className="product-name">{p.name}</h3>
                <p className="product-description">{p.description}</p>
                <div className="product-footer">
                  <span className="product-price">{p.price.toLocaleString()}₫</span>
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
