import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../service/supabaseClient';

export default function RegisterScreen() {
  const router = useRouter();

  const [form, setForm] = useState({
    username: '',
    password: '',
    fullname: '',
    phone: '',
    email: '',
    address: '',
  });

  const handleRegister = async () => {
    const { username, password, fullname, phone, email, address } = form;

    if (!username || !password || !fullname || !phone || !email || !address) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập đầy đủ các trường.');
      return;
    }

    try {
      const { data: existingPhone, error: phoneError } = await supabase
        .from('users')
        .select('phone')
        .eq('phone', phone)
        .single();

      if (existingPhone) {
        Alert.alert('Số điện thoại đã tồn tại', 'Vui lòng nhập số khác.');
        return;
      }

      const { error } = await supabase.from('users').insert([
        {
          username,
          password,
          fullname,
          phone,
          email,
          address,
          role: 'buyer',
        },
      ]);

      if (error) throw error;

      Alert.alert('🎉 Thành công', 'Đăng ký tài khoản thành công!');
      router.push('/auth/login');
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể đăng ký. Vui lòng thử lại sau.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Đăng ký tài khoản</Text>

      <TextInput
        placeholder="Tên đăng nhập"
        style={styles.input}
        value={form.username}
        onChangeText={(t) => setForm({ ...form, username: t })}
      />
      <TextInput
        placeholder="Mật khẩu"
        style={styles.input}
        secureTextEntry
        value={form.password}
        onChangeText={(t) => setForm({ ...form, password: t })}
      />
      <TextInput
        placeholder="Họ và tên"
        style={styles.input}
        value={form.fullname}
        onChangeText={(t) => setForm({ ...form, fullname: t })}
      />
      <TextInput
        placeholder="Số điện thoại"
        keyboardType="phone-pad"
        style={styles.input}
        value={form.phone}
        onChangeText={(t) => setForm({ ...form, phone: t })}
      />
      <TextInput
        placeholder="Email"
        keyboardType="email-address"
        style={styles.input}
        value={form.email}
        onChangeText={(t) => setForm({ ...form, email: t })}
      />
      <TextInput
        placeholder="Địa chỉ"
        style={styles.input}
        value={form.address}
        onChangeText={(t) => setForm({ ...form, address: t })}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Đăng ký</Text>
      </TouchableOpacity>

      <View style={styles.row}>
        <Text>Đã có tài khoản?</Text>
        <TouchableOpacity onPress={() => router.push('/auth/login')}>
          <Text style={styles.link}> Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#fff',
    paddingVertical: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    color: '#FF6347',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    backgroundColor: '#fafafa',
  },
  button: {
    backgroundColor: '#FF6347',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  link: {
    color: '#FF6347',
    fontWeight: '600',
  },
});
