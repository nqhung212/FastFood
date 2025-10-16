// src/context/auth-context.jsx
import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AUTH_KEY } from '../constants'
import { useCart } from './cart-context'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const { clearCart } = useCart()

  useEffect(() => {
    const savedUser = localStorage.getItem(AUTH_KEY)
    if (savedUser) setUser(JSON.parse(savedUser))
  }, [])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem(AUTH_KEY, JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(AUTH_KEY)
    clearCart()
    navigate('/')
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
