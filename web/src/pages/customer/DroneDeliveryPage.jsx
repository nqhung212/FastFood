import { useEffect } from 'react'
import DroneDeliveryTracker from '../../components/DroneDeliveryTracker'
import '../../assets/styles/drone-delivery.css'

export default function DroneDeliveryPage({
  order,
  restaurantLocation,
  customerLocation,
  onCompleted,
  onClose,
}) {
  const { mapRef, progress, cleanup } = DroneDeliveryTracker({
    order,
    restaurantLocation,
    customerLocation,
  })

  // Handle close
  const handleClose = () => {
    cleanup()
    onClose()
  }

  // Handle completed
  const handleCompleted = () => {
    cleanup()
    onCompleted()
  }

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      cleanup()
    }
  }, [])

  return (
    <div className="drone-delivery-modal" onClick={handleClose}>
      <div className="drone-control-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drone-map-wrapper" ref={mapRef}></div>

        <div className="drone-control-panel-content">
          <div className="drone-header">
            <div>
              <h3>🚁 Drone Delivery</h3>
              <p>Order #{order?.order_id?.slice(0, 8)}</p>
            </div>
            <button className="modal-close-btn" onClick={handleClose} title="Close (ESC)">
              ✕
            </button>
          </div>

          <div className="drone-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <span className="progress-text">{progress.toFixed(0)}%</span>
          </div>

          <div className="drone-info">
            <p>
              <strong>From:</strong> {restaurantLocation?.address || 'Restaurant'}
            </p>
            <p>
              <strong>To:</strong> {customerLocation?.address || order?.shipping_address}
            </p>
            <p>
              <strong>Est. Time:</strong> 30 seconds
            </p>
          </div>

          <div className="drone-actions">
            <button
              className="btn-completed"
              onClick={handleCompleted}
              disabled={progress < 100}
              style={{
                backgroundColor: progress >= 100 ? '#4CAF50' : '#ccc',
                color: 'white',
              }}
            >
              {progress >= 100 ? '✓ Order Arrived - Confirm' : 'En route...'}
            </button>
          </div>

          <div className="drone-legend">
            <div className="legend-item">🍽️ Restaurant</div>
            <div className="legend-item">📍 Delivery Address</div>
            <div className="legend-item">🚁 Drone</div>
          </div>
        </div>
      </div>
    </div>
  )
}
