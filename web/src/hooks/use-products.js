//hooks/use-products.js
import { useEffect, useState } from 'react'
import { ENDPOINTS } from '../constants'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(ENDPOINTS.PRODUCTS)
      .then((res) => {
        if (!res.ok) throw new Error('Lỗi tải dữ liệu sản phẩm')
        return res.json()
      })
      .then((data) => setProducts(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return { products, loading, error }
}
