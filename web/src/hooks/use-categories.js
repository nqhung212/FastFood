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
        // Step 1: Get all active restaurants
        const { data: activeRestaurants, error: restError } = await supabase
          .from('restaurant')
          .select('restaurant_id')
          .eq('status', 'active')

        if (restError) {
          console.error('Restaurants fetch error:', restError)
          throw restError
        }

        const activeRestaurantIds = activeRestaurants?.map((r) => r.restaurant_id) || []

        // Step 2: Fetch products only from active restaurants
        const { data: products, error: productsError } = await supabase
          .from('product')
          .select('category_id')
          .in('restaurant_id', activeRestaurantIds)

        if (productsError) {
          console.error('Products fetch error:', productsError)
          throw productsError
        }

        // Get unique category IDs that have products from active restaurants
        const categoryIds = new Set()
        products?.forEach((product) => {
          if (product.category_id) {
            categoryIds.add(product.category_id)
          }
        })

        // Step 3: Fetch only categories that have products from active restaurants
        const { data: categories, error: catError } = await supabase
          .from('category')
          .select('*')
          .in('category_id', Array.from(categoryIds))

        if (catError) {
          console.error('Categories fetch error:', catError)
          throw catError
        }

        // Remove duplicate categories by name (keep first occurrence)
        const uniqueCategories = []
        const seenNames = new Set()

        categories?.forEach((cat) => {
          const categoryName = cat.name?.toLowerCase()
          if (categoryName && !seenNames.has(categoryName)) {
            seenNames.add(categoryName)
            uniqueCategories.push(cat)
          }
        })

        if (mounted) setCategories(uniqueCategories)
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
          .from('category')
          .select('category_id, name')

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
          .from('product')
          .select('*')
          .eq('category_id', matchedCategory.category_id)

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
