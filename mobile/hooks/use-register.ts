import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { registerUser } from '../service/registerService';

export const useRegister = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

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

        setIsLoading(true);
        try {
        await registerUser(form);

        Alert.alert('🎉 Thành công', 'Đăng ký tài khoản thành công!');
        router.push('/auth/login');

        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message);
            } else {
                console.error("Unexpected error:", error);
            }
        }

    };

    return {
        form,
        setForm,
        handleRegister,
        isLoading,
    };
};