// src/layouts/menu-layout.jsx
import MainLayout from './home-layout.jsx'
import { useLocation, useNavigate } from 'react-router-dom'
import { useCategories } from '../hooks/use-categories'
import '../assets/styles/menu-categories.css'

export default function MenuLayout({ children }) {
  const { categories = [] } = useCategories()
  const location = useLocation()
  const navigate = useNavigate()

  // Extract category from URL path
  const pathParts = location.pathname.split('/')
  const activeCategory = pathParts[2] || null // /menu/burger -> "burger"

  const handleCategoryClick = (slug) => {
    if (slug === activeCategory) {
      navigate('/menu')
    } else {
      navigate(`/menu/${slug}`)
    }
  }

  return (
    <MainLayout>
      <div className="menu-layout">
        {/* Category Filter Bar */}
        <div className="category-filter-container">
          <div className="category-filter">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`category-btn ${activeCategory === cat.slug ? 'active' : ''}`}
                onClick={() => handleCategoryClick(cat.slug)}
              >
                <img src={cat.icon} alt={cat.name} />
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="menu-content">{children}</div>
      </div>
    </MainLayout>
  )
}
