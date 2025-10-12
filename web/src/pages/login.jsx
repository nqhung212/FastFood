import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useUsers } from "../hooks/use-users"

export default function Login() {
  const { users, loading, error } = useUsers()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    if (loading || error) return

    const user = users.find(
      (u) => u.username === username && u.password === password
    )

    if (user) {
      sessionStorage.setItem("user", JSON.stringify(user))
      setMessage("Đăng nhập thành công!")
      setTimeout(() => navigate("/"), 1000)
    } else {
      setMessage("Sai tài khoản hoặc mật khẩu")
    }
  }

  return (
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
  )
}
