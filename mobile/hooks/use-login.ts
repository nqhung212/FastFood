import { useState, useContext } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { CartContext } from '../app/cart/CartContext';
import { legacyLogin, saveUserToStorage, mergeCarts } from '../service/loginService';

export const useLogin = () => {
    const router = useRouter();
    const cartCtx = useContext(CartContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!username || !password) {
        Alert.alert("Thông báo", "Vui lòng nhập đủ thông tin!");
        return;
        }

        setLoading(true);

        try {
        // 1️⃣ Đăng nhập
        const user = await legacyLogin(username, password);

        // 2️⃣ Lưu thông tin user
        await saveUserToStorage(user);

        // 3️⃣ Gộp giỏ hàng guest -> user
        await mergeCarts(user.id);

        // 4️⃣ Refresh Cart Context (nếu có)
        try {
            if (cartCtx?.refreshCartForUser) {
            await cartCtx.refreshCartForUser();
            }
        } catch (e) {
            console.warn('CartProvider không khả dụng để refresh giỏ hàng lúc này', e);
        }

        // 5️⃣ Thông báo + điều hướng
        Alert.alert("Thành công", `Xin chào ${user.fullname || user.username || 'người dùng'}!`);
        router.replace("/(tabs)/homepage");

        } catch (err: unknown) {
        // ✅ Xử lý lỗi an toàn
        const message = err instanceof Error
            ? err.message
            : "Đăng nhập thất bại, vui lòng thử lại!";
        Alert.alert("Đăng nhập thất bại", message);
        } finally {
        setLoading(false);
        }
    };

    return {
        username,
        setUsername,
        password,
        setPassword,
        loading,
        handleLogin,
    };
};
