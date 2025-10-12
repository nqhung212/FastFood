// src/pages/menu-categories.jsx
import { useParams, Link } from 'react-router-dom'
import MenuLayout from '../layouts/menu-layout.jsx'
import { useProductsByCategory } from '../hooks/use-categories.js'

export default function MenuCategories() {
  const { category } = useParams()
  const { products = [], loading, error } = useProductsByCategory(category)

  return (
    <MenuLayout>
      <div className="menu-page">
        <h2 className="menu-title">Danh mục: {category}</h2>

        {loading && <p>Đang tải sản phẩm...</p>}
        {error && <p style={{ color: 'red' }}>Lỗi tải dữ liệu: {error}</p>}

        <div className="product-list">
          {!loading && products.length === 0 && <p>Không có sản phẩm trong danh mục này.</p>}

          {products.map((p) => (
            <Link key={p.id} to={`/product/${p.slug}`} className="product-card">
              <img src={`/images/${p.image}`} width={150} alt={p.name} />
              <div className="product-info">
                <h3>{p.name}</h3>
                <p>{p.description}</p>
                <p>
                  <strong>{p.price.toLocaleString()}₫</strong>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </MenuLayout>
  )
}
