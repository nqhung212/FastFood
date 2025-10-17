// src/hooks/use-categories.js
import { useEffect, useState } from 'react'
import { ENDPOINTS } from '../constants'

export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetch(ENDPOINTS.CATEGORIES)
      .then((res) => {
        if (!res.ok) throw new Error('Lỗi tải danh mục')
        return res.json()
      })
      .then((data) => setCategories(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return { categories, loading, error }
}

export function useProductsByCategory(category) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!category) return

    setLoading(true)
    fetch(ENDPOINTS.PRODUCTS)
      .then((res) => {
        if (!res.ok) throw new Error('Lỗi tải dữ liệu sản phẩm theo danh mục')
        return res.json()
      })
      .then((data) => {
        const filtered = data.filter(
          (p) => p.categories?.toLowerCase() === category.toLowerCase()
        )
        setProducts(filtered)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [category])

  return { products, loading, error }
}
