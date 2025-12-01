import { useState, useEffect, useRef } from 'react'

export default function DroneDeliveryTracker({
  order,
  restaurantLocation,
  customerLocation,
  onProgressChange,
}) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const droneMarkerRef = useRef(null)
  const animationIdRef = useRef(null)
  const [progress, setProgress] = useState(0)

  // Positions
  const restaurantPos = restaurantLocation
    ? [restaurantLocation.lat, restaurantLocation.lng]
    : [10.8231, 106.6797]

  const customerPos = customerLocation
    ? [customerLocation.lat, customerLocation.lng]
    : [10.814, 106.7114]

  const FLIGHT_DURATION = 30000 // 30 seconds

  // Initialize map
  useEffect(() => {
    if (mapInstanceRef.current || !mapRef.current) return

    const L = window.L
    const map = L.map(mapRef.current).setView(restaurantPos, 13)
    mapInstanceRef.current = map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    }).addTo(map)

    // Route line
    L.polyline([restaurantPos, customerPos], {
      color: 'deepskyblue',
      weight: 3,
      dashArray: '8, 6',
    }).addTo(map)

    // Markers
    L.marker(restaurantPos, { title: 'Restaurant' }).addTo(map).bindPopup('🍽️ Restaurant')
    L.marker(customerPos, { title: 'Delivery' }).addTo(map).bindPopup('📍 Delivery Address')

    // Drone marker
    droneMarkerRef.current = L.marker(restaurantPos, {
      icon: L.divIcon({
        className: 'drone-icon',
        html: '<div style="font-size: 32px;">🚁</div>',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      }),
    }).addTo(map)

    // Cleanup
    return () => {
      if (animationIdRef.current) clearTimeout(animationIdRef.current)
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Start animation when order.delivered_at is set
  useEffect(() => {
    if (!order?.delivered_at) return

    const animate = () => {
      const deliveredTime = new Date(order.delivered_at).getTime()
      const elapsed = Date.now() - deliveredTime
      const percent = Math.min(100, (elapsed / FLIGHT_DURATION) * 100)

      setProgress(percent)
      if (onProgressChange) onProgressChange(percent)

      // Update drone position
      if (droneMarkerRef.current && percent < 100) {
        const ratio = percent / 100
        const lat = restaurantPos[0] + (customerPos[0] - restaurantPos[0]) * ratio
        const lng = restaurantPos[1] + (customerPos[1] - restaurantPos[1]) * ratio
        droneMarkerRef.current.setLatLng([lat, lng])
      }

      // Continue loop if not done
      if (percent < 100) {
        animationIdRef.current = setTimeout(animate, 50)
      } else {
        // Animation complete
        if (droneMarkerRef.current) {
          droneMarkerRef.current.setLatLng(customerPos)
        }
        animationIdRef.current = null
      }
    }

    animate()

    return () => {
      if (animationIdRef.current) clearTimeout(animationIdRef.current)
    }
  }, [order?.delivered_at])

  // Cleanup on unmount
  const cleanup = () => {
    if (animationIdRef.current) clearTimeout(animationIdRef.current)
  }

  return { mapRef, progress, cleanup }
}
