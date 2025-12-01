import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import MainLayout from '../../layouts/home-layout'
import DroneDelivery from './drone-delivery'
import '../../assets/styles/order-detail.css'
import '../../assets/styles/drone-delivery.css'

export default function OrderDetail() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [orderItems, setOrderItems] = useState([])
  const [deliveryTracking, setDeliveryTracking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showDroneDelivery, setShowDroneDelivery] = useState(false)
  const [restaurantLocation, setRestaurantLocation] = useState(null)
  const [customerLocation, setCustomerLocation] = useState(null)

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch order details
        const { data: orderData, error: orderError } = await supabase
          .from('order')
          .select('*')
          .eq('order_id', orderId)
          .single()

        if (orderError) throw orderError
        setOrder(orderData)

        // Fetch restaurant location
        const { data: restaurantData, error: restaurantError } = await supabase
          .from('restaurant')
          .select('latitude, longitude, address')
          .eq('restaurant_id', orderData.restaurant_id)
          .single()

        if (restaurantError) {
          console.log('Restaurant location not found:', restaurantError)
        } else {
          setRestaurantLocation({
            lat: restaurantData.latitude,
            lng: restaurantData.longitude,
            address: restaurantData.address,
          })
        }

        // Fetch customer delivery location from customer table
        const { data: customerData, error: customerError } = await supabase
          .from('customer')
          .select('latitude, longitude')
          .eq('customer_id', orderData.customer_id)
          .single()

        if (customerError) {
          console.log('Customer location not found:', customerError)
        } else {
          setCustomerLocation({
            lat: customerData.latitude,
            lng: customerData.longitude,
            address: orderData.shipping_address,
          })
        }

        // Fetch order items
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_item')
          .select('*')
          .eq('order_id', orderId)

        if (itemsError) throw itemsError
        setOrderItems(itemsData || [])

        // Fetch delivery tracking
        const { data: trackingData, error: trackingError } = await supabase
          .from('delivery_tracking')
          .select('*')
          .eq('order_id', orderId)
          .maybeSingle()

        if (trackingError) {
          console.log('No delivery tracking found:', trackingError)
        }
        setDeliveryTracking(trackingData || null)
      } catch (err) {
        console.error('Error fetching order details:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      fetchOrderDetails()
    }
  }, [orderId])

  const handleReceivedOrder = async () => {
    try {
      const { error } = await supabase
        .from('order')
        .update({ order_status: 'completed' })
        .eq('order_id', orderId)

      if (error) throw error
      setOrder({ ...order, order_status: 'completed' })
      alert('✅ Order marked as received!')
    } catch (err) {
      console.error('Error marking order as received:', err)
      alert(`❌ ${err.message}`)
    }
  }

  const handleDroneCompleted = async () => {
    try {
      const { error } = await supabase
        .from('order')
        .update({ order_status: 'completed' })
        .eq('order_id', orderId)

      if (error) throw error
      setOrder({ ...order, order_status: 'completed' })
      setShowDroneDelivery(false)
    } catch (err) {
      console.error('Error marking order as completed:', err)
      alert(`❌ ${err.message}`)
    }
  }

  const getStatusColor = (status) => {
    const statusColors = {
      pending: '#ffc107',
      confirmed: '#17a2b8',
      preparing: '#fd7e14',
      delivering: '#007bff',
      completed: '#28a745',
      cancelled: '#dc3545',
    }
    return statusColors[status] || '#6c757d'
  }

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      preparing: 'Preparing',
      delivering: 'Delivering',
      completed: 'Completed',
      cancelled: 'Cancelled',
    }
    return labels[status] || status
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="order-detail-page">
          <p>Loading order details...</p>
        </div>
      </MainLayout>
    )
  }

  if (error || !order) {
    return (
      <MainLayout>
        <div className="order-detail-page">
          <div className="error-message">
            <p>❌ {error || 'Order not found'}</p>
            <button onClick={() => navigate('/account')} className="btn-back">
              ← Back to Account
            </button>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="order-detail-page">
        <div className="detail-header">
          <h1>Order Details</h1>
          <button onClick={() => navigate('/account')} className="btn-back">
            ← Back to My Orders
          </button>
        </div>

        {/* Order Status Timeline */}
        <div className="order-timeline">
          <h3>Order Status</h3>
          <div className="timeline-container">
            {['pending', 'confirmed', 'preparing', 'delivering', 'completed'].map(
              (status, index) => (
                <div
                  key={status}
                  className={`timeline-item ${
                    ['pending', 'confirmed', 'preparing', 'delivering', 'completed'].indexOf(
                      order.order_status
                    ) >= index
                      ? 'completed'
                      : ''
                  }`}
                >
                  <div className="timeline-dot" style={{ backgroundColor: getStatusColor(status) }}>
                    {['pending', 'confirmed', 'preparing', 'delivering', 'completed'].indexOf(
                      order.order_status
                    ) >= index && '✓'}
                  </div>
                  <p className="timeline-label">{getStatusLabel(status)}</p>
                </div>
              )
            )}
          </div>
        </div>

        {/* Delivery Tracking (GPS Ready) */}
        {deliveryTracking && (
          <div className="delivery-tracking">
            <h3>📍 Delivery Tracking</h3>
            <div className="tracking-info">
              <p>
                <strong>Estimated Time:</strong> {deliveryTracking.estimated_time_minutes} minutes
              </p>
              <p>
                <strong>Status:</strong>{' '}
                <span className="tracking-status">{deliveryTracking.status}</span>
              </p>
              {deliveryTracking.status === 'on_the_way' && (
                <div className="gps-placeholder">
                  <p>🗺️ GPS Map will be displayed here</p>
                  <p className="note">GPS tracking feature coming soon...</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Customer Action Buttons */}
        {order.order_status === 'delivering' && (
          <div className="customer-actions">
            <button onClick={() => setShowDroneDelivery(true)} className="btn-track-drone">
              🚁 Track Drone Delivery
            </button>
            <button onClick={handleReceivedOrder} className="btn-received">
              ✓ I've Received the Order
            </button>
          </div>
        )}

        <div className="detail-content">
          {/* Order Info */}
          <div className="info-section">
            <h3>Order Information</h3>
            <div className="info-grid">
              <div>
                <p>
                  <strong>Order ID:</strong> {order.order_id.slice(0, 8)}
                </p>
                <p>
                  <strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p>
                  <strong>Order Status:</strong>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.order_status) }}
                  >
                    {getStatusLabel(order.order_status)}
                  </span>
                </p>
                <p>
                  <strong>Payment Status:</strong>
                  <span
                    className="status-badge"
                    style={{
                      backgroundColor: order.payment_status === 'paid' ? '#28a745' : '#ffc107',
                    }}
                  >
                    {order.payment_status}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="info-section">
            <h3>Shipping Information</h3>
            <div className="shipping-info">
              <p>
                <strong>Name:</strong> {order.shipping_name}
              </p>
              <p>
                <strong>Phone:</strong> {order.shipping_phone}
              </p>
              <p>
                <strong>Address:</strong> {order.shipping_address}
              </p>
              {order.shipping_method && (
                <p>
                  <strong>Shipping Method:</strong> {order.shipping_method}
                </p>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="info-section">
            <h3>Order Items</h3>
            {orderItems.length === 0 ? (
              <p>No items in this order</p>
            ) : (
              <div className="items-list">
                {orderItems.map((item) => (
                  <div key={item.order_item_id} className="item-row">
                    <div className="item-details">
                      <p className="item-id">Product ID: {item.product_id.slice(0, 8)}</p>
                      <p className="item-quantity">Quantity: {item.quantity}</p>
                    </div>
                    <div className="item-price">
                      <p className="price">
                        {parseFloat(item.price).toLocaleString()}₫ × {item.quantity}
                      </p>
                      <p className="total">
                        Total: {(parseFloat(item.price) * item.quantity).toLocaleString()}₫
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>{parseFloat(order.total_price).toLocaleString()}₫</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>{parseFloat(order.total_price).toLocaleString()}₫</span>
            </div>
          </div>
        </div>

        {/* Drone Delivery Modal */}
        {showDroneDelivery && order.order_status === 'delivering' && (
          <DroneDelivery
            order={order}
            restaurantLocation={restaurantLocation}
            customerLocation={customerLocation}
            onCompleted={handleDroneCompleted}
            onClose={() => setShowDroneDelivery(false)}
          />
        )}
      </div>
    </MainLayout>
  )
}
