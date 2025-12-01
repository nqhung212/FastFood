import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import RestaurantLayout from '../../layouts/restaurant-layout'
import { supabase } from '../../lib/supabaseClient'
import '../../assets/styles/restaurant-manage.css'
import '../../assets/styles/restaurant-setup.css'

export default function RestaurantInfo() {
  const navigate = useNavigate()
  const [restaurant, setRestaurant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [showMapModal, setShowMapModal] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const mapInstanceRef = useRef(null)
  const mapRef = useRef(null)
  const markerRef = useRef(null)
  const [form, setForm] = useState({
    name: '',
    description: '',
    logo_url: '',
    address: '',
    latitude: '',
    longitude: '',
    status: 'active',
  })

  useEffect(() => {
    fetchRestaurant()
  }, [])

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
      setForm({
        name: data.name,
        description: data.description || '',
        logo_url: data.logo_url || '',
        address: data.address || '',
        latitude: data.latitude || '',
        longitude: data.longitude || '',
        status: data.status || 'active',
      })
    } catch (err) {
      console.error('Error fetching restaurant:', err)
      setMessage(`❌ ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const initializeMap = () => {
    if (mapInstanceRef.current || !mapRef.current) return

    const L = window.L
    const map = L.map(mapRef.current).setView([21.0285, 105.8542], 13)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)

    const handleMapClick = (e) => {
      const { lat, lng } = e.latlng
      setSelectedLocation({ lat, lng })

      if (markerRef.current) {
        map.removeLayer(markerRef.current)
      }

      markerRef.current = L.marker([lat, lng]).addTo(map)
      map.setView([lat, lng], 15)
    }

    map.on('click', handleMapClick)

    // If restaurant already has location, show it
    if (form.latitude && form.longitude) {
      const lat = parseFloat(form.latitude)
      const lng = parseFloat(form.longitude)
      setSelectedLocation({ lat, lng })
      markerRef.current = L.marker([lat, lng]).addTo(map)
      map.setView([lat, lng], 15)
    }

    mapInstanceRef.current = map

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }

  useEffect(() => {
    if (showMapModal) {
      setTimeout(initializeMap, 0)
    }
  }, [showMapModal, form.latitude, form.longitude])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    try {
      if (!form.name.trim()) {
        throw new Error('Restaurant name is required')
      }

      const { error } = await supabase
        .from('restaurant')
        .update({
          name: form.name,
          description: form.description,
          logo_url: form.logo_url,
          address: form.address,
          latitude: form.latitude ? parseFloat(form.latitude) : null,
          longitude: form.longitude ? parseFloat(form.longitude) : null,
          status: form.status,
        })
        .eq('restaurant_id', restaurant.restaurant_id)

      if (error) throw error

      setMessage('✅ Restaurant information updated successfully')
      setTimeout(() => navigate('/restaurant/dashboard'), 1500)
    } catch (err) {
      console.error('Error:', err)
      setMessage(`❌ ${err.message}`)
    }
  }

  const handleLocationSave = () => {
    if (!selectedLocation) {
      setMessage('❌ Please select a location on the map')
      return
    }

    setForm({
      ...form,
      latitude: selectedLocation.lat.toFixed(4),
      longitude: selectedLocation.lng.toFixed(4),
    })

    setShowMapModal(false)
    setMessage('✅ Location updated. Please save the form to confirm.')
  }

  if (loading) {
    return (
      <RestaurantLayout>
        <div className="manage-page">
          <p>Loading restaurant info...</p>
        </div>
      </RestaurantLayout>
    )
  }

  return (
    <RestaurantLayout>
      <div className="manage-page">
        <div className="manage-header">
          <h1>Restaurant Information</h1>
          <Link to="/restaurant/dashboard" className="btn-back">
            ← Back to Dashboard
          </Link>
        </div>

        {message && (
          <p className={message.startsWith('❌') ? 'error-message' : 'success-message'}>
            {message}
          </p>
        )}

        {restaurant && (
          <form onSubmit={handleSubmit} className="manage-form restaurant-form">
            <div className="form-group">
              <label>Restaurant Name *</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div className="form-group">
              <label>Logo URL</label>
              <input
                type="text"
                name="logo_url"
                value={form.logo_url}
                onChange={handleChange}
                placeholder="https://example.com/logo.jpg"
              />
              {form.logo_url && (
                <div>
                  <p>Preview:</p>
                  <img src={form.logo_url} alt="Logo" width="100" />
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Address</label>
              <input type="text" name="address" value={form.address} onChange={handleChange} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Latitude</label>
                <input
                  type="number"
                  name="latitude"
                  value={form.latitude}
                  onChange={handleChange}
                  step="0.0001"
                  placeholder="e.g., 21.0285"
                  disabled
                />
              </div>

              <div className="form-group">
                <label>Longitude</label>
                <input
                  type="number"
                  name="longitude"
                  value={form.longitude}
                  onChange={handleChange}
                  step="0.0001"
                  placeholder="e.g., 105.8542"
                  disabled
                />
              </div>
            </div>

            <div className="form-group">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setSelectedLocation(null)
                  setShowMapModal(true)
                }}
                style={{
                  backgroundColor: '#667eea',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  width: '100%',
                }}
              >
                📍{' '}
                {form.latitude && form.longitude
                  ? 'Update Location on Map'
                  : 'Select Location on Map'}
              </button>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <button type="submit" className="btn-submit">
              Update Restaurant Info
            </button>
          </form>
        )}

        {showMapModal && (
          <div className="setup-modal-overlay">
            <div className="setup-modal-content">
              <div className="setup-modal-header">
                <h2>Select Restaurant Location</h2>
                <button
                  onClick={() => setShowMapModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                  }}
                >
                  ✕
                </button>
              </div>

              <div className="setup-map-container">
                <div ref={mapRef} style={{ width: '100%', height: '400px' }} />
              </div>

              {selectedLocation && (
                <div className="setup-location-info">
                  <p>
                    <strong>Selected Location:</strong>
                  </p>
                  <p>Latitude: {selectedLocation.lat.toFixed(6)}</p>
                  <p>Longitude: {selectedLocation.lng.toFixed(6)}</p>
                </div>
              )}

              <div className="setup-button-group">
                <button onClick={() => setShowMapModal(false)} className="btn-cancel">
                  Cancel
                </button>
                <button onClick={handleLocationSave} className="btn-save">
                  Save Location
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RestaurantLayout>
  )
}
