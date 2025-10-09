import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { productApi } from "../api/product.js";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    productApi.getById(id).then(setProduct).catch(console.error);
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="product-detail">
      <img src={product.image} alt={product.title} width={200} />
      <h2>{product.title}</h2>
      <p>{product.description}</p>
      <h3>{product.price}$</h3>
      <button>Add to Cart</button>
    </div>
  );
}
