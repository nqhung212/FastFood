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
    if (!user) {
      // Guest user: save to localStorage
      localStorage.setItem('cart', JSON.stringify(cartItems))
      return
    }

    // Authenticated user: save to localStorage AND Supabase
    localStorage.setItem('cart', JSON.stringify(cartItems))

    // Debounce save to avoid too many requests
    const timer = setTimeout(() => {
      const saveCart = async () => {
        try {
          // Delete all existing cart items for this user
          const { error: deleteError } = await supabase
            .from('cart')
            .delete()
            .eq('customer_id', user.id)

          if (deleteError) throw deleteError

          // Insert new cart items (only if cart is not empty)
          if (cartItems && cartItems.length > 0) {
            const itemsToInsert = cartItems.map((item) => ({
              customer_id: user.id,
              product_id: item.id,
              quantity: item.quantity,
              price: item.price || 0,
            }))

            const { error: insertError } = await supabase.from('cart').insert(itemsToInsert)

            if (insertError) throw insertError
            console.log('✅ Cart items saved to Supabase')
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
    console.log('🛒 addToCart called with product:', product)
    setCartItems((prev) => {
      // Find existing item by product ID AND restaurant ID (to avoid duplicates across restaurants)
      const existingItem = prev.find(
        (item) => item.id === product.id && item.restaurant_id === product.restaurant_id
      )

      if (existingItem) {
        console.log(
          '➕ Item already exists, increasing quantity from',
          existingItem.quantity,
          'to',
          existingItem.quantity + quantity
        )
        return prev.map((item) =>
          item.id === product.id && item.restaurant_id === product.restaurant_id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }

      const newItem = { ...product, quantity }
      console.log('➕ New cart item created:', newItem)
      return [...prev, newItem]
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
        .from('cart')
        .delete()
        .eq('customer_id', user.id)
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
