// src/context/cart-context.jsx
import { createContext, useContext, useState, useEffect } from 'react'
import { CART_KEY } from '../constants'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    const savedCart = localStorage.getItem(CART_KEY)
    if (savedCart) setCartItems(JSON.parse(savedCart))
  }, [])

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems))
  }, [cartItems])

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
    localStorage.removeItem(CART_KEY)
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
