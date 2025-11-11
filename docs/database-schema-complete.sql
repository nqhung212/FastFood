-- Complete Database Schema for FastFood Application
-- Based on code analysis and current implementation

-- =====================================================
-- CORE TABLES (Current Implementation)
-- =====================================================

-- Categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    image VARCHAR(255),
    category_id INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Users table (with Supabase auth integration)
CREATE TABLE users (
    id INT PRIMARY KEY, -- Can be UUID if using Supabase auth
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255), -- Not needed if using Supabase auth
    fullname VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255) UNIQUE,
    address TEXT,
    role VARCHAR(50) NOT NULL DEFAULT 'buyer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Shopping cart (temporary storage)
CREATE TABLE carts (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE(user_id, product_id) -- Prevent duplicate cart items
);

-- Orders table (using UUID from code)
CREATE TABLE orders (
    id VARCHAR(255) PRIMARY KEY, -- UUID from crypto.randomUUID()
    user_id INT, -- Nullable for guest orders
    total_amount NUMERIC(12, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    -- Customer information (from checkout form)
    customer_name VARCHAR(255),
    customer_phone VARCHAR(20),
    customer_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Order items (line items)
CREATE TABLE order_item ( -- Note: singular name used in code
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(255) NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price NUMERIC(10, 2) NOT NULL, -- Price at time of order
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);

-- Payment records (MoMo integration)
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(255) NOT NULL,
    payment_id VARCHAR(255), -- MoMo transaction ID
    provider VARCHAR(50) DEFAULT 'momo',
    amount INTEGER NOT NULL, -- Amount in VND (integer as per MoMo API)
    status VARCHAR(50) DEFAULT 'pending',
    payment_data TEXT, -- JSON response from MoMo (for audit trail)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Products indexes
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_price ON products(price);

-- Orders indexes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- Order items indexes
CREATE INDEX idx_order_item_order_id ON order_item(order_id);
CREATE INDEX idx_order_item_product_id ON order_item(product_id);

-- Cart indexes
CREATE INDEX idx_carts_user_id ON carts(user_id);
CREATE INDEX idx_carts_product_id ON carts(product_id);

-- Payment indexes
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_payment_id ON payments(payment_id);
CREATE INDEX idx_payments_status ON payments(status);

-- =====================================================
-- SAMPLE DATA (from data.sql)
-- =====================================================

-- Insert categories
INSERT INTO categories (name) VALUES
('Burger'),
('Chicken'),
('Fries')
ON CONFLICT (name) DO NOTHING;

-- Insert products
INSERT INTO products (id, name, slug, description, price, image, category_id) VALUES
(1, 'Burger Bò Phô Mai 1', 'burger-bo-pho-mai-1', 'Bánh burger bò nướng kèm phô mai tan chảy.', 65000, '7-2-1-number-png.png', (SELECT id FROM categories WHERE name = 'Burger')),
(4, 'Burger Bò Phô Mai 4', 'burger-bo-pho-mai-4', 'Bánh burger bò nướng kèm phô mai tan chảy.', 65000, '1-2-4-number-png.png', (SELECT id FROM categories WHERE name = 'Burger')),
(5, 'Burger Bò Phô Mai 5', 'burger-bo-pho-mai-5', 'Bánh burger bò nướng kèm phô mai tan chảy.', 65000, '11-2-5-number-png.png', (SELECT id FROM categories WHERE name = 'Burger')),
(2, 'Gà Rán Giòn Cay 2', 'ga-ran-gion-cay-2', 'Miếng gà rán giòn rụm, hương vị cay nồng.', 55000, '2-2-2-number-png.png', (SELECT id FROM categories WHERE name = 'Chicken')),
(6, 'Gà Rán Giòn Cay 6', 'ga-ran-gion-cay-6', 'Miếng gà rán giòn rụm, hương vị cay nồng.', 55000, '8-2-6-number-png.png', (SELECT id FROM categories WHERE name = 'Chicken')),
(3, 'Khoai Tây Chiên 3', 'khoai-tay-chien-3', 'Khoai tây chiên vàng ruộm, giòn tan.', 35000, '5-2-3-number-png.png', (SELECT id FROM categories WHERE name = 'Fries'))
ON CONFLICT (id) DO NOTHING;

-- Insert sample users
INSERT INTO users (id, username, password, fullname, phone, email, address, role) VALUES
(1, 'buyer', '123', 'Nguyễn Văn A', '0909123456', 'buyer@example.com', '123 Lê Lợi, Quận 1, TP.HCM', 'buyer'),
(2, 'admin', '123', 'Quản trị viên', '0988123456', 'admin@example.com', '456 Nguyễn Huệ, Quận 1, TP.HCM', 'admin'),
(3, 'hehe', '123456', 'Nguyễn Thị B', '0909123123', 'hehe@example.com', '789 CMT8, Quận 3, TP.HCM', 'buyer')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- BUSINESS LOGIC CONSTRAINTS & TRIGGERS
-- =====================================================

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_carts_updated_at BEFORE UPDATE ON carts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Order validation constraints
ALTER TABLE orders ADD CONSTRAINT check_order_status 
CHECK (status IN ('pending', 'confirmed', 'processing', 'completed', 'cancelled', 'failed'));

ALTER TABLE orders ADD CONSTRAINT check_total_amount_positive 
CHECK (total_amount > 0);

-- Payment validation constraints  
ALTER TABLE payments ADD CONSTRAINT check_payment_status
CHECK (status IN ('pending', 'processing', 'success', 'failed', 'cancelled', 'refunded'));

ALTER TABLE payments ADD CONSTRAINT check_payment_amount_positive
CHECK (amount > 0);

-- Cart validation constraints
ALTER TABLE carts ADD CONSTRAINT check_cart_quantity_positive
CHECK (quantity > 0);

-- Order item validation constraints
ALTER TABLE order_item ADD CONSTRAINT check_order_item_quantity_positive
CHECK (quantity > 0);

ALTER TABLE order_item ADD CONSTRAINT check_order_item_price_positive
CHECK (price > 0);

-- =====================================================
-- ROW LEVEL SECURITY (for Supabase)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_item ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Note: Categories and Products are public read-only, no RLS needed

-- RLS Policies (example - adjust based on auth strategy)
-- Users can only see/edit their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = id::text);

-- Orders: users can see their own orders
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (auth.uid()::text = user_id::text OR user_id IS NULL);

-- Cart: users can manage their own cart
CREATE POLICY "Users can manage own cart" ON carts FOR ALL USING (auth.uid()::text = user_id::text);

-- Order items: users can see items from their orders
CREATE POLICY "Users can view own order items" ON order_item FOR SELECT 
USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_item.order_id AND auth.uid()::text = orders.user_id::text));

-- Payments: users can see their own payments
CREATE POLICY "Users can view own payments" ON payments FOR SELECT 
USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = payments.order_id AND auth.uid()::text = orders.user_id::text));

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- Order summary view
CREATE OR REPLACE VIEW order_summary AS
SELECT 
    o.id,
    o.user_id,
    u.username,
    o.total_amount,
    o.status,
    o.customer_name,
    o.customer_phone,
    o.customer_address,
    COUNT(oi.id) as item_count,
    o.created_at,
    o.updated_at
FROM orders o
LEFT JOIN users u ON o.user_id = u.id
LEFT JOIN order_item oi ON o.id = oi.order_id
GROUP BY o.id, o.user_id, u.username, o.total_amount, o.status, 
         o.customer_name, o.customer_phone, o.customer_address, o.created_at, o.updated_at;

-- Product catalog view (with category name)
CREATE OR REPLACE VIEW product_catalog AS
SELECT 
    p.id,
    p.name,
    p.slug,
    p.description,
    p.price,
    p.image,
    p.category_id,
    c.name as category_name,
    p.created_at,
    p.updated_at
FROM products p
LEFT JOIN categories c ON p.category_id = c.id;

-- Cart summary view
CREATE OR REPLACE VIEW cart_summary AS
SELECT 
    c.user_id,
    u.username,
    COUNT(c.id) as item_count,
    SUM(c.quantity) as total_quantity,
    SUM(c.quantity * p.price) as total_amount
FROM carts c
JOIN users u ON c.user_id = u.id
JOIN products p ON c.product_id = p.id
GROUP BY c.user_id, u.username;