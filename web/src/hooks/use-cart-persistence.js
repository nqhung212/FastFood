import { useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

/**
 * Custom hook to load cart data from localStorage (guest) or Supabase (authenticated users)
 * @param {Object} user - Current authenticated user from Supabase Auth
 * @param {Array} cartItems - Current cart items
 * @param {Function} setCartItems - State setter for cart items
 */
export function useCartPersistence(user, cartItems, setCartItems) {
  // Load cart from localStorage for guests OR from Supabase for authenticated users
  useEffect(() => {
    let mounted = true

    const loadCart = async () => {
      try {
        if (!user) {
          // Guest user: load from localStorage
          const savedCart = localStorage.getItem('cart')
          if (mounted && savedCart) {
            try {
              setCartItems(JSON.parse(savedCart))
            } catch (err) {
              console.error('Error parsing cart from localStorage', err)
              setCartItems([])
            }
          } else if (mounted) {
            setCartItems([])
          }
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

        console.log('📦 Cart loaded from Supabase:', loadedCartItems)
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
  }, [user]) // Only depend on user, not setCartItems
}

