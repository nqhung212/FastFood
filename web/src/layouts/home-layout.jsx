// src/layouts/home-layout.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom';
import '../assets/styles/home-layout.css'
import { useCart } from "../context/cart-context";
import CartPage from '../pages/cart.jsx';
export default function MainLayout({ children }) {
     const { cartItems, toggleCart } = useCart();
return (
    <>
        <div className="page-header">
            <div className="panel-warpper"></div>

            <div className="header-content">
                <div className="column colomn-left">
                    <div className="toggle-header"></div>

                    <div className="logo-header">
                        <a href="https://www.vietnam.vn" target="_blank" rel="noreferrer">
                            <img src="/images/Flag_of_Vietnam.svg.png" alt="Vietnam flag logo" className="logo-fastfood" />
                        </a>
                    </div>
                </div>

                <div className="column column-mid"></div>

                <div className="column column-right"></div>
            </div>
        </div>
        <header className="header-banner">
            {/* Header Banner - logo, search, login, cart */}
            <div className="header-container">
                <div className="header-left">
                    {/* Logo container */}
                    <div className="header-logo" id="header-logo">
                        <a href="/" aria-label="Homepage">
                            <img src="/images/Mercedes-Logo.svg.png" width={150} alt="Logo" />
                        </a>
                    </div>
                </div>

                <div className="header-center">
                    {/* Search container */}
                    <div className="header-search" id="header-search">
                        <input type="search" placeholder="Tìm kiếm sản phẩm, danh mục..." aria-label="Search" />
                        <button type="button" className="search-button">Tìm</button>
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
            <nav className="header-categories" id="header-categories" aria-label="Danh mục">
                <ul>
                    <li><a href="#">Tất cả</a></li>
                    <li><a href="#">Điện thoại</a></li>
                    <li><a href="#">Máy tính</a></li>
                    <li><a href="#">Phụ kiện</a></li>
                    <li><a href="#">Khuyến mãi</a></li>
                </ul>
            </nav>
        </header>
        <main className="body-home">
            {children}
        </main>
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

