import { supabase } from './supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, SafeUser } from '../type/user';

export const legacyLogin = async (
    username: string,
    password: string
    ): Promise<SafeUser> => {
    const { data, error } = await supabase
    .from("users")
    .select("id, username, fullname, phone, role, password")
    .eq("username", username)
    .limit(1);

    if (error) {
        console.error(error);
        throw new Error("Không thể truy cập dữ liệu người dùng!");
    }

    if (!data || data.length === 0) {
        throw new Error("Tên đăng nhập không tồn tại!");
    }

    const user = data[0];

    if (String(user.password) !== password) {
        throw new Error("Sai mật khẩu, vui lòng thử lại!");
    }

    // Không lưu password khi trả về
    const { password: _, ...safeUser } = user;
    return safeUser;
};

    /**
     * Lưu thông tin user vào AsyncStorage
     */
    export const saveUserToStorage = async (user: SafeUser) => {
    await AsyncStorage.setItem('user', JSON.stringify(user));
    };

    /**
     * Gộp giỏ hàng guest và user
     */
    export const mergeCarts = async (userId: number) => {
    try {
        const guestKey = 'cart_guest';
        const userKey = `cart_${userId}`;

        const [guestRaw, userRaw] = await Promise.all([
        AsyncStorage.getItem(guestKey),
        AsyncStorage.getItem(userKey),
        ]);

        const guestItems = guestRaw ? JSON.parse(guestRaw) : [];
        const userItems = userRaw ? JSON.parse(userRaw) : [];

        const map: Record<string, any> = {};
        [...userItems, ...guestItems].forEach((it) => {
        const key = String(it.id);
        if (!map[key]) map[key] = { ...it };
        else map[key].quantity = (map[key].quantity || 0) + (it.quantity || 0);
        });

        const merged = Object.values(map);
        await AsyncStorage.setItem(userKey, JSON.stringify(merged));
        await AsyncStorage.removeItem(guestKey);

        return merged;
    } catch (mergeErr) {
        console.error('Error merging carts:', mergeErr);
    }
};
