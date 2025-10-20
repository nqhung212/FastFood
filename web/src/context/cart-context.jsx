// src/context/cart-context.jsx
import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuthListener } from '../hooks/use-auth'
import { useCartPersistence } from '../hooks/use-cart-persistence'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { user } = useAuthListener()

  // Load cart using custom hook
  useCartPersistence(user, cartItems, setCartItems)

  // Save cart to Supabase when items change (logged-in users only)
  useEffect(() => {
    if (!user) return // Don't save if user is not logged in

    // Debounce save to avoid too many requests
    const timer = setTimeout(() => {
      const saveCart = async () => {
        try {
          // Delete all existing cart items for this user
          const { error: deleteError } = await supabase
            .from('carts')
            .delete()
            .eq('user_id', user.id)

          if (deleteError) throw deleteError

          // Insert new cart items (only if cart is not empty)
          if (cartItems && cartItems.length > 0) {
            const itemsToInsert = cartItems.map((item) => ({
              user_id: user.id,
              product_id: item.id,
              quantity: item.quantity,
            }))

            const { error: insertError } = await supabase.from('carts').insert(itemsToInsert)

            if (insertError) throw insertError
          }
        } catch (err) {
          console.error('Error syncing cart to Supabase', err)
        }
      }
      saveCart()
    }, 500) // Debounce 500ms to avoid rapid requests

    return () => clearTimeout(timer)
  }, [cartItems, user])

  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id)
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        )
      }
      return [...prev, { ...product, quantity }]
    })
  }

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const incrementQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
    )
  }

  const decrementQuantity = (id) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            if (item.quantity <= 1) {
              return null
            }
            return { ...item, quantity: item.quantity - 1 }
          }
          return item
        })
        .filter(Boolean)
    )
  }

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  const toggleCart = () => setIsCartOpen((prev) => !prev)

  const clearCart = () => {
    setCartItems([])

    // if user logged in, remove all cart items in Supabase
    if (user) {
      supabase
        .from('carts')
        .delete()
        .eq('user_id', user.id)
        .then(({ error }) => {
          if (error) console.error('Error clearing cart in Supabase', error)
        })
    }
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        incrementQuantity,
        decrementQuantity,
        clearCart,
        isCartOpen,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
