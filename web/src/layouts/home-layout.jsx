import Header from './header.jsx'
import Footer from './footer'
import '../assets/styles/header.css'
import '../assets/styles/footer.css'
import '../assets/styles/menu-layout.css'

export default function MainLayout({ children }) {
  return (
    <>
      <Header />
      <main className="body-home">{children}</main>
      <Footer />
    </>
  )
}
