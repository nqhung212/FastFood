// src/pages/findstore.jsx
import '../../assets/styles/findstore.css'
import { useState } from 'react'

export default function FindStore() {
  const [province, setProvince] = useState('')
  const [district, setDistrict] = useState('')

  const provinces = [
    'Hanoi',
    'Ho Chi Minh City',
    'Da Nang',
    'Hai Phong',
    'Can Tho',
    'Binh Duong',
    'Dong Nai',
    'Khanh Hoa',
  ]

  const districts = {
    Hanoi: ['Hoan Kiem', 'Ba Dinh', 'Dong Da', 'Hai Ba Trung', 'Cau Giay'],
    'Ho Chi Minh City': ['District 1', 'District 2', 'District 3', 'District 4', 'District 5'],
    'Da Nang': ['Hai Chau', 'Thanh Khe', 'Son Tra', 'Ngu Hanh Son'],
  }

  const handleSearch = () => {
    alert(`Search stores in ${province}, ${district}`)
  }

  return (
    <section className="findstore-section">
      <div className="findstore-container">
        <h2 className="findstore-title">FIND STORES</h2>

        <div className="findstore-form">
          <select
            className="findstore-select"
            value={province}
            onChange={(e) => {
              setProvince(e.target.value)
              setDistrict('')
            }}
          >
            <option value="">Choose province</option>
            {provinces.map((prov) => (
              <option key={prov} value={prov}>
                {prov}
              </option>
            ))}
          </select>

          <select
            className="findstore-select"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            disabled={!province}
          >
            <option value="">Choose district</option>
            {province && districts[province]
              ? districts[province].map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))
              : null}
          </select>

          <button className="findstore-btn" onClick={handleSearch}>
            SEARCH
          </button>
        </div>
      </div>
    </section>
  )
}
