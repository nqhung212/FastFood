import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import '../../assets/styles/auth.css'

export default function RestaurantRegister() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    restaurantName: '',
  })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (!form.email) {
        throw new Error('Email is required')
      }

      if (!form.password) {
        throw new Error('Password is required')
      }

      if (!form.restaurantName) {
        throw new Error('Restaurant name is required')
      }

      // Sign up with Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      })

      if (signUpError) {
        throw signUpError
      }

      if (!data.user) {
        throw new Error('Registration failed')
      }

      const userId = data.user.id

      // Create user_account record
      const { error: userError } = await supabase.from('user_account').insert([
        {
          user_id: userId,
          email: form.email,
          password_hash: '', // Not used, Supabase Auth handles it
          full_name: form.fullName || '',
          phone: form.phone || '',
          role: 'restaurant_owner',
          status: true,
        },
      ])

      if (userError) {
        console.error('User account error:', userError)
        throw userError
      }

      // Create restaurant record
      const { error: restaurantError } = await supabase.from('restaurant').insert([
        {
          owner_id: userId,
          name: form.restaurantName,
          status: 'inactive',
        },
      ])

      if (restaurantError) {
        console.error('Restaurant error:', restaurantError)
        throw restaurantError
      }

      setMessage(
        '✅ Restaurant registration successful! Please login with your email and password.'
      )
      setTimeout(() => navigate('/restaurant/login'), 2000)
    } catch (err) {
      console.error('Registration error:', err)
      setMessage(`❌ ${err.message}`)
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <h2>Register your restaurant</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          name="email"
          placeholder="Email *"
          value={form.email}
          onChange={handleChange}
          required
          disabled={loading}
        />
        <input
          type="password"
          name="password"
          placeholder="Password *"
          value={form.password}
          onChange={handleChange}
          required
          disabled={loading}
        />
        <input
          name="fullName"
          placeholder="Full name"
          value={form.fullName}
          onChange={handleChange}
          disabled={loading}
        />
        <input
          name="phone"
          placeholder="Phone number"
          value={form.phone}
          onChange={handleChange}
          disabled={loading}
        />
        <input
          name="restaurantName"
          placeholder="Restaurant name *"
          value={form.restaurantName}
          onChange={handleChange}
          required
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register Restaurant'}
        </button>
      </form>
      {message && (
        <p className={message.startsWith('❌') ? 'error-message' : 'success-message'}>{message}</p>
      )}
    </div>
  )
}
