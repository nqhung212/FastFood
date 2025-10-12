// src/layouts/menu-layout.jsx
import MainLayout from './home-layout.jsx'
import { Link } from 'react-router-dom'

export default function MenuLayout({ children }) {
  return (
    <MainLayout>
      <div className="menu-layout">
        <div className="menu-banner">
          sad sad
          <h1>Menu Banner</h1>
          <nav>
            <ul>
              <li>
                <Link to="/menu/Burger">Burger</Link>
              </li>
              <li>
                <Link to="/menu/Chicken">Chicken</Link>
              </li>
              <li>
                <Link to="/menu/Fries">Fries</Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="menu-content">{children}</div>
      </div>
    </MainLayout>
  )
}
