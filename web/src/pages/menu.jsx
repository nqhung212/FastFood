// src/pages/menu.jsx
import { Link } from "react-router-dom";
import MainLayout from "../layouts/home-layout.jsx";
import "../assets/styles/home-layout.css";
import { useProducts } from "../hooks/use-products.js";

export default function Menu() {
  const { products = [], loading, error } = useProducts();

  return (
    <MainLayout>
      <div className="menu-page">
        <h2 className="menu-title">Danh sách sản phẩm</h2>

        {loading && <p>Đang tải sản phẩm...</p>}
        {error && <p style={{ color: "red" }}>Lỗi tải dữ liệu: {error}</p>}

        <div className="product-list">
          {(!loading && products.length === 0) && <p>Không có sản phẩm.</p>}

          {products.map((p) => (
            <Link
              key={p.id}
              to={`/product/${p.slug}`}
              className="product-card"
              style={{ cursor: "pointer", textDecoration: "none", color: "inherit" }} 
            >
              <img src={`/images/${p.image}`} width={150} alt={p.name} />
              <div className="product-info">
                <h3 className="product-name">{p.name}</h3>
                <p className="product-description">{p.description}</p>
                <p className="product-price">
                  <strong>{p.price.toLocaleString()}₫</strong>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
