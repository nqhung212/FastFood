import { useState, useEffect } from 'react'
import { useAuth } from '../../context/auth-context'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import MainLayout from '../../layouts/home-layout.jsx'
import DeliveryAddressModal from './delivery-address-modal'
import '../../assets/styles/account.css'

export default function AccountPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('account-management')
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [customerAddress, setCustomerAddress] = useState(null)
  const [addresses, setAddresses] = useState([])
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [editingContact, setEditingContact] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })

  // Fetch user's orders from Supabase
  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        setOrdersLoading(true)

        // Fetch customer address
        const { data: customerData, error: customerError } = await supabase
          .from('customer')
          .select('default_address, latitude, longitude')
          .eq('customer_id', user.id)
          .single()

        if (!customerError && customerData?.default_address) {
          setCustomerAddress({
            id: 1,
            name: 'Delivery Address',
            address: customerData.default_address,
            latitude: customerData.latitude,
            longitude: customerData.longitude,
            isDefault: true,
          })
        }

        // Fetch orders
        const { data: ordersData, error: ordersError } = await supabase
          .from('order')
          .select('*')
          .eq('customer_id', user.id)
          .order('created_at', { ascending: false })

        if (ordersError) throw ordersError
        setOrders(ordersData || [])
      } catch (err) {
        console.error('Error fetching data:', err)
      } finally {
        setOrdersLoading(false)
      }
    }

    fetchData()
  }, [user])

  const handleContactSave = () => {
    console.log('Saving contact:', contactForm)
    setEditingContact(false)
  }

  const handleAddAddress = () => {
    const newAddress = {
      id: Date.now(),
      name: 'New address',
      phone: '',
      address: '',
      isDefault: false,
    }
    setAddresses([...addresses, newAddress])
  }

  const handleDeleteAddress = (id) => {
    setAddresses(addresses.filter((addr) => addr.id !== id))
  }

  const handleSetDefault = (id) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'account-management':
        return (
          <div className="account-content">
            <div className="account-intro">
              <p>
                Hi {user?.name}. With this page, you will be able to manage all your account
                information.
              </p>
            </div>

            {/* Account Information */}
            <div className="account-section">
              <div className="section-header">ACCOUNT INFORMATION</div>
              <div className="section-content">
                <div className="info-grid">
                  <div className="info-column">
                    <h4>CONTACT INFORMATION</h4>
                    {!editingContact ? (
                      <div className="contact-display">
                        <p>
                          <strong>{contactForm.name}</strong>
                        </p>
                        <p>{contactForm.email}</p>
                        <p>{contactForm.phone}</p>
                        <button className="link-button" onClick={() => setEditingContact(true)}>
                          Edit
                        </button>
                        |<button className="link-button">Change Password</button>
                      </div>
                    ) : (
                      <div className="contact-edit">
                        <div className="form-group">
                          <label>Name</label>
                          <input
                            type="text"
                            value={contactForm.name}
                            onChange={(e) =>
                              setContactForm({
                                ...contactForm,
                                name: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="form-group">
                          <label>Email</label>
                          <input
                            type="email"
                            value={contactForm.email}
                            onChange={(e) =>
                              setContactForm({
                                ...contactForm,
                                email: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="form-group">
                          <label>Phone</label>
                          <input
                            type="tel"
                            value={contactForm.phone}
                            onChange={(e) =>
                              setContactForm({
                                ...contactForm,
                                phone: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="form-actions">
                          <button className="btn-save" onClick={handleContactSave}>
                            Save
                          </button>
                          <button className="btn-cancel" onClick={() => setEditingContact(false)}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="info-column">
                    <h4>NEWSLETTERS</h4>
                    <p>You aren't subscribed to our newsletter.</p>
                    <button className="link-button">Edit</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Book */}
            <div className="account-section">
              <div className="section-header">ADDRESS BOOK</div>
              <div className="section-content">
                {!customerAddress ? (
                  <div style={{ padding: '20px', textAlign: 'center' }}>
                    <p style={{ color: '#666', marginBottom: '15px' }}>
                      No delivery address saved yet.
                    </p>
                    <button
                      className="btn-primary"
                      onClick={() => setShowAddressModal(true)}
                      style={{
                        backgroundColor: '#667eea',
                        color: 'white',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '14px',
                      }}
                    >
                      + Add Delivery Address
                    </button>
                  </div>
                ) : (
                  <div className="address-list">
                    <div className="address-item">
                      <div className="address-header">
                        <h5>{customerAddress.name}</h5>
                        <span className="badge-default">Default</span>
                      </div>
                      <p className="address-text">{customerAddress.address}</p>
                      {customerAddress.latitude && customerAddress.longitude && (
                        <p className="address-text" style={{ fontSize: '12px', color: '#999' }}>
                          📍 {customerAddress.latitude.toFixed(4)},{' '}
                          {customerAddress.longitude.toFixed(4)}
                        </p>
                      )}
                      <div className="address-actions">
                        <button className="link-button" onClick={() => setShowAddressModal(true)}>
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="account-section">
              <div className="section-header">RECENT ORDERS</div>
              <div className="section-content">
                {orders.length === 0 ? (
                  <div className="no-data-message">
                    <span>⚠️</span>
                    <p>You have placed no orders.</p>
                  </div>
                ) : (
                  <div className="orders-list">
                    {orders.map((order) => (
                      <div key={order.order_id} className="order-item">
                        <p>Order #{order.order_id.slice(0, 8)}</p>
                        <p>Total: {parseFloat(order.total_price).toLocaleString()}₫</p>
                        <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case 'my-orders':
        return (
          <div className="account-content">
            <h2>MY ORDERS</h2>
            {ordersLoading ? (
              <div className="no-data-message">
                <p>Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="no-data-message">
                <span>⚠️</span>
                <p>You have placed no orders.</p>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order.order_id} className="order-item">
                    <div className="order-header">
                      <div>
                        <p>
                          <strong>Order #{order.order_id.slice(0, 8)}</strong>
                        </p>
                        <p className="order-date">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="order-info">
                        <p>
                          <strong>{parseFloat(order.total_price).toLocaleString()}₫</strong>
                        </p>
                        <span className={`order-status ${order.order_status}`}>
                          {order.order_status}
                        </span>
                      </div>
                    </div>
                    <div className="order-details">
                      <p>
                        <strong>Status:</strong> {order.order_status}
                      </p>
                      <p>
                        <strong>Payment:</strong> {order.payment_status}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="btn-view-detail"
                        onClick={() => navigate(`/order-detail/${order.order_id}`)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      case 'address-book':
        return (
          <div className="account-content">
            <div className="section-header-page">
              ADDRESS BOOK
              <button className="manage-link" onClick={handleAddAddress}>
                + Manage Addresses
              </button>
            </div>
            {addresses.length === 0 ? (
              <p style={{ padding: '20px' }}>No addresses saved yet.</p>
            ) : (
              <div className="address-list">
                {addresses.map((addr) => (
                  <div key={addr.id} className="address-item">
                    <div className="address-header">
                      <h5>{addr.name}</h5>
                      {addr.isDefault && <span className="badge-default">Default</span>}
                    </div>
                    <p className="address-text">{addr.phone}</p>
                    <p className="address-text">{addr.address}</p>
                    <div className="address-actions">
                      <button className="link-button">Edit</button>
                      {!addr.isDefault && (
                        <>
                          |
                          <button className="link-button" onClick={() => handleSetDefault(addr.id)}>
                            Set as Default
                          </button>
                          |
                        </>
                      )}
                      <button
                        className="link-button delete"
                        onClick={() => handleDeleteAddress(addr.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      case 'account-info':
        return (
          <div className="account-content">
            <h2>ACCOUNT INFORMATION</h2>
            {!editingContact ? (
              <div className="contact-display full-width">
                <p>
                  <strong>{contactForm.name}</strong>
                </p>
                <p>{contactForm.email}</p>
                <p>{contactForm.phone}</p>
                <button className="link-button" onClick={() => setEditingContact(true)}>
                  Edit
                </button>
                |<button className="link-button">Change Password</button>
              </div>
            ) : (
              <div className="contact-edit">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={contactForm.phone}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-actions">
                  <button className="btn-save" onClick={handleContactSave}>
                    Save
                  </button>
                  <button className="btn-cancel" onClick={() => setEditingContact(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )

      case 'voucher-list':
        return (
          <div className="account-content">
            <h2>VOUCHER LIST</h2>
            <div className="no-data-message">
              <p>No vouchers available at the moment.</p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <MainLayout>
      <div className="account-page">
        <div className="account-container">
          {/* Sidebar */}
          <aside className="account-sidebar">
            <div className="sidebar-section">
              <h3>MY ACCOUNT</h3>
              <nav className="sidebar-menu">
                <button
                  className={`menu-item ${activeTab === 'account-management' ? 'active' : ''}`}
                  onClick={() => setActiveTab('account-management')}
                >
                  ACCOUNT MANAGEMENT
                </button>
                <button
                  className={`menu-item ${activeTab === 'my-orders' ? 'active' : ''}`}
                  onClick={() => setActiveTab('my-orders')}
                >
                  MY ORDERS
                </button>
                <button
                  className={`menu-item ${activeTab === 'address-book' ? 'active' : ''}`}
                  onClick={() => setActiveTab('address-book')}
                >
                  ADDRESS BOOK
                </button>
                <button
                  className={`menu-item ${activeTab === 'account-info' ? 'active' : ''}`}
                  onClick={() => setActiveTab('account-info')}
                >
                  ACCOUNT INFORMATION
                </button>
                <button
                  className={`menu-item ${activeTab === 'voucher-list' ? 'active' : ''}`}
                  onClick={() => setActiveTab('voucher-list')}
                >
                  VOUCHER LIST
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="account-main">{renderContent()}</main>
        </div>
      </div>

      {/* Delivery Address Modal */}
      {showAddressModal && (
        <DeliveryAddressModal
          userId={user?.id}
          onAddressSelect={(address) => {
            setCustomerAddress({
              id: 1,
              name: 'Delivery Address',
              address: address.address,
              latitude: address.latitude,
              longitude: address.longitude,
              isDefault: true,
            })
            setShowAddressModal(false)
          }}
          onClose={() => setShowAddressModal(false)}
        />
      )}
    </MainLayout>
  )
}
