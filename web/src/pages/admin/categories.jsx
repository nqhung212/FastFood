import { useEffect, useState } from 'react'
import AdminLayout from '../../layouts/admin-layout'
import { useAdminGuard } from '../../hooks/use-admin-guard'
import { supabase } from '../../lib/supabaseClient'
import '../../assets/styles/admin-table.css'

export default function AdminCategories() {
  const { isAdmin, isLoading } = useAdminGuard()
  const [categories, setCategories] = useState([])
  const [tableLoading, setTableLoading] = useState(true)
  const [sortConfig, setSortConfig] = useState({ column: 'name', ascending: true })

  useEffect(() => {
    if (!isAdmin) return

    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name')
          .order(sortConfig.column, { ascending: sortConfig.ascending })

        if (error) throw error
        setCategories(data || [])
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setTableLoading(false)
      }
    }

    fetchCategories()
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
          <h1>Manage Categories</h1>
          <button className="btn btn-primary">Add Category</button>
        </div>

        {tableLoading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p>Loading data...</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('id')} className="sortable">
                  ID {getSortIcon('id')}
                </th>
                <th onClick={() => handleSort('name')} className="sortable">
                  Category Name {getSortIcon('name')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <tr key={category.id}>
                    <td>{category.id}</td>
                    <td>{category.name}</td>
                    <td className="actions">
                      <button className="btn-small btn-edit">Edit</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>
                    No categories found
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
