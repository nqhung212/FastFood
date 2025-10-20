// src/pages/register.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../layouts/home-layout'
import { supabase } from '../lib/supabaseClient'
import '../assets/styles/auth.css'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: '',
    password: '',
    fullname: '',
    phone: '',
    address: '',
    username: '',
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

    // Validation
    if (!form.email || !form.password || !form.fullname || !form.username) {
      setMessage('❌ Email, password, username, and full name are required')
      setLoading(false)
      return
    }

    if (form.password.length < 6) {
      setMessage('❌ Password must be at least 6 characters')
      setLoading(false)
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      setMessage('❌ Please enter a valid email address')
      setLoading(false)
      return
    }

    try {
      // Step 1: Đăng ký tài khoản trong Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      })

      if (authError) {
        console.error('Auth error:', authError)
        throw authError
      }
      if (!authData.user) throw new Error('Sign up failed - no user returned')

      const authUserId = authData.user.id

      // Step 2: Lưu thông tin user vào bảng users
      const { error: insertError } = await supabase.from('users').insert([
        {
          id: authUserId,
          email: form.email,
          username: form.username,
          fullname: form.fullname,
          phone: form.phone,
          address: form.address,
          role: 'buyer',
          password: form.password,
        },
      ])

      if (insertError) {
        console.error('Insert error:', insertError)
        throw insertError
      }

      setMessage('✅ Registration successful! Redirecting to login...')
      setTimeout(() => navigate('/login'), 1500)
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
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <input
            name="fullname"
            placeholder="Full name"
            value={form.fullname}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <input
            name="phone"
            placeholder="Phone number"
            value={form.phone}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            required
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
