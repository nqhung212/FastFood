import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { styles } from '@/assets/css/login.style';
import { Stack, useRouter } from 'expo-router';
import { useLogin } from '@/hooks/use-login';


export default function LoginScreen() {
  const router = useRouter();

  const {
    username,
    setUsername,
    password,
    setPassword,
    loading,
    handleLogin
  } = useLogin();


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Stack.Screen options={{ headerShown: false }} />
          <Image
            source={{
              uri: 'https://uuxtbxkgnktfcbdevbmx.supabase.co/storage/v1/object/public/product-image/logo.png',
            }}
            style={styles.logo}
          />
          <Text style={styles.title}>Đăng nhập</Text>

          <TextInput
            style={styles.input}
            placeholder="Tên đăng nhập" // Giữ nguyên
            keyboardType="default"
            value={username}
            onChangeText={setUsername}
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
            {loading ? (
              <ActivityIndicator color="#fff" /> // Hiển thị loading
            ) : (
              <Text style={styles.buttonText}>Đăng nhập</Text>
            )}
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
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}