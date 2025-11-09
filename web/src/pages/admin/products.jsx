import AdminLayout from '../../layouts/admin-layout'
import { useAdminGuard } from '../../hooks/use-admin-guard'

export default function AdminProducts() {
  const { isAdmin, isLoading } = useAdminGuard()

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
      <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
        <h1>🍔 Quản lý Sản Phẩm</h1>
        <p style={{ color: '#666' }}>Trang này sẽ cho phép thêm, sửa, xóa sản phẩm.</p>
        <p style={{ color: '#999', fontSize: '14px' }}>(Tính năng sắp được phát triển)</p>
      </div>
    </AdminLayout>
  )
}
