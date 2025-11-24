import { useEffect, useState } from 'react'
import AdminLayout from '../../layouts/admin-layout'
import { useAdminGuard } from '../../hooks/use-admin-guard'
import { supabase } from '../../lib/supabaseClient'
import '../../assets/styles/admin-table.css'

export default function AdminProducts() {
  const { isAdmin, isLoading } = useAdminGuard()
  const [products, setProducts] = useState([])
  const [tableLoading, setTableLoading] = useState(true)
  const [sortConfig, setSortConfig] = useState({ column: 'name', ascending: true })

  useEffect(() => {
    if (!isAdmin) return

    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('product')
          .select('product_id, name, price, category_id')
          .order(sortConfig.column, { ascending: sortConfig.ascending })

        if (error) throw error
        setProducts(data || [])
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setTableLoading(false)
      }
    }

    fetchProducts()
  }, [isAdmin, sortConfig])

  const handleSort = (column) => {
    setSortConfig((prev) => ({
      column,
      ascending: prev.column === column ? !prev.ascending : true,
    }))
  }

  const getSortIcon = (column) => {
    if (sortConfig.column !== column) return '⇅'
    return sortConfig.ascending ? '↑' : '↓'
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <p>Loading...</p>
        </div>
      </AdminLayout>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="page-header">
          <h1>Manage Products</h1>
          <button className="btn btn-primary">Add Product</button>
        </div>

        {tableLoading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p>Loading data...</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('name')} className="sortable">
                  Product Name {getSortIcon('name')}
                </th>
                <th onClick={() => handleSort('price')} className="sortable">
                  Price {getSortIcon('price')}
                </th>
                <th onClick={() => handleSort('category_id')} className="sortable">
                  Category {getSortIcon('category_id')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.product_id}>
                    <td>{product.name}</td>
                    <td>{product.price.toLocaleString()}₫</td>
                    <td>{product.category_id.slice(0, 8)}...</td>
                    <td className="actions">
                      <button className="btn-small btn-edit">Edit</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  )
}
