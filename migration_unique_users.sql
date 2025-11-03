-- Migration script để thêm unique constraint cho username
-- Chạy script này trong Supabase SQL Editor

-- 1. Trước tiên, xóa các bản ghi trùng lặp (nếu có)
WITH duplicates AS (
  SELECT username, MIN(id) as keep_id
  FROM users 
  GROUP BY username 
  HAVING COUNT(*) > 1
)
DELETE FROM users 
WHERE id NOT IN (SELECT keep_id FROM duplicates)
AND username IN (SELECT username FROM duplicates);

-- 2. Thêm unique constraint cho username
ALTER TABLE users 
ADD CONSTRAINT users_username_unique UNIQUE (username);

-- 3. Thêm unique constraint cho phone (nếu chưa có)
ALTER TABLE users 
ADD CONSTRAINT users_phone_unique UNIQUE (phone);

-- 4. Tạo index để tối ưu hóa truy vấn
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);