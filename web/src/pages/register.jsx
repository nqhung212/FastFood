// src/pages/register.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../layouts/home-layout'
import '../assets/styles/auth.css'

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
      setMessage('Username already exists')
      return
    }

    const newUser = {
      id: Date.now(),
      ...form,
      role: 'buyer',
    }

    sessionStorage.setItem('users', JSON.stringify([...users, newUser]))
    setMessage('Registration successful!')
    setTimeout(() => navigate('/login'), 1000)
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
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <input
            name="fullname"
            placeholder="Full name"
            value={form.fullname}
            onChange={handleChange}
            required
          />
          <input
            name="phone"
            placeholder="Phone number"
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
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            required
          />
          <button type="submit">Register</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </MainLayout>
  )
}
