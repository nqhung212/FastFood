// src/layouts/footer.jsx
import React, { useEffect, useRef, useState } from 'react'
import TestSupabase from './../components/testsupabase.jsx'


export default function Footer() {
  const phoneTopRef = useRef(null)
  const [badgeWidth, setBadgeWidth] = useState(null)

  useEffect(() => {
    if (phoneTopRef.current) {
      setBadgeWidth(phoneTopRef.current.clientWidth)
    }
  }, [])

  return (
    <footer className="footer-banner">
      <div className="footer-container">
        {/* Left Section - Logo & Info */}
        <div className="footer-section footer-left">
          <div className="footer-logo">
            <img src="/images/logo.png" alt="FastFood Logo" />
          </div>
          <div className="footer-info">
            <p>
              <strong>Address:</strong> 26th Floor, CII Tower, 152 Dien Bien Phu Street, Thanh My
              Tay Ward, Ho Chi Minh City, Vietnam
            </p>
            <p>
              <strong>Phone:</strong> (028) 39309168
            </p>
            <p>
              <strong>Hot-line feedback:</strong> 1900-1533
            </p>
            <p>
              <strong>Tax code:</strong> 0303883266
            </p>
            <p>
              <strong>Date Range:</strong> 15/07/2008 - Place of issue: Ho Chi Minh Tax Department
            </p>
          </div>
        </div>

        {/* Center Section - Phone & Links */}
        <div className="footer-section footer-center">
          <div className="footer-phone">
            <div className="phone-top" ref={phoneTopRef}>
              <div className="phone-icon">📞</div>
              <h3>1900-1533</h3>
            </div>
            <p
              className="delivery-badge"
              style={badgeWidth ? { width: badgeWidth + 'px' } : undefined}
            >
              GIAO HÀNG TẬN NƠI
            </p>
          </div>

          <div className="footer-links">
            <h4>Contact</h4>
            <ul>
              <li>
                <a href="#">Policies and regulations</a>
              </li>
              <li>
                <a href="#">Payment policy when ordering</a>
              </li>
              <li>
                <a href="#">Operation policy</a>
              </li>
              <li>
                <a href="#">Information security policy</a>
              </li>
              <li>
                <a href="#">Cookie Policy</a>
              </li>
              <li>
                <a href="#">Shipping and forwarding information</a>
              </li>
              <li>
                <a href="#">General transaction registration information</a>
              </li>
              <li>
                <a href="#">Instructions for ordering meals</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Section - Social & App */}
        <div className="footer-section footer-right">
          <div className="footer-social">
            <h4>CONNECT WITH US</h4>
            <div className="social-links">
              <a href="#" className="social-item facebook">
                <span>f</span>
                <span>Facebook</span>
              </a>
            </div>
          </div>

          <div className="footer-certification">
            <img src="/images/certification.png" alt="Certification" className="cert-badge" />
          </div>

          <div className="footer-download">
            <h4>DOWNLOAD THE APP FOR MORE OFFERS</h4>
            <div className="app-links">
              <a href="#" className="app-btn google-play">
                <img src="/images/google-play.png" alt="Google Play" />
              </a>
              <a href="#" className="app-btn app-store">
                <img src="/images/app-store.png" alt="App Store" />
              </a>
            </div>
          </div>

          <div className="footer-cookie">
            <a href="#">COOKIE SETTINGS</a>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="footer-copyright">
        <p>© 2020 FastFood Viet Nam</p>
        <TestSupabase />
        
      </div>
    </footer>
  )
}
