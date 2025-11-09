import { useEffect, useState } from 'react'
import AdminLayout from '../../layouts/admin-layout'
import { useAdminGuard } from '../../hooks/use-admin-guard'
import { supabase } from '../../lib/supabaseClient'
import '../../assets/styles/admin-table.css'

export default function AdminUsers() {
  const { isAdmin, isLoading } = useAdminGuard()
  const [users, setUsers] = useState([])
  const [tableLoading, setTableLoading] = useState(true)

  useEffect(() => {
    if (!isAdmin) return

    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, username, email, fullname, role, phone')
          .order('username')

        if (error) throw error
        setUsers(data || [])
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        setTableLoading(false)
      }
    }

    fetchUsers()
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
          <h1>👥 Quản lý Người Dùng</h1>
          <button className="btn btn-primary">➕ Thêm Người Dùng</button>
        </div>

        {tableLoading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Tên</th>
                <th>Vai Trò</th>
                <th>Số Điện Thoại</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.fullname}</td>
                    <td>
                      <span className={`role role-${user.role}`}>{user.role}</span>
                    </td>
                    <td>{user.phone || '-'}</td>
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
                    Không có người dùng nào
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
