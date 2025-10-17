// src/layouts/menu-layout.jsx
import MainLayout from './home-layout.jsx'

export default function MenuLayout({ children }) {
  return (
    <MainLayout>
      <div className="menu-layout">
        <div className="menu-content">{children}</div>
      </div>
    </MainLayout>
  )
}
