// src/pages/home.jsx
import '../assets/styles/home-layout.css'
import { Link } from 'react-router-dom'
import React from 'react'
import MainLayout from '../layouts/home-layout.jsx'

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
        {}
        {/* <Product /> */}
      </div>
      <div className="body-home-main">
        {}
        <section className="home-categories">
          {categories.map((cat) => (
            <Link to={`/menu/${cat.name}`} key={cat.name} className="category-card">
              <img src={cat.image} alt={cat.name} className="category-image" />
              <h3 className="category-title">{cat.name}</h3>
            </Link>
          ))}
        </section>
      </div>
      <div className="body-home-trend">
        {/* Trend */}
        đây là body-home-trend
      </div>
    </MainLayout>
  )
}

export default Web
