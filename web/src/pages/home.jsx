// src/pages/Home.jsx
import React from "react";
import MainLayout from "../layouts/home-layout.jsx";
import '../assets/styles/home-layout.css'
import ProductCategoriesList from '../components/product-categories-list.jsx';


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
                  <ProductCategoriesList category="Burger" />
                  <ProductCategoriesList category="Chicken" />
                  <ProductCategoriesList category="Fries" /> 
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
