// src/pages/news.jsx
import '../assets/styles/news.css'

const newsItems = [
  {
    id: 1,
    title: 'FASTFOOD REACHES 200 STORES IN VIETNAM',
    excerpt: 'The opening of the 200th store marks a major milestone in our expansion plan...',
    image: '/images/store.jpg',
  },
  {
    id: 2,
    title: 'SUSTAINABLE PARTNERSHIPS DRIVE FASTFOOD GROWTH IN VIETNAM',
    excerpt:
      'Shared goals and close collaboration with partners help FastFood Vietnam continue to grow...',
    image: '/images/cooperation.jpg',
  },
  {
    id: 3,
    title: 'FASTFOOD VIETNAM OPENS 191ST STORE',
    excerpt: 'On 17/05/2024, we opened a new store in the busy Me Linh street area...',
    image: '/images/newstore.jpg',
  },
]

export default function News() {
  return (
    <section className="news-section">
      <h2 className="news-title">NEWS</h2>

      <div className="news-grid">
        {newsItems.map((item, idx) => {
          const cardClass = idx % 2 === 0 ? 'news-card-left' : 'news-card-right'
          return (
            <article key={item.id} className={`news-card ${cardClass}`}>
              <div className="news-image">
                <img src={item.image} alt={`news-${item.id}`} className="news-image-img" />
                <div className="news-overlay">
                  <h3 className="news-heading">{item.title}</h3>
                  <p className="news-excerpt">{item.excerpt}</p>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      <div className="news-footer">
        <button className="news-btn">VIEW MORE</button>
      </div>
    </section>
  )
}
