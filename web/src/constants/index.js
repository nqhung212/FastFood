// src/constants/index.js
export const API_BASE_URL = 'http://localhost:3001'

// Key dùng cho lưu trữ local/session (để đồng bộ login, cart, v.v.)
export const TOKEN_KEY = 'auth_token'
export const USER_KEY = 'auth_user'
export const CART_KEY = 'cart_data'
export const AUTH_KEY = 'auth_user'

// Thông tin app (hiển thị trong title, footer,...)
export const APP_NAME = 'FastFood'
export const APP_VERSION = '1.0.0'

// Định nghĩa vai trò (role) người dùng
export const USER_ROLES = {
  ADMIN: 'admin',
  BUYER: 'buyer'
}

// Các endpoint chính (chỉ cần thay đổi ở đây nếu đổi API)
export const ENDPOINTS = {
  USERS: `${API_BASE_URL}/users`,
  PRODUCTS: `${API_BASE_URL}/products`,
  CATEGORIES: `${API_BASE_URL}/categories`,
  ORDERS: `${API_BASE_URL}/orders`
}

export const DEFAULT_DELAY = 800
