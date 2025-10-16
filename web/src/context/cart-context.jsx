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

  const addToCart = (product) => {
    setCartItems((prev) => {
      if (prev.find((item) => item.id === product.id)) return prev
      return [...prev, { ...product, quantity: 1 }]
    })
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
        clearCart,
        isCartOpen,
        toggleCart
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
