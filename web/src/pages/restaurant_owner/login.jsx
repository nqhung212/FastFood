import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../assets/styles/auth.css'
import { supabase } from '../../lib/supabaseClient'

export default function RestaurantLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      // Validate input
      if (!email || !password) {
        throw new Error('Email and password are required')
      }

      // Check if user exists in user_account and has restaurant_owner role
      const { data: userData, error: userError } = await supabase
        .from('user_account')
        .select('user_id, email, role, status')
        .eq('email', email)
        .eq('role', 'restaurant_owner')
        .single()

      if (userError || !userData) {
        throw new Error('Email not found or not a restaurant owner - please register first')
      }

      if (!userData.status) {
        throw new Error('Account is inactive')
      }

      // Login using Supabase Auth
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        console.error('Auth error:', authError)
        throw new Error('Invalid password')
      }

      // Store user info in localStorage
      localStorage.setItem('restaurantOwnerId', userData.user_id)
      localStorage.setItem('restaurantOwnerEmail', email)

      setMessage('✅ Login successful!')
      setTimeout(() => navigate('/restaurant/dashboard'), 1000)
    } catch (err) {
      console.error('Login error:', err)
      setMessage(`❌ ${err.message}`)
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <h2>Restaurant Owner Login</h2>

      <form onSubmit={handleLogin} className="login-form">
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {message && (
        <p className={message.startsWith('❌') ? 'error-message' : 'success-message'}>{message}</p>
      )}
    </div>
  )
}
