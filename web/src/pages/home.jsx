// src/pages/Home.jsx
import '../assets/styles/home-layout.css'
import { Link } from 'react-router-dom'
import React from 'react'
import MainLayout from '../layouts/home-layout.jsx'



function Web() {
  return (
    <MainLayout>
      {/* Body Home */}
      <div className="body-home-top">
        {}
        {/* <Product /> */}
      </div>
      <div className="body-home-main">
        {}
        <nav className="header-categories" id="header-categories" aria-label="Danh mục">
          <ul>
    <li><Link to="/menu/Burger">Burger</Link></li>
    <li><Link to="/menu/Chicken">Chicken</Link></li>
    <li><Link to="/menu/Fries">Fries</Link></li>
  </ul>
        </nav>
      </div>
      <div className="body-home-trend">
        {/* Trend */}
        đây là body-home-trend
      </div>
    </MainLayout>
  )
}

export default Web
