import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../service/supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage'; // ✅ thêm

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert("Thông báo", "Vui lòng nhập đủ thông tin!");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, username, fullname, phone, role, password")
        .eq("phone", phone)
        .maybeSingle();

      if (error) {
        console.error(error);
        Alert.alert("Lỗi Supabase", "Không thể truy cập dữ liệu người dùng!");
        return;
      }

      if (!data) {
        Alert.alert("Đăng nhập thất bại", "Số điện thoại không tồn tại!");
        return;
      }

      if (data.password !== password) {
        Alert.alert("Sai mật khẩu", "Vui lòng thử lại!");
        return;
      }

      await AsyncStorage.setItem('user', JSON.stringify(data));

      Alert.alert("Thành công", `Xin chào ${data.fullname}!`);
      router.replace("/(tabs)/homepage");
    } catch (err) {
      console.error(err);
      Alert.alert("Lỗi hệ thống", "Không thể đăng nhập!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: 'https://uuxtbxkgnktfcbdevbmx.supabase.co/storage/v1/object/public/product-image/logo.png',
        }}
        style={styles.logo}
      />
      <Text style={styles.title}>Đăng nhập</Text>

      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/auth/forgot-password')}>
        <Text style={styles.link}>Quên mật khẩu?</Text>
      </TouchableOpacity>

      <View style={styles.row}>
        <Text>Chưa có tài khoản? </Text>
        <TouchableOpacity onPress={() => router.push('/auth/register')}>
          <Text style={styles.link}>Đăng ký</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 30,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  button: {
    width: '100%',
    backgroundColor: '#FF6347',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  link: {
    color: '#FF6347',
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    marginTop: 20,
  },
});
