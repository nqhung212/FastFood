import { supabase } from './supabaseClient';
import { User } from '../type/user';

export const registerUser = async (form: User) => {
    const { username, password, fullname, phone, email, address } = form;

    // 1. Kiểm tra username
    const { data: existingUsername } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)
        .maybeSingle();

    if (existingUsername) {
        throw new Error('Tên đăng nhập đã tồn tại');
    }

    // 2. Kiểm tra SĐT
    const { data: existingPhone } = await supabase
        .from('users')
        .select('phone')
        .eq('phone', phone)
        .maybeSingle();

    if (existingPhone) {
        throw new Error('Số điện thoại đã tồn tại');
    }

    // 3. Tạo user
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

    if (error) {
        throw new Error('Không thể đăng ký. Vui lòng thử lại sau.');
    }
};