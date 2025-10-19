import { useEffect, useState } from 'react'
import { supabase } from '../../service/supabaseClient'

export default function TestSupabase() {
  const [message, setMessage] = useState('Đang kiểm tra...')

  useEffect(() => {
    const testConnection = async () => {
      try {
        const { data, error } = await supabase.from('products').select('*')

        if (error) {
          console.error('Lỗi truy vấn:', error)
          setMessage('❌ Lỗi: ' + error.message)
        } else {
          console.log('Dữ liệu:', data)
          setMessage(`✅ Kết nối thành công! Có ${data.length} sản phẩm.`)
        }
      } catch (err) {
        console.error('Lỗi kết nối:', err)
        setMessage('⚠️ Không thể kết nối Supabase: ' + err.message)
      }
    }

    testConnection()
  }, [])

  return (
    <div style={{ padding: 20, backgroundColor: '#141414ff', border: '1px solid #ddd', borderRadius: 8, marginTop: 20 }}>
      <h2>Kiểm tra kết nối Supabase</h2>
      <p>{message}</p>
    </div>
  )
}
