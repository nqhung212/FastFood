import { useEffect, useState } from 'react'
import MercedesLogo from './assets/images/Github-Mark-ea2971cee799.png'
import VietNam_flagLogo from './assets/images/Flag_of_Vietnam.svg.png'
import { productApi } from "./api/product.js";
import './assets/styles/Home.css'

function App() {
  const [count, setCount] = useState(0)
  const [products, setProducts] = useState([]);

   useEffect(() => {
    productApi.getAll().then(setProducts).catch(console.error);
  }, []); //gọi api 1 lần khi component mount


  return (
    <>
      { /* <div>
        <a href="https://www.vietnam.vn" target="_blank">
          <img src={VietNam_flagLogo} className="logo" alt="Vietnam_flag logo" />
        </a>
        <a href="https://guthib.com" target="_blank">
          <img src={MercedesLogo} className="logo react" alt="Github logo" />
        </a>
      </div>
      <h1>Vite and React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
           {count}  
        </button>
        <p>
          Test vui vẻ thôi
        </p>
      </div> */ }
     
    <>
      <div className="menu-page">
      <h1>Menu</h1>
      <div className="product-list">
        {products.map((p) => (
          <div key={p.id} className="product-item">
            <img src={p.image} alt={p.title} width={100} />
            <h3>{p.title}</h3>
            <p>{p.price}$</p>
            <button onClick={() => window.location.href = `/product/${p.id}`}>
              View Detail
            </button>
          </div>
        ))}
      </div>
    </div>
        <div className="header-top-bar">
          {
            <div>
        <a href="https://www.vietnam.vn" target="_blank">
          <img src={VietNam_flagLogo} className="logo" alt="Vietnam_flag logo" />
        </a>
        <a href="https://guthib.com" target="_blank">
          <img src={MercedesLogo} className="logo react" alt="Github logo" />
        </a>
      </div>
      }
          đây là header-top-bar
          <div className="header-top-bar-media">
            {}
            đây là header-top-bar-media
            <div className="header-top-bar-media-item">
              {}
              đây là header-top-bar-media-item
            </div>
        </div>
        </div>
        <header className="header-banner"> 
          {/* Header Banner - logo, search, login, cart, category */}
          <div className="header-container">
            <div className="header-left">
              {/* Logo container */}
              <div className="header-logo" id="header-logo">
                <a href="/" aria-label="Homepage">
                  <img src={MercedesLogo} alt="Logo" />
                </a>
              </div>
            </div>

            <div className="header-center">
              {/* Search container */}
              <div className="header-search" id="header-search">
                <input type="search" placeholder="Tìm kiếm sản phẩm, danh mục..." aria-label="Search" />
                <button type="button" className="search-button">Tìm</button>
              </div>
            </div>

            <div className="header-right">
              {/* Login */}
              <div className="header-login" id="header-login">
                <button type="button">Đăng nhập</button>
              </div>

              {/* Cart */}
              <div className="header-cart" id="header-cart">
                <button type="button">Giỏ hàng (0)</button>
              </div>
            </div>
          </div>

          {/* Category row - can be a horizontal nav or dropdowns */}
          <nav className="header-categories" id="header-categories" aria-label="Danh mục">
            <ul>
              <li><a href="#">Tất cả</a></li>
              <li><a href="#">Điện thoại</a></li>
              <li><a href="#">Máy tính</a></li>
              <li><a href="#">Phụ kiện</a></li>
              <li><a href="#">Khuyến mãi</a></li>
            </ul>
          </nav>
        </header> 
        <div className="body-home"> 
          {/* Body Home */}
          đây là body-home
          <div className="body-home-top">
            {}
            đây là body-home-top
            </div>
            <div className="body-home-main">
              {}
              đây là body-home-main
              </div>
            <div className="body-home-trend">
              {}
              đây là body-home-trend
            </div>
        </div> 
        <footer className="footer-banner"> 
          {/* Footer Banner */}
          đây là footer-banner
            <div className="footer-banner-main">
              {}
              đây là footer-banner-main
              </div>
            <div className="footer-banner-copyright">
              {}
              đây là footer-banner-copyright
            </div>  
        </footer>  
      </>
    </> 
  )
}

export default App
