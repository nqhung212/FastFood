// src/components/product-categories-list.jsx
import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { productsData } from "../data/products-data.js";

export default function Categories({ category: propCategory }) {
  const navigate = useNavigate();
  const { category: paramCategory } = useParams();
  const category = propCategory || paramCategory;

  const products = useMemo(
    () => productsData.filter(
      (p) => p.categories.toLowerCase() === category?.toLowerCase()
    ),
    [category]
  );

  return (
    <div className="categories-container">
      <h2 className="categories-title">{category}</h2>
      <div className="categories-grid">
        {products.map((p) => (
          <div
            key={p.id}
            className="product-card"
            onClick={() => navigate(`/product/${p.id}`)}
          >
            <img src={p.image} alt={p.name} className="product-image" />
            <div className="product-info">
              <h3 className="product-name">{p.name}</h3>
              <p className="product-description">{p.description}</p>
              <p className="product-price">
                <strong>{p.price.toLocaleString()}₫</strong>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
