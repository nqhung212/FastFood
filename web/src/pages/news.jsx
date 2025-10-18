// src/pages/news.jsx
import '../assets/styles/news.css'

const newsItems = [
  {
    id: 1,
    title: 'FASTFOOD ĐẠT MỐC 200 CỬA HÀNG TẠI THỊ TRƯỜNG VIỆT NAM',
    excerpt:
      'Sự kiện khai trương của hàng thứ 200 là cột mốc quan trọng trong kế hoạch mở rộng kinh...',
    image: '/images/store.jpg',
  },
  {
    id: 2,
    title: 'HỢP TÁC BÊN VỮNG GIÚP FASTFOOD PHÁT TRIỂN TẠI VIỆT NAM SAU HAI THẬP KỶ',
    excerpt:
      'Việc có chung mục tiêu và mối quan hệ hợp tác chặt chẽ với các đối tác giúp FastFood Việt...',
    image: '/images/cooperation.jpg',
  },
  {
    id: 3,
    title: 'FASTFOOD VIỆT NAM KHAI TRƯƠNG CỬA HÀNG THỨ 191',
    excerpt: 'Vào ngày 17/05/2024, tại tuyến phố Mễ Linh sâm uất của phường Liên Bảo, thành...',
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
