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
          .from('carts')
          .select('id, product_id, quantity, products(id, name, price, image, description, slug)')
          .eq('user_id', user.id)
        
        if (error) throw error
        
        // Transform cart items from Supabase response + deduplicate by product_id
        const cartMap = new Map()
        
        data?.forEach((cartItem) => {
          const productId = cartItem.products.id
          
          if (cartMap.has(productId)) {
            // If product already exists, merge quantities
            const existing = cartMap.get(productId)
            existing.quantity += cartItem.quantity
          } else {
            // Add new product to map
            cartMap.set(productId, {
              id: cartItem.products.id,
              name: cartItem.products.name,
              price: cartItem.products.price,
              image: cartItem.products.image,
              description: cartItem.products.description,
              slug: cartItem.products.slug,
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
