// src/pages/services.jsx
import '../assets/styles/services.css'

const services = [
  {
    id: 1,
    name: 'PICK UP',
    icon: '🚗',
    description: 'Quick pickup service',
  },
  {
    id: 2,
    name: 'FASTFOOD PARTY',
    icon: '🎉',
    description: 'Birthday party packages',
  },
  {
    id: 3,
    name: 'FASTFOOD CLUB',
    icon: '🎨',
    description: 'Membership benefits',
  },
  {
    id: 4,
    name: 'BIG SERVICE ORDER',
    icon: '📦',
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
            <div className="service-icon">{service.icon}</div>
            <h3 className="service-name">{service.name}</h3>
            <button className="service-btn">VIEW MORE</button>
          </div>
        ))}
      </div>
    </section>
  )
}
