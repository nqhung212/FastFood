// src/pages/customer/register.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../../layouts/home-layout'
import { supabase } from '../../lib/supabaseClient'
import '../../assets/styles/auth.css'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
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
          role: 'customer',
          status: true,
        },
      ])

      if (userError) {
        console.error('User account error:', userError)
        throw userError
      }

      // Create customer record
      const { error: customerError } = await supabase.from('customer').insert([
        {
          customer_id: userId,
          phone: form.phone || '',
          default_address: null,
        },
      ])

      if (customerError) {
        console.error('Customer error:', customerError)
        // Don't throw here, user is already created
      }

      setMessage('✅ Registration successful! Please login with your email and password.')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      console.error('Registration error:', err)
      setMessage(`❌ ${err.message}`)
      setLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="auth-page">
        <h2>Create an account</h2>
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
          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        {message && (
          <p className={message.startsWith('❌') ? 'error-message' : 'success-message'}>
            {message}
          </p>
        )}
      </div>
    </MainLayout>
  )
}
