// src/context/auth-context.jsx
import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const login = (userData) => {
    setUser(userData)
  }

  const logout = () => {
    setUser(null)
    //thêm chức năng gì sau khi logout thì mình thêm ở đây
    localStorage.removeItem('user')
    localStorage.removeItem('cart')
    window.location.reload()
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
