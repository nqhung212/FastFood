import { useEffect, useState } from 'react'
import AdminLayout from '../../layouts/admin-layout'
import { useAdminGuard } from '../../hooks/use-admin-guard'
import { supabase } from '../../lib/supabaseClient'
import '../../assets/styles/admin-table.css'

export default function AdminOrders() {
  const { isAdmin, isLoading } = useAdminGuard()
  const [orders, setOrders] = useState([])
  const [tableLoading, setTableLoading] = useState(true)

  useEffect(() => {
    if (!isAdmin) return

    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('id, user_id, total_amount, status, created_at')
          .order('created_at', { ascending: false })

        if (error) throw error
        setOrders(data || [])
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setTableLoading(false)
      }
    }

    fetchOrders()
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
          <h1>📦 Quản lý Đơn Hàng</h1>
          <button className="btn btn-primary">➕ Thêm Đơn Hàng</button>
        </div>

        {tableLoading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID Đơn Hàng</th>
                <th>User ID</th>
                <th>Tổng Tiền</th>
                <th>Trạng Thái</th>
                <th>Ngày Tạo</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id.slice(0, 8)}...</td>
                    <td>{order.user_id.slice(0, 8)}...</td>
                    <td>{order.total_amount.toLocaleString('vi-VN')}₫</td>
                    <td>
                      <span className={`status status-${order.status}`}>{order.status}</span>
                    </td>
                    <td>{new Date(order.created_at).toLocaleDateString('vi-VN')}</td>
                    <td className="actions">
                      <button className="btn-small btn-view">👁️ Xem</button>
                      <button className="btn-small btn-edit">✏️ Sửa</button>
                      <button className="btn-small btn-delete">🗑️ Xóa</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                    Không có đơn hàng nào
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
