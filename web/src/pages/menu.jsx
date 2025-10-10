//src/pages/menu.jsx
import { Link } from "react-router-dom";
import { productsData } from "../data/products-data.js";
export default function Menu() {
  return (
    <div className="menu-page">
      <h2 className="menu-title">Danh sách sản phẩm</h2>

      <div className="product-list">
        {productsData.map((p) => (
          <Link
            key={p.id}
            to={`/product/${p.slug}`} // Link đến ProductDetail
            className="product-card"
          >
            <img src={p.image} alt={p.name} className="product-image" width={150}/> {/* css tạm */}
            <div className="product-info">
              <h3 className="product-name">{p.name}</h3>
              <p className="product-description">{p.description}</p>
              <p className="product-price">
                {p.price.toLocaleString()}₫
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
