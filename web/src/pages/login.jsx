// src/pages/login.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../layouts/home-layout'
import '../assets/styles/auth.css'
import { useAuth } from '../context/auth-context'
import { supabase } from '../lib/supabaseClient'

export default function Login() {
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      // Step 1: Query bảng user_account để tìm email theo email hoặc tìm user đã tồn tại
      const { data: userData, error: userError } = await supabase
        .from('user_account')
        .select('email')
        .eq('email', username)
        .single()

      if (userError || !userData) {
        throw new Error('User not found')
      }

      const { email } = userData

      // Step 2: Login sử dụng Supabase Auth với email và password
      await login({ email, password })

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
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
