// import { DataProducts } from "../data/products-data.js";
// import { Link } from "react-router-dom";

// export default function Product() {
//   return (
//     <div className="product-page">
//       <div className="product-list">
//         {DataProducts.map((p) => (
//           <div key={p.id} className="product-card">
//             <img src={p.image} alt={p.name} width={100} />
//             <h3>{p.name}</h3>
//             <p>{p.description}</p>
//             <p>Giá: {p.price.toLocaleString()}đ</p>
//             <Link to={`/product/${p.id}`}>Xem chi tiết</Link>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
