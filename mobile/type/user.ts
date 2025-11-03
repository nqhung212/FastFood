export interface User {
    id: number;
    username: string;
    fullname: string;
    phone: string;
    role: string;
    password: string;
    email?: string;
    address?: string;
}

// Interface cho User không có password (để lưu vào AsyncStorage và trả về từ API)
export type SafeUser = Omit<User, 'password'>;
