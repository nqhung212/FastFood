import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import RestaurantLayout from '../../layouts/restaurant-layout'
import '../../assets/styles/restaurant-setup.css'

export default function RestaurantSetup() {
  const navigate = useNavigate()
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markerRef = useRef(null)

  const [restaurant, setRestaurant] = useState(null)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const ownerId = localStorage.getItem('restaurantOwnerId')
        if (!ownerId) {
          navigate('/restaurant/login')
          return
        }

        const { data, error } = await supabase
          .from('restaurant')
          .select('*')
          .eq('owner_id', ownerId)
          .single()

        if (error) throw error
        setRestaurant(data)

        // If already active, redirect to dashboard
        if (data.status === 'active') {
          navigate('/restaurant/dashboard')
        }

        if (data.latitude && data.longitude) {
          setSelectedLocation({
            lat: data.latitude,
            lng: data.longitude,
          })
        }
      } catch (err) {
        console.error('Error fetching restaurant:', err)
        setMessage(`❌ ${err.message}`)
      } finally {
        setLoading(false)
      }
    }

    fetchRestaurant()
  }, [navigate])

  useEffect(() => {
    if (loading || !mapRef.current || mapInstanceRef.current) return

    const L = window.L
    const map = L.map(mapRef.current).setView([10.8231, 106.6797], 13)
    mapInstanceRef.current = map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    }).addTo(map)

    // Add existing marker if restaurant has location
    if (selectedLocation) {
      markerRef.current = L.marker([selectedLocation.lat, selectedLocation.lng])
        .addTo(map)
        .bindPopup('Nhà hàng')
    }

    // Handle map clicks
    map.on('click', (e) => {
      const { lat, lng } = e.latlng
      setSelectedLocation({ lat, lng })

      // Remove old marker
      if (markerRef.current) {
        map.removeLayer(markerRef.current)
      }

      // Add new marker
      markerRef.current = L.marker([lat, lng]).addTo(map).bindPopup('Nhà hàng').openPopup()

      setMessage('')
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [loading, selectedLocation])

  const handleSaveLocation = async () => {
    if (!selectedLocation) {
      setMessage('❌ Vui lòng chọn địa chỉ nhà hàng trên bản đồ')
      return
    }

    try {
      setSaving(true)
      const { error } = await supabase
        .from('restaurant')
        .update({
          latitude: selectedLocation.lat,
          longitude: selectedLocation.lng,
          status: 'active',
        })
        .eq('restaurant_id', restaurant.restaurant_id)

      if (error) throw error

      setMessage('✅ Địa chỉ đã được cập nhật! Chuyển hướng...')
      setTimeout(() => {
        navigate('/restaurant/dashboard')
      }, 1500)
    } catch (err) {
      console.error('Error saving location:', err)
      setMessage(`❌ ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <RestaurantLayout>
        <div className="setup-page">
          <p>Loading...</p>
        </div>
      </RestaurantLayout>
    )
  }

  return (
    <RestaurantLayout>
      <div className="setup-page">
        <div className="setup-container">
          <div className="setup-header">
            <h1>🎯 Thiết lập địa chỉ nhà hàng</h1>
            <p>Vui lòng chọn vị trí nhà hàng của bạn trên bản đồ</p>
          </div>

          {message && (
            <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <div className="setup-content">
            <div className="map-section">
              <div className="map-wrapper" ref={mapRef}></div>
              <div className="map-info">
                <p>💡 Click trên bản đồ để chọn vị trí nhà hàng</p>
              </div>
            </div>

            <div className="location-info">
              <h3>Thông tin nhà hàng</h3>
              <div className="info-box">
                <p>
                  <strong>Tên nhà hàng:</strong> {restaurant?.name}
                </p>
                <p>
                  <strong>Trạng thái:</strong>{' '}
                  <span className="status-inactive">Chưa hoạt động</span>
                </p>
              </div>

              {selectedLocation && (
                <div className="selected-location">
                  <h4>✓ Địa chỉ đã chọn:</h4>
                  <p>
                    Vĩ độ: <code>{selectedLocation.lat.toFixed(6)}</code>
                  </p>
                  <p>
                    Kinh độ: <code>{selectedLocation.lng.toFixed(6)}</code>
                  </p>
                </div>
              )}

              <div className="action-buttons">
                <button
                  className="btn-save"
                  onClick={handleSaveLocation}
                  disabled={!selectedLocation || saving}
                >
                  {saving ? '⏳ Đang lưu...' : '✓ Lưu địa chỉ và kích hoạt'}
                </button>
                <button
                  className="btn-cancel"
                  onClick={() => navigate('/restaurant/dashboard')}
                  disabled={saving}
                >
                  ← Quay lại
                </button>
              </div>

              <div className="guide">
                <h4>📖 Hướng dẫn:</h4>
                <ul>
                  <li>Click trên bản đồ để chọn vị trí nhà hàng</li>
                  <li>Bạn có thể chọn lại bất cứ lúc nào</li>
                  <li>Sau khi lưu, nhà hàng sẽ được kích hoạt</li>
                  <li>Địa chỉ này sẽ được hiển thị cho khách hàng</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RestaurantLayout>
  )
}
