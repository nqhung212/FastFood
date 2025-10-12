// src/layouts/home-layout.jsx
import '../assets/styles/home-layout.css'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/cart-context'

export default function MainLayout({ children }) {
  const { cartItems, toggleCart } = useCart()
  return (
    <>
      <header className="header-banner">
        {/* Header Banner - logo, search, login, cart */}
        <div className="header-container">
          <div className="header-left">
            {/* Logo container */}
            <div className="header-logo" id="header-logo">
              <a href="/" aria-label="Homepage">
                <img src="/images/Mercedes-Logo.svg.png" alt="Logo" />
              </a>
            </div>
          </div>

          <div className="header-center">
            {/* Search container */}
            <div className="header-search" id="header-search">
              <input
                type="search"
                placeholder="Tìm kiếm sản phẩm, danh mục..."
                aria-label="Search"
              />
              <button type="button" className="search-button">
                Tìm
              </button>
            </div>
          </div>

          <div className="header-right">
            {/* Login */}
            <div className="header-login" id="header-login">
              <button type="button">Đăng nhập</button>
            </div>
            {/* Cart */}
            <div className="header-cart">
              <Link to="/cart">
                <button type="button">Giỏ hàng ({cartItems.length})</button>
              </Link>
            </div>
            Menu
            <div className="header-menu" id="header-menu">
              <Link to="/menu">
                <button type="button">Danh sách sản phẩm (0)</button>
              </Link>
            </div>
          </div>
        </div>

        {/* Category row - can be a horizontal nav or dropdowns */}
        <div className="header-separator">
          <nav className="header-categories" id="header-categories" aria-label="Danh mục">
            <ul>
              <li>
                <a href="#">About</a>
              </li>
              <li>
                <a href="#">Menu</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
              <li>
                <a href="#">Career</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="body-home">{children}</main>
      <footer className="footer-banner">
        {/* Footer Banner */}
        đây là footer-banner
        <div className="footer-banner-main">
          {}
          đây là footer-banner-main
        </div>
        <div className="footer-banner-copyright">
          {}
          đây là footer-banner-copyright
        </div>
      </footer>
    </>
  )
}
