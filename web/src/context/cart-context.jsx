// src/context/cart-context.jsx
import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuthListener } from '../hooks/use-auth'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { user, isLoading: authLoading } = useAuthListener()

  // Load cart from database when user changes
  useEffect(() => {
    const loadCart = async () => {
      try {
        setIsLoading(true)

        if (!user || authLoading) {
          setCartItems([])
          setIsLoading(false)
          return
        }

        // Load cart items from database for this customer
        const { data, error } = await supabase
          .from('cart')
          .select(
            `
            cart_id,
            product_id,
            quantity,
            price,
            product:product_id(
              name,
              description,
              image_url,
              restaurant_id,
              restaurant:restaurant_id(name)
            )
            `
          )
          .eq('customer_id', user.id)
          .eq('status', 'active')

        if (error) throw error

        // Transform to cart item format
        const items =
          data?.map((cartItem) => ({
            cartId: cartItem.cart_id,
            productId: cartItem.product_id,
            quantity: cartItem.quantity,
            price: cartItem.price,
            name: cartItem.product?.name,
            description: cartItem.product?.description,
            image: cartItem.product?.image_url,
            restaurantId: cartItem.product?.restaurant_id,
            restaurantName: cartItem.product?.restaurant?.name,
          })) || []

        setCartItems(items)
      } catch (err) {
        console.error('Error loading cart:', err)
        setCartItems([])
      } finally {
        setIsLoading(false)
      }
    }

    loadCart()
  }, [user?.id, authLoading])

  // Add item to cart
  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      console.error('User must be logged in to add to cart')
      return
    }

    try {
      // Check if cart has items from DIFFERENT restaurant
      const currentRestaurantId = cartItems.length > 0 ? cartItems[0].restaurantId : null
      const newRestaurantId = product.restaurant_id

      if (currentRestaurantId && currentRestaurantId !== newRestaurantId) {
        // Different restaurant - show confirm dialog
        const shouldClear = window.confirm(
          `Your cart contains items from "${cartItems[0].restaurantName}".\n\nDo you want to clear your cart and add items from "${product.restaurantName}" instead?`
        )

        if (!shouldClear) {
          console.log('User cancelled switching restaurants')
          return
        }

        // User confirmed - clear existing cart
        await clearCart()
        // Note: cartItems will be empty after clearCart, so we can proceed
        setCartItems([])
      }

      // Check if item already in cart (same product)
      const existing = cartItems.find((item) => item.productId === product.id)

      if (existing) {
        // Update quantity
        const { error } = await supabase
          .from('cart')
          .update({ quantity: existing.quantity + quantity })
          .eq('cart_id', existing.cartId)

        if (error) throw error

        // Update local state
        setCartItems((prev) =>
          prev.map((item) =>
            item.cartId === existing.cartId ? { ...item, quantity: item.quantity + quantity } : item
          )
        )
      } else {
        // Insert new cart item
        const { data, error } = await supabase
          .from('cart')
          .insert({
            customer_id: user.id,
            product_id: product.id,
            quantity,
            price: product.price,
            status: 'active',
          })
          .select('cart_id')

        if (error) throw error

        // Add to local state
        const newItem = {
          cartId: data[0]?.cart_id,
          productId: product.id,
          quantity,
          price: product.price,
          name: product.name,
          description: product.description,
          image: product.image_url || product.image,
          restaurantId: product.restaurant_id,
          restaurantName: product.restaurantName,
        }

        setCartItems((prev) => [...prev, newItem])
      }
    } catch (err) {
      console.error('Error adding to cart:', err)
    }
  }

  // Update quantity
  const updateQuantity = async (cartId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartId)
      return
    }

    try {
      const { error } = await supabase.from('cart').update({ quantity }).eq('cart_id', cartId)

      if (error) throw error

      setCartItems((prev) =>
        prev.map((item) => (item.cartId === cartId ? { ...item, quantity } : item))
      )
    } catch (err) {
      console.error('Error updating quantity:', err)
    }
  }

  // Remove from cart
  const removeFromCart = async (cartId) => {
    try {
      const { error } = await supabase.from('cart').delete().eq('cart_id', cartId)

      if (error) throw error

      setCartItems((prev) => prev.filter((item) => item.cartId !== cartId))
    } catch (err) {
      console.error('Error removing from cart:', err)
    }
  }

  // Clear cart
  const clearCart = async () => {
    if (!user) return

    try {
      const { error } = await supabase.from('cart').delete().eq('customer_id', user.id)

      if (error) throw error

      setCartItems([])
    } catch (err) {
      console.error('Error clearing cart:', err)
    }
  }

  // Increment quantity
  const incrementQuantity = async (cartId) => {
    const item = cartItems.find((i) => i.cartId === cartId)
    if (item) {
      await updateQuantity(cartId, item.quantity + 1)
    }
  }

  // Decrement quantity
  const decrementQuantity = async (cartId) => {
    const item = cartItems.find((i) => i.cartId === cartId)
    if (item && item.quantity > 1) {
      await updateQuantity(cartId, item.quantity - 1)
    } else if (item && item.quantity === 1) {
      await removeFromCart(cartId)
    }
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        incrementQuantity,
        decrementQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
