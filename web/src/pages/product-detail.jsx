// src/pages/product-detail.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import MainLayout from "../layouts/home-layout.jsx";
import '../assets/styles/home-layout.css'
import { useCart } from "../context/cart-context";

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/products")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((p) => p.slug === slug);
        setProduct(found);
      });
  }, [slug]);

  if (!product) return <MainLayout><p>Đang tải...</p></MainLayout>;

  return (
    <MainLayout>
      <div className="product-detail">
        <h2>{product.name}</h2>
        <img src={`/images/${product.image}`} alt={product.name} width={150} />
        <p>{product.description}</p>
        <p>Giá: {product.price.toLocaleString()}₫</p>
      </div>
    </MainLayout>
  );
}