import Header from './header.jsx'
import Footer from './footer'
import '../assets/styles/home-layout.css'

export default function MainLayout({ children }) {
  return (
    <>
      <Header />
      <main className="body-home">{children}</main>
      <Footer />
    </>
  )
}
