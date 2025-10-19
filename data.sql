-- Tạo bảng để lưu các loại sản phẩm
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Tạo bảng sản phẩm
CREATE TABLE products (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    image VARCHAR(255),
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Tạo bảng người dùng
CREATE TABLE users (
    id INT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Mật khẩu nên được mã hóa (hashed) trong thực tế
    fullname VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255) UNIQUE,
    address TEXT,
    role VARCHAR(50) NOT NULL DEFAULT 'buyer'
);

-- Tạo bảng giỏ hàng (ví dụ cấu trúc)
-- Giả định một giỏ hàng sẽ liên kết người dùng với sản phẩm và số lượng
CREATE TABLE carts (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Tạo bảng đơn hàng (ví dụ cấu trúc)
-- Bảng này sẽ phức tạp hơn trong thực tế, đây là một cấu trúc cơ bản
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
-- Chèn dữ liệu vào bảng categories
INSERT INTO categories (name) VALUES
('Burger'),
('Chicken'),
('Fries')
ON CONFLICT (name) DO NOTHING; -- Bỏ qua nếu đã tồn tại

-- Chèn dữ liệu vào bảng products
-- Lưu ý: category_id được lấy từ bảng categories
INSERT INTO products (id, name, slug, description, price, image, category_id) VALUES
(1, 'Burger Bò Phô Mai 1', 'burger-bo-pho-mai-1', 'Bánh burger bò nướng kèm phô mai tan chảy.', 65000, '7-2-1-number-png.png', (SELECT id FROM categories WHERE name = 'Burger')),
(4, 'Burger Bò Phô Mai 4', 'burger-bo-pho-mai-4', 'Bánh burger bò nướng kèm phô mai tan chảy.', 65000, '1-2-4-number-png.png', (SELECT id FROM categories WHERE name = 'Burger')),
(5, 'Burger Bò Phô Mai 5', 'burger-bo-pho-mai-5', 'Bánh burger bò nướng kèm phô mai tan chảy.', 65000, '11-2-5-number-png.png', (SELECT id FROM categories WHERE name = 'Burger')),
(2, 'Gà Rán Giòn Cay 2', 'ga-ran-gion-cay-2', 'Miếng gà rán giòn rụm, hương vị cay nồng.', 55000, '2-2-2-number-png.png', (SELECT id FROM categories WHERE name = 'Chicken')),
(6, 'Gà Rán Giòn Cay 6', 'ga-ran-gion-cay-6', 'Miếng gà rán giòn rụm, hương vị cay nồng.', 55000, '8-2-6-number-png.png', (SELECT id FROM categories WHERE name = 'Chicken')),
(3, 'Khoai Tây Chiên 3', 'khoai-tay-chien-3', 'Khoai tây chiên vàng ruộm, giòn tan.', 35000, '5-2-3-number-png.png', (SELECT id FROM categories WHERE name = 'Fries'));

-- Chèn dữ liệu vào bảng users
-- CẢNH BÁO: Lưu mật khẩu dưới dạng văn bản thuần túy là KHÔNG an toàn.
-- Trong một ứng dụng thực tế, bạn phải mã hóa mật khẩu trước khi lưu.
INSERT INTO users (id, username, password, fullname, phone, email, address, role) VALUES
(1, 'buyer', '123', 'Nguyễn Văn A', '0909123456', 'buyer@example.com', '123 Lê Lợi, Quận 1, TP.HCM', 'buyer'),
(2, 'admin', '123', 'Quản trị viên', '0988123456', 'admin@example.com', '456 Nguyễn Huệ, Quận 1, TP.HCM', 'admin'),
(3, 'hehe', '123456', 'Nguyễn Thị B', '0909123123', 'hehe@example.com', '789 CMT8, Quận 3, TP.HCM', 'buyer');