// src/pages/findstore.jsx
import '../assets/styles/findstore.css'
import { useState } from 'react'

export default function FindStore() {
  const [province, setProvince] = useState('')
  const [district, setDistrict] = useState('')

  const provinces = [
    'Hà Nội',
    'Hồ Chí Minh',
    'Đà Nẵng',
    'Hải Phòng',
    'Cần Thơ',
    'Bình Dương',
    'Đồng Nai',
    'Khánh Hòa',
  ]

  const districts = {
    'Hà Nội': ['Hoàn Kiếm', 'Ba Đình', 'Đống Đa', 'Hai Bà Trưng', 'Cầu Giấy'],
    'Hồ Chí Minh': ['Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5'],
    'Đà Nẵng': ['Hải Châu', 'Thanh Khê', 'Sơn Trà', 'Ngũ Hành Sơn'],
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
