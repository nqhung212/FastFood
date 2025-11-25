import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import RestaurantLayout from '../../layouts/restaurant-layout'
import { supabase } from '../../lib/supabaseClient'
import '../../assets/styles/restaurant-manage.css'

export default function RestaurantInfo() {
  const navigate = useNavigate()
  const [restaurant, setRestaurant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
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
                />
              </div>
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
      </div>
    </RestaurantLayout>
  )
}
