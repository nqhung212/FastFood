import { useEffect, useState } from 'react'
import AdminLayout from '../../layouts/admin-layout'
import { useAdminGuard } from '../../hooks/use-admin-guard'
import { supabase } from '../../lib/supabaseClient'
import '../../assets/styles/admin-table.css'

export default function AdminOrders() {
  const { isAdmin, isLoading } = useAdminGuard()
  const [orders, setOrders] = useState([])
  const [tableLoading, setTableLoading] = useState(true)
  const [sortConfig, setSortConfig] = useState({ column: 'created_at', ascending: false })

  useEffect(() => {
    if (!isAdmin) return

    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('id, user_id, total_amount, status, created_at')
          .order(sortConfig.column, { ascending: sortConfig.ascending })

        if (error) throw error
        setOrders(data || [])
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setTableLoading(false)
      }
    }

    fetchOrders()
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
          <h1>Manage Orders</h1>
          <button className="btn btn-primary">Add Order</button>
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
                  Order ID {getSortIcon('id')}
                </th>
                <th onClick={() => handleSort('user_id')} className="sortable">
                  User ID {getSortIcon('user_id')}
                </th>
                <th onClick={() => handleSort('total_amount')} className="sortable">
                  Total Amount {getSortIcon('total_amount')}
                </th>
                <th onClick={() => handleSort('status')} className="sortable">
                  Status {getSortIcon('status')}
                </th>
                <th onClick={() => handleSort('created_at')} className="sortable">
                  Created Date {getSortIcon('created_at')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id.slice(0, 8)}...</td>
                    <td>{order.user_id.slice(0, 8)}...</td>
                    <td>${order.total_amount.toLocaleString('en-US')}</td>
                    <td>
                      <span className={`status status-${order.status}`}>{order.status}</span>
                    </td>
                    <td>{new Date(order.created_at).toLocaleDateString('en-US')}</td>
                    <td className="actions">
                      <button className="btn-small btn-edit">Edit</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                    No orders found
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
