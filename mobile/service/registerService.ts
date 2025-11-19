import { supabase } from './supabaseClient';
import { User } from '../type/user';

export const registerUser = async (form: User) => {
    const { username, password, fullname, phone, email, address } = form;
    // New schema uses user_account + customer tables
    // 1. Check existing email
    if (email) {
        const { data: existingEmail } = await supabase
            .from('user_account')
            .select('email')
            .eq('email', email)
            .maybeSingle();
        if (existingEmail) throw new Error('Email đã tồn tại');
    }

    // 2. Optionally check phone
    if (phone) {
        const { data: existingPhone } = await supabase
            .from('user_account')
            .select('phone')
            .eq('phone', phone)
            .maybeSingle();
        if (existingPhone) throw new Error('Số điện thoại đã tồn tại');
    }

    // 3. Insert into user_account (password stored in password_hash column)
    const { data, error } = await supabase.from('user_account').insert([
        {
            email: email ?? null,
            password_hash: password ?? null,
            full_name: fullname ?? username ?? '',
            phone: phone ?? null,
            role: 'customer',
        },
    ]).select('user_id').single();

    if (error || !data) {
        throw new Error('Không thể đăng ký. Vui lòng thử lại sau.');
    }

    // 4. Create customer record
    try {
        await supabase.from('customer').insert([{ customer_id: data.user_id, default_address: address ?? null, phone: phone ?? null }]);
    } catch (err) {
        console.warn('Không tạo được customer record:', err);
    }
};