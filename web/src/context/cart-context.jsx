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

  // Save cart to Supabase when items change (for logged-in users) or localStorage (for guests)
  useEffect(() => {
    if (!cartItems || cartItems.length === 0) return

    if (user) {
      // Save to Supabase - delete old items and insert new ones
      const saveCart = async () => {
        try {
          // Delete existing cart items for this user
          await supabase.from('carts').delete().eq('user_id', user.id)

          // Insert new cart items
          const itemsToInsert = cartItems.map((item) => ({
            user_id: user.id,
            product_id: item.id,
            quantity: item.quantity,
          }))

          if (itemsToInsert.length > 0) {
            const { error } = await supabase.from('carts').insert(itemsToInsert)
            if (error) console.error('Error saving cart to Supabase', error)
          }
        } catch (err) {
          console.error('Error syncing cart to Supabase', err)
        }
      }
      saveCart()
    } else {
      // Save to localStorage for guests
      localStorage.setItem('cart_data', JSON.stringify(cartItems))
    }
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
    localStorage.removeItem('cart_data')

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
