import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from '@/assets/css/register.style';
import { useRegister } from '../../hooks/use-register';


export default function RegisterScreen() {
  const { form, setForm, handleRegister, isLoading } = useRegister();
  const router = useRouter();

  return (
    // <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Image
            source={{
              uri: 'https://uuxtbxkgnktfcbdevbmx.supabase.co/storage/v1/object/public/product-image/logo.png',
            }}
            style={styles.logo}
          />
          <Text style={styles.title}>Đăng ký tài khoản</Text>

          {/* Form đăng ký */}
          <TextInput
            placeholder="Tên đăng nhập"
            style={styles.input}
            value={form.username}
            onChangeText={(t) => setForm({ ...form, username: t })}
            editable={!isLoading}
            placeholderTextColor="#000"
          />
          <TextInput
            placeholder="Mật khẩu"
            style={styles.input}
            secureTextEntry
            value={form.password}
            onChangeText={(t) => setForm({ ...form, password: t })}
            editable={!isLoading}
            placeholderTextColor="#000"
          />
          <TextInput
            placeholder="Họ và tên"
            style={styles.input}
            value={form.fullname}
            onChangeText={(t) => setForm({ ...form, fullname: t })}
            editable={!isLoading}
            placeholderTextColor="#000"
          />
          <TextInput
            placeholder="Số điện thoại"
            keyboardType="phone-pad"
            style={styles.input}
            value={form.phone}
            onChangeText={(t) => setForm({ ...form, phone: t })}
            editable={!isLoading}
            placeholderTextColor="#000"
          />
          <TextInput
            placeholder="Email"
            keyboardType="email-address"
            style={styles.input}
            value={form.email}
            onChangeText={(t) => setForm({ ...form, email: t })}
            editable={!isLoading}
            placeholderTextColor="#000"
          />
          <TextInput
            placeholder="Địa chỉ"
            style={styles.input}
            value={form.address}
            onChangeText={(t) => setForm({ ...form, address: t })}
            editable={!isLoading}
            placeholderTextColor="#000"
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Đăng ký</Text>
            )}
          </TouchableOpacity>

          <View style={styles.row}>
            <Text>Đã có tài khoản?</Text>
            <TouchableOpacity onPress={() => router.push('/auth/login')}>
              <Text style={styles.link}> Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    /* </TouchableWithoutFeedback> */
  );
}