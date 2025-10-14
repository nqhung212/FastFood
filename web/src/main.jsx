// src/main.jsx
import './assets/styles/main.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CartPage from './pages/cart.jsx'
import Menu from './pages/menu.jsx'
import ProductDetail from './pages/product-detail.jsx'
import Web from './pages/home.jsx'
import { CartProvider } from './context/cart-context.jsx'
import MenuCategories from './pages/menu-categories.jsx'
import Login from './pages/login.jsx'
import { AuthProvider } from './context/auth-context.jsx'
import Register from './pages/register.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Web />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/menu/:category" element={<MenuCategories />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  </StrictMode>
)
