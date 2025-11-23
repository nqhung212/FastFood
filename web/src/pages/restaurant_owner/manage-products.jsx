import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import RestaurantLayout from '../../layouts/restaurant-layout'
import { supabase } from '../../lib/supabaseClient'
import '../../assets/styles/restaurant-manage.css'

export default function ManageProducts() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image_url: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
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

      // Get products
      const { data: productsData, error: productsError } = await supabase
        .from('product')
        .select('*')
        .eq('restaurant_id', restaurant.restaurant_id)
        .order('created_at', { ascending: false })

      if (productsError) throw productsError
      setProducts(productsData || [])

      // Get categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('category')
        .select('*')
        .eq('restaurant_id', restaurant.restaurant_id)
        .order('name', { ascending: true })

      if (categoriesError) throw categoriesError
      setCategories(categoriesData || [])
    } catch (err) {
      console.error('Error fetching data:', err)
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
        throw new Error('Product name is required')
      }
      if (!form.price || isNaN(form.price)) {
        throw new Error('Valid price is required')
      }
      if (!form.category_id) {
        throw new Error('Category is required')
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
          .from('product')
          .update({
            name: form.name,
            description: form.description,
            price: parseFloat(form.price),
            category_id: form.category_id,
            image_url: form.image_url,
          })
          .eq('product_id', editingId)

        if (error) throw error
        setMessage('✅ Product updated successfully')
      } else {
        // Create
        const { error } = await supabase.from('product').insert([
          {
            restaurant_id: restaurant.restaurant_id,
            category_id: form.category_id,
            name: form.name,
            description: form.description,
            price: parseFloat(form.price),
            image_url: form.image_url,
            status: true,
          },
        ])

        if (error) throw error
        setMessage('✅ Product created successfully')
      }

      setForm({ name: '', description: '', price: '', category_id: '', image_url: '' })
      setEditingId(null)
      setShowForm(false)
      fetchData()
    } catch (err) {
      console.error('Error:', err)
      setMessage(`❌ ${err.message}`)
    }
  }

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category_id: product.category_id,
      image_url: product.image_url,
    })
    setEditingId(product.product_id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const { error } = await supabase.from('product').delete().eq('product_id', id)

      if (error) throw error
      setMessage('✅ Product deleted successfully')
      fetchData()
    } catch (err) {
      console.error('Error:', err)
      setMessage(`❌ ${err.message}`)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setForm({ name: '', description: '', price: '', category_id: '', image_url: '' })
  }

  if (loading) {
    return (
      <RestaurantLayout>
        <div className="manage-page">
          <p>Loading products...</p>
        </div>
      </RestaurantLayout>
    )
  }

  return (
    <RestaurantLayout>
      <div className="manage-page">
        <div className="manage-header">
          <h1>Manage Products</h1>
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
          {showForm ? 'Cancel' : '+ Add New Product'}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className="manage-form">
            <input
              type="text"
              name="name"
              placeholder="Product name *"
              value={form.name}
              onChange={handleChange}
              required
            />
            <textarea
              name="description"
              placeholder="Product description"
              value={form.description}
              onChange={handleChange}
              rows={3}
            />
            <input
              type="number"
              name="price"
              placeholder="Price *"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              required
            />
            <select name="category_id" value={form.category_id} onChange={handleChange} required>
              <option value="">Select Category *</option>
              {categories.map((cat) => (
                <option key={cat.category_id} value={cat.category_id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="image_url"
              placeholder="Image URL"
              value={form.image_url}
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
          {products.length === 0 ? (
            <p>No products yet. Create your first product!</p>
          ) : (
            products.map((product) => (
              <div key={product.product_id} className="manage-item">
                <div className="item-info">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <p>
                    <strong>Price:</strong> {parseFloat(product.price).toLocaleString()}₫
                  </p>
                  <p>
                    <strong>Category:</strong>{' '}
                    {categories.find((c) => c.category_id === product.category_id)?.name}
                  </p>
                  {product.image_url && (
                    <img src={product.image_url} alt={product.name} width="100" />
                  )}
                </div>
                <div className="item-actions">
                  <button onClick={() => handleEdit(product)} className="btn-edit">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(product.product_id)} className="btn-delete">
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
