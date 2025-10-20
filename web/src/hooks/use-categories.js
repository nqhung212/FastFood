// src/hooks/use-categories.js
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true

    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase.from('categories').select('*')
        if (error) {
          console.error('Categories fetch error:', error)
          throw error
        }
        if (mounted) setCategories(data || [])
      } catch (err) {
        console.error('Categories error:', err)
        setError(err.message || String(err))
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchCategories()

    return () => {
      mounted = false
    }
  }, [])

  return { categories, loading, error }
}

export function useProductsByCategory(category) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!category) return
    let mounted = true

    const fetchProducts = async () => {
      try {
        // Step 1: Get all categories to find matching one
        const { data: allCategories, error: catError } = await supabase
          .from('categories')
          .select('id, name')

        if (catError) {
          console.error('❌ Fetch categories error:', catError)
          throw catError
        }

        // Find category by case-insensitive name match
        const matchedCategory = allCategories?.find(
          (cat) => cat.name.toLowerCase() === category.toLowerCase()
        )

        if (!matchedCategory) {
          throw new Error(`Category "${category}" not found. Available: ${allCategories?.map(c => c.name).join(', ') || 'none'}`)
        }

        // Step 2: Fetch products by category_id
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', matchedCategory.id)

        if (productsError) {
          console.error('Products fetch error:', productsError)
          throw productsError
        }
        if (mounted) setProducts(productsData || [])
      } catch (err) {
        console.error('useProductsByCategory error:', err)
        setError(err.message || String(err))
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchProducts()

    return () => {
      mounted = false
    }
  }, [category])

  return { products, loading, error }
}
