import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabaseClient'
import '../../assets/styles/delivery-address-modal.css'

export default function DeliveryAddressModal({ userId, onAddressSelect, onClose }) {
  const [showMap, setShowMap] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [address, setAddress] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const mapInstanceRef = useRef(null)
  const mapRef = useRef(null)
  const markerRef = useRef(null)

  const initializeMap = () => {
    // Clean up existing map
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
    }

    if (!mapRef.current) return

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
    mapInstanceRef.current = map
  }

  useEffect(() => {
    if (showMap) {
      // Delay to ensure DOM is ready
      const timer = setTimeout(() => {
        initializeMap()
      }, 100)
      return () => clearTimeout(timer)
    } else {
      // Cleanup when hiding map
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [showMap])

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showMap) {
          setShowMap(false)
        } else {
          onClose()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showMap, onClose])

  const handleConfirmLocation = () => {
    if (!selectedLocation) {
      setMessage('❌ Please select a location on the map')
      return
    }
    setShowMap(false)
    setMessage('')
  }

  const handleSaveAddress = async () => {
    setMessage('')
    setLoading(true)

    try {
      if (!address.trim()) {
        throw new Error('Please enter a delivery address')
      }

      if (!selectedLocation) {
        throw new Error('Please select a location on the map')
      }

      console.log('💾 Saving address for user:', userId)
      console.log('Address:', address)
      console.log('Location:', selectedLocation)

      // Use upsert to insert or update
      const { data, error } = await supabase.from('customer').upsert(
        {
          customer_id: userId,
          default_address: address,
          latitude: selectedLocation.lat,
          longitude: selectedLocation.lng,
        },
        { onConflict: 'customer_id' }
      )

      if (error) {
        console.error('Upsert error:', error)
        throw error
      }

      console.log('✅ Address saved to Supabase', data)
      setMessage('✅ Address saved successfully!')
      setTimeout(() => {
        onAddressSelect({
          address,
          latitude: selectedLocation.lat,
          longitude: selectedLocation.lng,
        })
      }, 1000)
    } catch (err) {
      console.error('Error saving address:', err)
      setMessage(`❌ ${err.message || 'Failed to save address'}`)
      setLoading(false)
    }
  }

  return (
    <div
      className="address-modal-overlay"
      onClick={(e) => {
        // Close modal if clicking on backdrop
        if (e.target === e.currentTarget && !showMap) {
          onClose()
        }
      }}
    >
      <div className="address-modal-content">
        <div className="address-modal-header">
          <h2>📍 Set Delivery Address</h2>
          <button
            onClick={onClose}
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

        {message && (
          <div
            className={message.startsWith('❌') ? 'error-message' : 'success-message'}
            style={{ margin: '15px' }}
          >
            {message}
          </div>
        )}

        <div className="address-modal-body">
          {!showMap ? (
            <div className="address-form">
              <div className="form-group">
                <label>Delivery Address *</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your delivery address"
                  disabled={loading}
                />
              </div>

              <button
                onClick={() => {
                  setShowMap(true)
                  setSelectedLocation(null)
                }}
                className="btn-select-map"
              >
                🗺️ Select Location on Map
              </button>

              {selectedLocation && (
                <div className="location-preview">
                  <p>
                    <strong>✓ Location Selected:</strong>
                  </p>
                  <p>Latitude: {selectedLocation.lat.toFixed(6)}</p>
                  <p>Longitude: {selectedLocation.lng.toFixed(6)}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="map-section">
              <div ref={mapRef} style={{ width: '100%', height: '350px', borderRadius: '5px' }} />
              <div className="map-info">
                <p>Click on the map to select your delivery location</p>
                {selectedLocation && (
                  <p style={{ fontSize: '12px', color: '#2e7d32', fontWeight: '600' }}>
                    ✓ Selected: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="address-modal-footer">
          <button onClick={() => (showMap ? setShowMap(false) : onClose())} className="btn-cancel">
            {showMap ? 'Back' : 'Cancel'}
          </button>
          {showMap ? (
            <button
              onClick={handleConfirmLocation}
              className="btn-save"
              disabled={!selectedLocation}
            >
              {selectedLocation ? '✓ Confirm Location' : 'Select Location on Map'}
            </button>
          ) : (
            <button
              onClick={handleSaveAddress}
              className="btn-save"
              disabled={loading || !address.trim() || !selectedLocation}
            >
              {loading ? 'Saving...' : 'Save Address'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
