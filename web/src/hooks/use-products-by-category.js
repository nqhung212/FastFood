// src/hooks/use-products-by-category.js
import { useEffect, useState } from "react";

export function useProductsByCategory(category) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!category) return;

    setLoading(true);
    fetch("http://localhost:3001/products")
      .then((res) => {
        if (!res.ok) throw new Error("Lỗi tải dữ liệu sản phẩm theo danh mục");
        return res.json();
      })
      .then((data) => {
        const filtered = data.filter(
          (p) => p.categories?.toLowerCase() === category.toLowerCase()
        );
        setProducts(filtered);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [category]);

  return { products, loading, error };
}
