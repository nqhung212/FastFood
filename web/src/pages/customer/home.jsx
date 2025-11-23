// src/pages/customer/home.jsx
import '../../assets/styles/home.css'
import { Link } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import MainLayout from '../../layouts/home-layout.jsx'
import getImage from '../../utils/import-image.js'
import Banner from './banner.jsx'
import Services from './services.jsx'
import Order from './lineup.jsx'
import FindStore from './findstore.jsx'
import News from './news.jsx'
import { useCategories } from '../../hooks/use-categories'

function Web() {
  const { categories, loading } = useCategories()

  return (
    <MainLayout>
      {/* Body Home */}
      <div className="body-home-top">
        <Banner />
      </div>
      <div className="body-home-main">
        <div className="home-header">
          <h2 className="home-heading">There's something for everyone!</h2>
        </div>
        <section className="home-categories">
          {loading ? (
            <p>Loading categories...</p>
          ) : (
            categories.map((cat) => (
              <Link to={`/category/${cat.name}`} key={cat.category_id} className="category-card">
                {cat.icon_url && (
                  <img src={cat.icon_url} alt={cat.name} className="category-image" />
                )}
                <h3 className="category-title">{cat.name}</h3>
              </Link>
            ))
          )}
        </section>
      </div>
      <div className="body-home-services">
        <Services />
      </div>
      <div className="body-home-order">
        <Order />
      </div>
      <div className="body-home-findstore">
        <FindStore />
      </div>
      <div className="body-home-news">
        <News />
      </div>
    </MainLayout>
  )
}

export default Web
