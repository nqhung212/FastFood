// src/context/auth-context.jsx
import { createContext, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuthListener } from '../hooks/use-auth'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const { user } = useAuthListener()
  const navigate = useNavigate()

  // login using Supabase Auth (expects email as identifier)
  const login = async ({ email, password } = {}) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      // User state will be updated automatically via useAuthListener hook
      return { user: data.user }
    } catch (err) {
      console.error('Login error', err)
      throw err
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error('Sign out error', err)
    }
    // User state will be updated automatically via useAuthListener hook
    // Cart will react to auth change (CartProvider listens to user)
    navigate('/')
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
