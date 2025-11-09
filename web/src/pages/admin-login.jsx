import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import '../assets/styles/auth.css'

export default function AdminLogin() {
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
      // Query users table để check username + password
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, username, role')
        .eq('username', username)
        .eq('password', password)
        .single()

      if (userError || !userData) {
        throw new Error('Invalid username or password')
      }

      // Check role
      if (userData.role !== 'admin') {
        throw new Error('Only admin users can access this page')
      }

      // Lưu admin session vào localStorage
      localStorage.setItem(
        'adminSession',
        JSON.stringify({
          id: userData.id,
          username: userData.username,
          role: userData.role,
          loginTime: new Date().toISOString(),
        })
      )

      setMessage('✅ Login successful!')
      setTimeout(() => navigate('/admin'), 1000)
    } catch (err) {
      console.error('Admin login error:', err)
      setMessage(`❌ ${err.message}`)
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <div
        style={{
          background: 'white',
          padding: '40px',
          borderRadius: '8px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          width: '100%',
          maxWidth: '400px',
        }}
      >
        <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>🔧 Admin Login</h2>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '15px' }}>
            <label
              style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: '500' }}
            >
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label
              style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: '500' }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {message && (
          <p
            style={{
              marginTop: '15px',
              padding: '10px',
              borderRadius: '4px',
              textAlign: 'center',
              background: message.startsWith('❌') ? '#fee' : '#efe',
              color: message.startsWith('❌') ? '#c33' : '#3c3',
              fontSize: '14px',
            }}
          >
            {message}
          </p>
        )}

        <div
          style={{
            marginTop: '20px',
            paddingTop: '20px',
            borderTop: '1px solid #eee',
            textAlign: 'center',
          }}
        >
          <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>Not an admin?</p>
          <a href="/login" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '500' }}>
            Go to user login →
          </a>
        </div>
      </div>
    </div>
  )
}
