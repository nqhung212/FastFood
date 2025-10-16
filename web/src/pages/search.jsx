// src/pages/search.jsx
import { Link, useParams } from 'react-router-dom'
import MenuLayout from '../layouts/menu-layout.jsx'
import { useProducts } from '../hooks/use-products.js'

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
        <h2 className="menu-title">Kết quả tìm kiếm: "{searchTerm}"</h2>
        <p>Tìm thấy {filteredProducts.length} sản phẩm</p>

        {loading && <p>Đang tải sản phẩm...</p>}
        {error && <p style={{ color: 'red' }}>Lỗi tải dữ liệu: {error}</p>}

        <div className="product-list">
          {!loading && filteredProducts.length === 0 && (
            <p>Không tìm thấy sản phẩm nào phù hợp với "{searchTerm}"</p>
          )}

          {filteredProducts.map((p) => (
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
