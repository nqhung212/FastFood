import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./assets/styles/main.css";
import Product from "./pages/Product.jsx";
import ProductDetail from "./components/ProductDetail.jsx";
import Web from './Home.jsx'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Web />} />        
        <Route path="/products" element={<Product />} />
        <Route path="/product/:id" element={<ProductDetail />} /> 
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
