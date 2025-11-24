import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import RestaurantLayout from '../../layouts/restaurant-layout'
import { supabase } from '../../lib/supabaseClient'
import '../../assets/styles/restaurant-manage.css'

export default function ManageCategories() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({
    name: '',
    icon_url: '',
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
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

      // Get categories
      const { data, error } = await supabase
        .from('category')
        .select('*')
        .eq('restaurant_id', restaurant.restaurant_id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setCategories(data || [])
    } catch (err) {
      console.error('Error fetching categories:', err)
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
        throw new Error('Category name is required')
      }

      const ownerId = localStorage.getItem('restaurantOwnerId')
      const { data: restaurant } = await supabase
        .from('restaurant')
        .select('restaurant_id')
        .eq('owner_id', ownerId)
        .single()

      if (editingId) {
        // Update
        const { error } = await supabase
          .from('category')
          .update({
            name: form.name,
            icon_url: form.icon_url,
          })
          .eq('category_id', editingId)

        if (error) throw error
        setMessage('✅ Category updated successfully')
      } else {
        // Create
        const { error } = await supabase.from('category').insert([
          {
            restaurant_id: restaurant.restaurant_id,
            name: form.name,
            icon_url: form.icon_url,
            status: true,
          },
        ])

        if (error) throw error
        setMessage('✅ Category created successfully')
      }

      setForm({ name: '', icon_url: '' })
      setEditingId(null)
      setShowForm(false)
      fetchCategories()
    } catch (err) {
      console.error('Error:', err)
      setMessage(`❌ ${err.message}`)
    }
  }

  const handleEdit = (category) => {
    setForm({ name: category.name, icon_url: category.icon_url })
    setEditingId(category.category_id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return

    try {
      const { error } = await supabase.from('category').delete().eq('category_id', id)

      if (error) throw error
      setMessage('✅ Category deleted successfully')
      fetchCategories()
    } catch (err) {
      console.error('Error:', err)
      setMessage(`❌ ${err.message}`)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setForm({ name: '', icon_url: '' })
  }

  if (loading) {
    return (
      <RestaurantLayout>
        <div className="manage-page">
          <p>Loading categories...</p>
        </div>
      </RestaurantLayout>
    )
  }

  return (
    <RestaurantLayout>
      <div className="manage-page">
        <div className="manage-header">
          <h1>Manage Categories</h1>
          <Link to="/restaurant/dashboard" className="btn-back">
            ← Back to Dashboard
          </Link>
        </div>

        {message && (
          <p className={message.startsWith('❌') ? 'error-message' : 'success-message'}>
            {message}
          </p>
        )}

        <button onClick={() => setShowForm(!showForm)} className="btn-add">
          {showForm ? 'Cancel' : '+ Add New Category'}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className="manage-form">
            <input
              type="text"
              name="name"
              placeholder="Category name *"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="icon_url"
              placeholder="Icon URL"
              value={form.icon_url}
              onChange={handleChange}
            />
            <div className="form-buttons">
              <button type="submit" className="btn-submit">
                {editingId ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={handleCancel} className="btn-cancel">
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="manage-list">
          {categories.length === 0 ? (
            <p>No categories yet. Create your first category!</p>
          ) : (
            categories.map((cat) => (
              <div key={cat.category_id} className="manage-item">
                <div className="item-info">
                  <h3>{cat.name}</h3>
                  {cat.icon_url && <img src={cat.icon_url} alt={cat.name} width="50" />}
                  <p>Created: {new Date(cat.created_at).toLocaleDateString()}</p>
                </div>
                <div className="item-actions">
                  <button onClick={() => handleEdit(cat)} className="btn-edit">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(cat.category_id)} className="btn-delete">
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </RestaurantLayout>
  )
}
