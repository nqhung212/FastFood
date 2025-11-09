import { useEffect, useState } from 'react'
import AdminLayout from '../../layouts/admin-layout'
import { useAdminGuard } from '../../hooks/use-admin-guard'
import { supabase } from '../../lib/supabaseClient'
import '../../assets/styles/admin-table.css'

export default function AdminProducts() {
  const { isAdmin, isLoading } = useAdminGuard()
  const [products, setProducts] = useState([])
  const [tableLoading, setTableLoading] = useState(true)

  useEffect(() => {
    if (!isAdmin) return

    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, name, price, category_id')
          .order('name')

        if (error) throw error
        setProducts(data || [])
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setTableLoading(false)
      }
    }

    fetchProducts()
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
          <h1>🍔 Quản lý Sản Phẩm</h1>
          <button className="btn btn-primary">➕ Thêm Sản Phẩm</button>
        </div>

        {tableLoading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tên Sản Phẩm</th>
                <th>Giá</th>
                <th>Danh Mục</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.price.toLocaleString('vi-VN')}₫</td>
                    <td>{product.category_id}</td>
                    <td className="actions">
                      <button className="btn-small btn-view">👁️ Xem</button>
                      <button className="btn-small btn-edit">✏️ Sửa</button>
                      <button className="btn-small btn-delete">🗑️ Xóa</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                    Không có sản phẩm nào
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
