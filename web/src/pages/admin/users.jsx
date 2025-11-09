import { useEffect, useState } from 'react'
import AdminLayout from '../../layouts/admin-layout'
import { useAdminGuard } from '../../hooks/use-admin-guard'
import { supabase } from '../../lib/supabaseClient'
import '../../assets/styles/admin-table.css'

export default function AdminUsers() {
  const { isAdmin, isLoading } = useAdminGuard()
  const [users, setUsers] = useState([])
  const [tableLoading, setTableLoading] = useState(true)
  const [sortConfig, setSortConfig] = useState({ column: 'username', ascending: true })

  useEffect(() => {
    if (!isAdmin) return

    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, username, email, fullname, role, phone')
          .order(sortConfig.column, { ascending: sortConfig.ascending })

        if (error) throw error
        setUsers(data || [])
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        setTableLoading(false)
      }
    }

    fetchUsers()
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
          <h1>Manage Users</h1>
          <button className="btn btn-primary">Add User</button>
        </div>

        {tableLoading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p>Loading data...</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('username')} className="sortable">
                  Username {getSortIcon('username')}
                </th>
                <th onClick={() => handleSort('email')} className="sortable">
                  Email {getSortIcon('email')}
                </th>
                <th onClick={() => handleSort('fullname')} className="sortable">
                  Full Name {getSortIcon('fullname')}
                </th>
                <th onClick={() => handleSort('role')} className="sortable">
                  Role {getSortIcon('role')}
                </th>
                <th onClick={() => handleSort('phone')} className="sortable">
                  Phone {getSortIcon('phone')}
                </th>
                <th>Actions</th>
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
                      <button className="btn-small btn-edit">Edit</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                    No users found
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
