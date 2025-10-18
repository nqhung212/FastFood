// src/pages/home.jsx
import '../assets/styles/home.css'
import { Link } from 'react-router-dom'
import React from 'react'
import MainLayout from '../layouts/home-layout.jsx'
import getImage from '../utils/import-image.js'
import Banner from './banner.jsx'
import Services from './services.jsx'
import Order from './order.jsx'
import FindStore from './findstore.jsx'
import News from './news.jsx'

const categories = [
  { name: 'Burger', image: '/images/burger.jpg' },
  { name: 'Chicken', image: '/images/pizza.jpg' },
  { name: 'Fries', image: '/images/cola.jpg' },
]
function Web() {
  return (
    <MainLayout>
      {/* Body Home */}
      <div className="body-home-top">
        <Banner />
      </div>
      <div className="body-home-main">
        {}
        <section className="home-categories">
          {categories.map((cat) => (
            <Link to={`/menu/${cat.name}`} key={cat.name} className="category-card">
              <img src={getImage(cat.image)} alt={cat.name} className="category-image" />
              <h3 className="category-title">{cat.name}</h3>
            </Link>
          ))}
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
