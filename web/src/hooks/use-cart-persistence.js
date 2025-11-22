import { useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

/**
 * Custom hook to load cart data from Supabase
 * Only loads cart for authenticated users
 * @param {Object} user - Current authenticated user from Supabase Auth
 * @param {Array} cartItems - Current cart items
 * @param {Function} setCartItems - State setter for cart items
 */
export function useCartPersistence(user, cartItems, setCartItems) {
  // Load cart from Supabase for authenticated users only
  useEffect(() => {
    let mounted = true

    const loadCart = async () => {
      if (!user) {
        // No user = empty cart (no guest cart)
        if (mounted) setCartItems([])
        return
      }

      try {
        // Fetch cart items with product details
        const { data, error } = await supabase
          .from('cart')
          .select('product_id, quantity, price, products(id, name, price, image_url, description)')
          .eq('customer_id', user.id)
        
        if (error) throw error
        
        // Transform cart items from Supabase response + deduplicate by product_id
        const cartMap = new Map()
        
        data?.forEach((cartItem) => {
          const productId = cartItem.product_id
          
          if (cartMap.has(productId)) {
            // If product already exists, merge quantities
            const existing = cartMap.get(productId)
            existing.quantity += cartItem.quantity
          } else {
            // Add new product to map
            cartMap.set(productId, {
              id: cartItem.product_id,
              name: cartItem.products.name,
              price: cartItem.products.price,
              image: cartItem.products.image_url,
              description: cartItem.products.description,
              quantity: cartItem.quantity,
            })
          }
        })
        
        const cartItems = Array.from(cartMap.values())
        
        if (mounted) setCartItems(cartItems)
      } catch (err) {
        console.error('Error loading cart from Supabase', err)
        if (mounted) setCartItems([])
      }
    }

    loadCart()

    return () => {
      mounted = false
    }
  }, [user, setCartItems])
}
