import { useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

/**
 * Custom hook to load cart data from localStorage (guest) or Supabase (authenticated users)
 * @param {Object} user - Current authenticated user from Supabase Auth
 * @param {Array} cartItems - Current cart items
 * @param {Function} setCartItems - State setter for cart items
 */
export function useCartPersistence(user, isLoading, cartItems, setCartItems) {
  // Load cart from Supabase for authenticated users ONLY
  // Wait until auth is ready (isLoading = false) before loading cart
  useEffect(() => {
    let mounted = true

    const loadCart = async () => {
      try {
        // Don't load if still checking auth status
        if (isLoading) return

        if (!user) {
          // Not logged in - empty cart
          if (mounted) setCartItems([])
          return
        }

        // Authenticated user: load from Supabase
        const { data, error } = await supabase
          .from('cart')
          .select('product_id, quantity, price, product(restaurant_id, name, description, image_url)')
          .eq('customer_id', user.id)

        if (error) throw error

        // Transform cart items from Supabase response
        const loadedCartItems = data?.map((cartItem) => ({
          id: cartItem.product_id,
          quantity: cartItem.quantity,
          price: cartItem.price,
          restaurant_id: cartItem.product?.restaurant_id,
          name: cartItem.product?.name,
          description: cartItem.product?.description,
          image: cartItem.product?.image_url,
        })) || []

        if (mounted) setCartItems(loadedCartItems)
      } catch (err) {
        console.error('Error loading cart', err)
        if (mounted) setCartItems([])
      }
    }

    loadCart()

    return () => {
      mounted = false
    }
  }, [user?.id, isLoading])
}

