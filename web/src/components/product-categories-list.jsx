import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { productsData } from "../data/products-data.js";

export default function ProductCategoriesList({ category: propCategory }) {
  const { category: paramCategory } = useParams();
  const category = propCategory || paramCategory;

  const products = useMemo(() => {
    return productsData.filter(
      (p) => p.categories.toLowerCase() === category?.toLowerCase()
    );
  }, [category]);

  return (
    <div className="categories-container">
      <h2 className="categories-title">{category}</h2>
      <div className="categories-grid">
        {products.map((p) => (
          <Link
            key={p.id}
            to={`/product/${p.slug}`}
            className="product-card"
          >
            <img src={p.image} alt={p.name} className="product-image" width={150} /> {/* css tạm */}
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
  );
}
