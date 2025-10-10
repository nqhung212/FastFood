//src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./assets/styles/main.css";
import Menu from "./pages/menu.jsx";
import ProductDetail from "./pages/product-detail.jsx";
import Web from './Home.jsx'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Web />} />        
        <Route path="/menu" element={<Menu />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
