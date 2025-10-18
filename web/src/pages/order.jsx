// src/pages/order.jsx
import '../assets/styles/order.css'

export default function Order() {
  return (
    <section className="order-section">
      <div className="order-container">
        <div className="order-content">
          <h2 className="order-title">DELICIOUS EVERYDAY</h2>
          <p className="order-description">
            There are more than 200 stores across the country, motto of FastFood is to bring
            joy to every Vietnamese family with the commitment of providing customers with delicious
            meals at affordable prices, consistent with each region's taste, and considerate
            services in open and clean spaces.
          </p>
          <button className="order-btn">ORDER</button>
        </div>

        <div className="order-image">
          <div className="order-image-placeholder">
            <span>🍗 Food Images 🍝</span>
          </div>
        </div>
      </div>
    </section>
  )
}
