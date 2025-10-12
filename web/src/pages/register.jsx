import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: '',
    password: '',
    fullname: '',
    phone: '',
    email: '',
    address: '',
  })
  const [message, setMessage] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    const users = JSON.parse(sessionStorage.getItem('users')) || []
    const exists = users.some((u) => u.username === form.username)

    if (exists) {
      setMessage('Tên đăng nhập đã tồn tại')
      return
    }

    const newUser = {
      id: Date.now(),
      username: form.username,
      password: form.password,
      fullname: form.fullname,
      phone: form.phone,
      email: form.email,
      address: form.address,
      role: 'buyer',
    }

    sessionStorage.setItem('users', JSON.stringify([...users, newUser]))
    setMessage('Đăng ký thành công!')
    setTimeout(() => navigate('/login'), 1200)
  }

  return (
    <div className="auth-page">
      <h2>Đăng ký tài khoản</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          name="username"
          placeholder="Tên đăng nhập"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          name="fullname"
          placeholder="Họ và tên"
          value={form.fullname}
          onChange={handleChange}
          required
        />
        <input
          name="phone"
          placeholder="Số điện thoại"
          value={form.phone}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="address"
          placeholder="Địa chỉ"
          value={form.address}
          onChange={handleChange}
          required
        />
        <button type="submit">Đăng ký</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}
