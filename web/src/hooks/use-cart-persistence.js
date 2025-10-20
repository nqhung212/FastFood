import { useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

/**
 * Custom hook to persist cart data
 * Loads cart from Supabase (if user logged in) or localStorage (if guest)
 * Saves cart to Supabase or localStorage based on auth state
 * @param {Object} user - Current authenticated user from Supabase Auth
 * @param {Array} cartItems - Current cart items
 * @param {Function} setCartItems - State setter for cart items
 */
export function useCartPersistence(user, cartItems, setCartItems) {
  // Load cart: if user logged in, load from Supabase; else from localStorage
  useEffect(() => {
    let mounted = true

    const loadCart = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('carts')
            .select('*')
            .eq('user_id', user.id)
          if (error) throw error
          if (mounted) setCartItems(data || [])
        } catch (err) {
          console.error('Error loading cart from Supabase', err)
          // Fallback to localStorage on error
          const savedCart = localStorage.getItem('cart_data')
          if (savedCart && mounted) setCartItems(JSON.parse(savedCart))
        }
      } else {
        const savedCart = localStorage.getItem('cart_data')
        if (savedCart && mounted) setCartItems(JSON.parse(savedCart))
      }
    }

    loadCart()

    return () => {
      mounted = false
    }
  }, [user, setCartItems])

  // Note: Cart persistence on Supabase is handled by CartProvider
  // This hook only loads existing cart items
}
