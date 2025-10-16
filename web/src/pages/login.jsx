// src/pages/login.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUsers } from '../hooks/use-users'
import MainLayout from '../layouts/home-layout'
import { useAuth } from '../context/auth-context'

export default function Login() {
  const { users, loading, error } = useUsers()
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    if (loading || error) return

    const user = users.find((u) => u.username === username && u.password === password)

    if (user) {
      const tokenData = {
        id: user.id,
        username: user.username,
        fullname: user.fullname,
        role: user.role,
        token: user.token, 
      };

      setTimeout(() => login(tokenData), 800);
      setMessage("Đăng nhập thành công!");
      setTimeout(() => navigate("/"), 800);
    } else {
      setMessage("Sai tài khoản hoặc mật khẩu");
    }
  };


  return (
    <MainLayout>
      <div className="login-page">
        <h2>Đăng nhập</h2>

        {loading && <p>Đang tải dữ liệu...</p>}
        {error && <p style={{ color: "red" }}>Lỗi tải dữ liệu: {error}</p>}

        <form onSubmit={handleLogin} className="login-form">
          <div>
            <label>Tên đăng nhập</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit">Đăng nhập</button>
        </form>

        {message && <p>{message}</p>}
      </div>
    </MainLayout>
  );
}