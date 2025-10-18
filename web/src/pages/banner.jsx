// src/pages/banner.jsx
import '../assets/styles/banner.css'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const slides = [
  {
    id: 1,
    title: 'NO CẢNG BỤNG VUI BẬT MOOD',
    subtitle: 'Combo 79K',
    image: '🍗',
    color: '#E74C3C',
    link: '/menu',
  },
  {
    id: 2,
    title: 'GÀ RÁN GIÒN CĄCY',
    subtitle: 'Đặt ngay hôm nay',
    image: '🍟',
    color: '#D97634',
    link: '/menu/Chicken',
  },
  {
    id: 3,
    title: 'BURGER BÒ PHÔMÔ MAI',
    subtitle: 'Thưởng thức hương vị mới',
    image: '🍔',
    color: '#C41E3A',
    link: '/menu/Burger',
  },
  {
    id: 4,
    title: 'NƯỚC NGỌT GIẢI KHÁT',
    subtitle: 'Mát lạnh tươi mới',
    image: '🥤',
    color: '#E8A023',
    link: '/menu',
  },
  {
    id: 5,
    title: 'HỌC DẶT MỤC',
    subtitle: 'Combo tiết kiệm',
    image: '🍝',
    color: '#8B4513',
    link: '/menu',
  },
  {
    id: 6,
    title: 'MỌI CÁCH XỦ ĐỦ TỐT',
    subtitle: 'Chất lượng tốt nhất',
    image: '⭐',
    color: '#F39C12',
    link: '/menu',
  },
  {
    id: 7,
    title: 'KHUYẾN MẠI ĐẶC BIỆT',
    subtitle: 'Không bỏ lỡ',
    image: '🎉',
    color: '#E91E63',
    link: '/menu',
  },
]

export default function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)
  const navigate = useNavigate()

  // Auto-play slides
  useEffect(() => {
    if (!autoPlay) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [autoPlay])

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setAutoPlay(false)
  }

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setAutoPlay(false)
  }

  const handleSlideClick = () => {
    navigate(slides[currentSlide].link)
  }

  const handleDotClick = (index) => {
    setCurrentSlide(index)
    setAutoPlay(false)
  }

  return (
    <section className="banner-section">
      <div className="banner-carousel">
        {/* Slides */}
        <div className="banner-slides-container">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`banner-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundColor: slide.color }}
              onClick={handleSlideClick}
              role="button"
              tabIndex={0}
            >
              <div className="banner-slide-content">
                <div className="banner-slide-image">{slide.image}</div>
                <div className="banner-slide-text">
                  <h2 className="banner-slide-title">{slide.title}</h2>
                  <p className="banner-slide-subtitle">{slide.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          className="banner-arrow banner-arrow-prev"
          onClick={handlePrev}
          aria-label="Previous slide"
        >
          ❮
        </button>
        <button
          className="banner-arrow banner-arrow-next"
          onClick={handleNext}
          aria-label="Next slide"
        >
          ❯
        </button>

        {/* Dots */}
        <div className="banner-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`banner-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
