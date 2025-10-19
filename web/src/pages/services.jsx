// src/pages/services.jsx
import '../assets/styles/services.css'

const services = [
  {
    id: 1,
    name: 'PICK UP',
    icon: '/images/delivery.jpg',
    description: 'Quick pickup service',
  },
  {
    id: 2,
    name: 'PARTY CUSTUMIZE',
    icon: '/images/party.jpg',
    description: 'Birthday party packages',
  },
  {
    id: 3,
    name: 'FASTFOOD DISCOUNT',
    icon: '/images/pizza-ad.jpg',
    description: 'Membership benefits',
  },
  {
    id: 4,
    name: 'LOGISTIC SERVICE ORDER',
    icon: '/images/logistic.jpg',
    description: 'Catering & bulk orders',
  },
]

export default function Services() {
  return (
    <section className="services-section">
      <div className="services-header">
        <h2 className="services-title">SERVICES</h2>
        <p className="services-subtitle">ENJOY PERFECT MOMENT WITH FASTFOOD</p>
      </div>

      <div className="services-grid">
        {services.map((service) => (
          <div key={service.id} className="service-card">
            <div className="service-icon">
              <img src={service.icon} alt={service.name} className="service-icon-img" />
            </div>
            <h3 className="service-name">{service.name}</h3>
            <button className="service-btn">VIEW MORE</button>
          </div>
        ))}
      </div>
    </section>
  )
}
