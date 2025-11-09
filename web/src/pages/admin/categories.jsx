import { useEffect, useState } from 'react'
import AdminLayout from '../../layouts/admin-layout'
import { useAdminGuard } from '../../hooks/use-admin-guard'
import { supabase } from '../../lib/supabaseClient'
import '../../assets/styles/admin-table.css'

export default function AdminCategories() {
  const { isAdmin, isLoading } = useAdminGuard()
  const [categories, setCategories] = useState([])
  const [tableLoading, setTableLoading] = useState(true)

  useEffect(() => {
    if (!isAdmin) return

    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase.from('categories').select('id, name').order('name')

        if (error) throw error
        setCategories(data || [])
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setTableLoading(false)
      }
    }

    fetchCategories()
  }, [isAdmin])

  if (isLoading) {
    return (
      <AdminLayout>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <p>Đang tải...</p>
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
          <h1>📂 Quản lý Danh Mục</h1>
          <button className="btn btn-primary">➕ Thêm Danh Mục</button>
        </div>

        {tableLoading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên Danh Mục</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <tr key={category.id}>
                    <td>{category.id}</td>
                    <td>{category.name}</td>
                    <td className="actions">
                      <button className="btn-small btn-view">👁️ Xem</button>
                      <button className="btn-small btn-edit">✏️ Sửa</button>
                      <button className="btn-small btn-delete">🗑️ Xóa</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>
                    Không có danh mục nào
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
