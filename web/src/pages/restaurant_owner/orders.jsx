import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import RestaurantLayout from '../../layouts/restaurant-layout'
import { supabase } from '../../lib/supabaseClient'
import '../../assets/styles/restaurant-manage.css'

export default function RestaurantOrders() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchOrders()
  }, [filter])

  const fetchOrders = async () => {
    try {
      const ownerId = localStorage.getItem('restaurantOwnerId')
      if (!ownerId) {
        navigate('/restaurant/login')
        return
      }

      // Get restaurant_id
      const { data: restaurant, error: restError } = await supabase
        .from('restaurant')
        .select('restaurant_id')
        .eq('owner_id', ownerId)
        .single()

      if (restError) throw restError

      // Get orders
      let query = supabase
        .from('order')
        .select('*, order_item(*), payment(*)')
        .eq('restaurant_id', restaurant.restaurant_id)

      if (filter !== 'all') {
        query = query.eq('order_status', filter)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (err) {
      console.error('Error fetching orders:', err)
      setMessage(`❌ ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Update order status - controlled flow
  const handleStatusChange = async (orderId, currentStatus, nextStatus) => {
    // Validate status flow
    const validTransitions = {
      pending: ['confirmed'],
      confirmed: ['preparing'],
      preparing: ['delivering'],
      delivering: [], // Cannot change from delivering - only customer can mark as completed
      completed: [],
      cancelled: [],
    }

    if (!validTransitions[currentStatus]?.includes(nextStatus)) {
      setMessage(`❌ Cannot change from ${currentStatus} to ${nextStatus}`)
      return
    }

    try {
      const updateData = { order_status: nextStatus }

      // Set delivered_at when transitioning to "delivering"
      if (nextStatus === 'delivering') {
        updateData.delivered_at = new Date().toISOString()
      }

      const { error } = await supabase.from('order').update(updateData).eq('order_id', orderId)

      if (error) throw error
      setMessage(`✅ Order status updated to ${nextStatus}`)
      fetchOrders()
    } catch (err) {
      console.error('Error:', err)
      setMessage(`❌ ${err.message}`)
    }
  }

  // Get available next statuses for current status
  const getNextStatuses = (currentStatus) => {
    const statusMap = {
      pending: [{ label: 'Confirm Order', value: 'confirmed' }],
      confirmed: [{ label: 'Start Preparing', value: 'preparing' }],
      preparing: [{ label: 'Ready for Delivery', value: 'delivering' }],
      delivering: [
        { label: 'Waiting for Customer Confirmation', value: 'delivering', disabled: true },
      ],
      completed: [{ label: 'Completed', value: 'completed', disabled: true }],
      cancelled: [{ label: 'Cancelled', value: 'cancelled', disabled: true }],
    }

    return statusMap[currentStatus] || []
  }

  if (loading) {
    return (
      <RestaurantLayout>
        <div className="manage-page">
          <p>Loading orders...</p>
        </div>
      </RestaurantLayout>
    )
  }

  return (
    <RestaurantLayout>
      <div className="manage-page">
        <div className="manage-header">
          <h1>Orders Management</h1>
          <Link to="/restaurant/dashboard" className="btn-back">
            ← Back to Dashboard
          </Link>
        </div>

        {message && (
          <p className={message.startsWith('❌') ? 'error-message' : 'success-message'}>
            {message}
          </p>
        )}

        <div className="filter-buttons">
          <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>
            All Orders
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={filter === 'pending' ? 'active' : ''}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('confirmed')}
            className={filter === 'confirmed' ? 'active' : ''}
          >
            Confirmed
          </button>
          <button
            onClick={() => setFilter('preparing')}
            className={filter === 'preparing' ? 'active' : ''}
          >
            Preparing
          </button>
          <button
            onClick={() => setFilter('delivering')}
            className={filter === 'delivering' ? 'active' : ''}
          >
            Delivering
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={filter === 'completed' ? 'active' : ''}
          >
            Completed
          </button>
        </div>

        <div className="orders-list">
          {orders.length === 0 ? (
            <p>No orders found</p>
          ) : (
            orders.map((order) => (
              <div key={order.order_id} className="order-card">
                <div className="order-header">
                  <h3>Order #{order.order_id.slice(0, 8)}</h3>
                  <span className={`status ${order.order_status}`}>{order.order_status}</span>
                </div>

                <div className="order-info">
                  <p>
                    <strong>Customer:</strong> {order.shipping_name}
                  </p>
                  <p>
                    <strong>Address:</strong> {order.shipping_address}
                  </p>
                  <p>
                    <strong>Phone:</strong> {order.shipping_phone}
                  </p>
                  <p>
                    <strong>Total:</strong> {parseFloat(order.total_price).toLocaleString()}₫
                  </p>
                  <p>
                    <strong>Payment:</strong> {order.payment_status}
                  </p>
                  <p>
                    <strong>Created:</strong> {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>

                {order.order_item && order.order_item.length > 0 && (
                  <div className="order-items">
                    <h4>Items:</h4>
                    <ul>
                      {order.order_item.map((item) => (
                        <li key={item.order_item_id}>
                          Qty: {item.quantity} × {parseFloat(item.price).toLocaleString()}₫
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="order-actions">
                  {getNextStatuses(order.order_status).map((nextStatus) => (
                    <button
                      key={nextStatus.value}
                      onClick={() =>
                        handleStatusChange(order.order_id, order.order_status, nextStatus.value)
                      }
                      disabled={nextStatus.disabled}
                      className={`btn-action btn-${nextStatus.value}`}
                    >
                      {nextStatus.label}
                    </button>
                  ))}
                  {getNextStatuses(order.order_status).length === 0 && (
                    <p className="no-actions">No actions available for this order</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </RestaurantLayout>
  )
}
