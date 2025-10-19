import { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { supabase } from '../service/supabaseClient'

export default function TestSupabase() {
  const [message, setMessage] = useState('Đang kiểm tra...')

  useEffect(() => {
    const test = async () => {
      const { data, error } = await supabase.from('products').select('*')
      if (error) setMessage('Lỗi: ' + error.message)
      else setMessage(`Kết nối thành công! Có ${data.length} sản phẩm.`)
    }
    test()
  }, [])

  return (
    <View>
      <Text style={styles.errorText}>{message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
  },
})
