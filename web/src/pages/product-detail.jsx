// src/pages/product-detail.jsx
import { useParams } from "react-router-dom";
import { productsData } from "../data/products-data.js";

export default function ProductDetail() {
  const { slug } = useParams();
  const id = Number(slug.split("-").pop());
  const product = productsData.find((p) => p.id === id);

  if (!product) return <p>Không tìm thấy sản phẩm</p>;

  return (
    <div className="product-detail">
      <h2>{product.name}</h2>
      <img src={product.image} alt={product.name} width={150} /> {/* css tạm */}
      <p>{product.description}</p>
      <p>Giá: {product.price.toLocaleString()}₫</p>
      <button>Thêm vào giỏ hàng</button>
    </div>
  );
}
