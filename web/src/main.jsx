// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./assets/styles/main.css";
import CartPage from "./pages/cart.jsx";
import Menu from "./pages/menu.jsx";
import ProductDetail from "./pages/product-detail.jsx";
import Web from "./pages/home.jsx";
import { CartProvider } from "./context/cart-context.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Web />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
           <Route path="/cart" element={<CartPage />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  </StrictMode>
);
