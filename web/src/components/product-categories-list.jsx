// src/components/product-categories-list.jsx
import { useMemo, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function ProductCategoriesList({ category: propCategory }) {
  const { category: paramCategory } = useParams()
  const category = propCategory || paramCategory
  const [products, setProducts] = useState([])

  useEffect(() => {
    let mounted = true

    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase.from('product').select('*')
        if (error) throw error
        if (mounted) setProducts(data || [])
      } catch (err) {
        console.error('Error calling Supabase:', err)
      }
    }

    fetchProducts()

    return () => {
      mounted = false
    }
  }, [])

  const filteredProducts = useMemo(() => {
    return products.filter((p) => p.categories?.toLowerCase() === category?.toLowerCase())
  }, [products, category])

  return (
    <div className="categories-container">
      <h2 className="categories-title">{category}</h2>
      <div className="categories-grid">
        {filteredProducts.map((p) => (
          <Link key={p.id} to={`/product/${p.slug}`} className="product-card">
            <img src={`/images/${p.image}`} width={150} alt={p.name} />
            <div className="product-info">
              <h3 className="product-name">{p.name}</h3>
              <p className="product-description">{p.description}</p>
              <p className="product-price">
                <strong>{p.price.toLocaleString()}₫</strong>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
