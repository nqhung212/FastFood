// src/pages/banner.jsx
import '../assets/styles/banner.css'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const slides = [
  {
    id: 1,
    image: '/images/burgur-ad.jpg',
    color: '#E74C3C',
    link: '/menu',
  },
  {
    id: 2,
    image: '/images/chicken-ad3.jpg',
    color: '#D97634',
    link: '/menu/Chicken',
  },
  {
    id: 3,
    image: '/images/burgur-ad1.jpg',
    color: '#C41E3A',
    link: '/menu/Burger',
  },
  {
    id: 4,
    image: '/images/pizza-ad.jpg',
    color: '#E8A023',
    link: '/menu/Fries',
  },
  {
    id: 6,
    image: '/images/pasta-ad1.jpg',
    color: '#F39C12',
    link: '/menu',
  },
  {
    id: 7,
    image: '/images/fastfood-ad.jpg',
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
              style={{ backgroundImage: `url(${slide.image})`, backgroundColor: slide.color }}
              onClick={handleSlideClick}
              role="button"
              tabIndex={0}
            >
              <div className="banner-slide-content">
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

        {/* Navigation overlay zones: semi-transparent full-height zones at edges that are clickable */}
        <div
          className="banner-nav-zone banner-nav-left"
          onClick={handlePrev}
          role="button"
          tabIndex={0}
          aria-label="Previous slide"
        />
        <div
          className="banner-nav-zone banner-nav-right"
          onClick={handleNext}
          role="button"
          tabIndex={0}
          aria-label="Next slide"
        />

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
