// src/pages/customer/login.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../../layouts/home-layout'
import '../../assets/styles/auth.css'
import { useAuth } from '../../context/auth-context'
import { supabase } from '../../lib/supabaseClient'

export default function Login() {
  const { login } = useAuth()
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

      // Check if user exists in user_account
      const { data: userData, error: userError } = await supabase
        .from('user_account')
        .select('user_id, email, role, status')
        .eq('email', email)
        .single()

      if (userError || !userData) {
        throw new Error('Email not found - please register first')
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

      setMessage('✅ Login successful!')
      setTimeout(() => navigate('/'), 1000)
    } catch (err) {
      console.error('Login error:', err)
      setMessage(`❌ ${err.message}`)
      setLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="login-page">
        <h2>Login</h2>

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
          <p className={message.startsWith('❌') ? 'error-message' : 'success-message'}>
            {message}
          </p>
        )}
      </div>
    </MainLayout>
  )
}
