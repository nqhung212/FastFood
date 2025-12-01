-- Chèn dữ liệu mẫu (Sample Data Inserts)

-- 1. Chèn dữ liệu vào bảng user_account
-- Lưu ý: Mật khẩu được mã hóa giả định. Trong thực tế, bạn cần sử dụng hàm băm mật khẩu an toàn.
INSERT INTO user_account (user_id, email, password_hash, full_name, role, phone, status) VALUES
(gen_random_uuid(), 'admin@example.com', '$2a$10$fV/c0Xq2jPjG2Zq3c2QfReH2q9JjZ2JjZ2QfReH2q9JjZ', 'Admin User', 'admin', '0901234567', TRUE), -- 1. Admin
(gen_random_uuid(), 'owner1@example.com', '$2a$10$fV/c0Xq2jPjG2Zq3c2QfReH2q9JjZ2JjZ2QfReH2q9JjZ', 'Chủ nhà hàng A', 'restaurant_owner', '0912345678', TRUE), -- 2. Owner A
(gen_random_uuid(), 'owner2@example.com', '$2a$10$fV/c0Xq2jPjG2Zq3c2QfReH2q9JjZ2JjZ2QfReH2q9JjZ', 'Chủ nhà hàng B', 'restaurant_owner', '0923456789', TRUE), -- 3. Owner B
(gen_random_uuid(), 'customer1@example.com', '$2a$10$fV/c0Xq2jPjG2Zq3c2QfReH2q9JjZ2JjZ2QfReH2q9JjZ', 'Khách hàng A', 'customer', '0934567890', TRUE), -- 4. Customer A
(gen_random_uuid(), 'customer2@example.com', '$2a$10$fV/c0Xq2jPjG2Zq3c2QfReH2q9JjZ2JjZ2QfReH2q9JjZ', 'Khách hàng B', 'customer', '0945678901', TRUE), -- 5. Customer B
(gen_random_uuid(), 'driver1@example.com', '$2a$10$fV/c0Xq2jPjG2Zq3c2QfReH2q9JjZ2JjZ2QfReH2q9JjZ', 'Tài xế 1', 'admin', '0956789012', TRUE); -- 6. Tài xế (driver_id trong delivery_tracking tham chiếu user_account)

-- Lấy các user_id cho các bước tiếp theo
SELECT user_id INTO TEMP TABLE _admin_id FROM user_account WHERE email = 'admin@example.com';
SELECT user_id INTO TEMP TABLE _owner1_id FROM user_account WHERE email = 'owner1@example.com';
SELECT user_id INTO TEMP TABLE _owner2_id FROM user_account WHERE email = 'owner2@example.com';
SELECT user_id INTO TEMP TABLE _customer1_id FROM user_account WHERE email = 'customer1@example.com';
SELECT user_id INTO TEMP TABLE _customer2_id FROM user_account WHERE email = 'customer2@example.com';
SELECT user_id INTO TEMP TABLE _driver1_id FROM user_account WHERE email = 'driver1@example.com';


-- 2. Chèn dữ liệu vào bảng customer
INSERT INTO customer (customer_id, default_address, phone) VALUES
((SELECT user_id FROM _customer1_id), '123 Đường Nguyễn Huệ, Quận 1, TP.HCM', '0934567890'),
((SELECT user_id FROM _customer2_id), '456 Đường Lê Lợi, Quận 1, TP.HCM', '0945678901');


-- 3. Chèn dữ liệu vào bảng restaurant
INSERT INTO restaurant (restaurant_id, owner_id, name, description, address, latitude, longitude, logo_url, status) VALUES
(gen_random_uuid(), (SELECT user_id FROM _owner1_id), 'Quán Ăn Ngon A', 'Chuyên món Việt truyền thống', '789 Đường Hai Bà Trưng, Quận 3, TP.HCM', 10.7788, 106.6999, 'logo_a.png', 'active'), -- Restaurant A
(gen_random_uuid(), (SELECT user_id FROM _owner2_id), 'Nhà Hàng Pizza Ý B', 'Pizza và pasta chính hiệu Ý', '101 Đường Đồng Khởi, Quận 1, TP.HCM', 10.7755, 106.7011, 'logo_b.png', 'active'); -- Restaurant B

-- Lấy các restaurant_id
SELECT restaurant_id INTO TEMP TABLE _rest_a_id FROM restaurant WHERE name = 'Quán Ăn Ngon A';
SELECT restaurant_id INTO TEMP TABLE _rest_b_id FROM restaurant WHERE name = 'Nhà Hàng Pizza Ý B';


-- 4. Chèn dữ liệu vào bảng category (cho Nhà hàng A)
INSERT INTO category (category_id, restaurant_id, name, icon_url) VALUES
(gen_random_uuid(), (SELECT restaurant_id FROM _rest_a_id), 'Món Chính', 'icon_mon_chinh.png'), -- 1. Category A-1
(gen_random_uuid(), (SELECT restaurant_id FROM _rest_a_id), 'Đồ Uống', 'icon_do_uong.png'); -- 2. Category A-2

-- Lấy các category_id
SELECT category_id INTO TEMP TABLE _cat_a1_id FROM category WHERE name = 'Món Chính' AND restaurant_id = (SELECT restaurant_id FROM _rest_a_id);
SELECT category_id INTO TEMP TABLE _cat_a2_id FROM category WHERE name = 'Đồ Uống' AND restaurant_id = (SELECT restaurant_id FROM _rest_a_id);


-- 5. Chèn dữ liệu vào bảng product (cho Nhà hàng A)
INSERT INTO product (product_id, restaurant_id, category_id, name, description, image_url, price, status) VALUES
(gen_random_uuid(), (SELECT restaurant_id FROM _rest_a_id), (SELECT category_id FROM _cat_a1_id), 'Phở Bò Đặc Biệt', 'Phở bò tái nạm gầu', 'pho_bo.png', 55000.00, TRUE), -- 1. Product A1
(gen_random_uuid(), (SELECT restaurant_id FROM _rest_a_id), (SELECT category_id FROM _cat_a1_id), 'Cơm Gà Xối Mỡ', 'Cơm chiên, gà xối mỡ giòn', 'com_ga.png', 45000.00, TRUE), -- 2. Product A2
(gen_random_uuid(), (SELECT restaurant_id FROM _rest_a_id), (SELECT category_id FROM _cat_a2_id), 'Trà Đá', 'Trà đá giải nhiệt', 'tra_da.png', 5000.00, TRUE); -- 3. Product A3

-- Lấy các product_id
SELECT product_id INTO TEMP TABLE _prod_a1_id FROM product WHERE name = 'Phở Bò Đặc Biệt';
SELECT product_id INTO TEMP TABLE _prod_a2_id FROM product WHERE name = 'Cơm Gà Xối Mỡ';
SELECT product_id INTO TEMP TABLE _prod_a3_id FROM product WHERE name = 'Trà Đá';


-- 6. Chèn dữ liệu vào bảng cart (Giỏ hàng của Khách hàng A)
INSERT INTO cart (cart_id, customer_id, product_id, quantity, price, status) VALUES
(gen_random_uuid(), (SELECT user_id FROM _customer1_id), (SELECT product_id FROM _prod_a1_id), 2, 55000.00, 'active'),
(gen_random_uuid(), (SELECT user_id FROM _customer1_id), (SELECT product_id FROM _prod_a3_id), 3, 5000.00, 'active');


-- 7. Chèn dữ liệu vào bảng "order" (Đơn hàng đã đặt)
INSERT INTO "order" (order_id, customer_id, restaurant_id, total_price, payment_status, order_status, shipping_name, shipping_address, shipping_phone, shipping_method) VALUES
(gen_random_uuid(), (SELECT user_id FROM _customer2_id), (SELECT restaurant_id FROM _rest_a_id), 115000.00, 'paid', 'delivering', 'Khách hàng B', '456 Đường Lê Lợi, Quận 1, TP.HCM', '0945678901', 'delivery'); -- 1. Order 1

-- Lấy order_id
SELECT order_id INTO TEMP TABLE _order1_id FROM "order" WHERE customer_id = (SELECT user_id FROM _customer2_id) AND total_price = 115000.00;


-- 8. Chèn dữ liệu vào bảng order_item (Chi tiết đơn hàng)
INSERT INTO order_item (order_item_id, order_id, product_id, quantity, price) VALUES
(gen_random_uuid(), (SELECT order_id FROM _order1_id), (SELECT product_id FROM _prod_a2_id), 2, 45000.00), -- 2 x Cơm Gà
(gen_random_uuid(), (SELECT order_id FROM _order1_id), (SELECT product_id FROM _prod_a1_id), 1, 55000.00); -- 1 x Phở Bò


-- 9. Chèn dữ liệu vào bảng payment (Thanh toán cho Đơn hàng 1)
INSERT INTO payment (payment_id, order_id, provider, amount, momo_transaction_id, status) VALUES
(gen_random_uuid(), (SELECT order_id FROM _order1_id), 'momo', 115000.00, 'MOMO123456789', 'success');


-- 10. Chèn dữ liệu vào bảng delivery_tracking (Theo dõi giao hàng cho Đơn hàng 1)
INSERT INTO delivery_tracking (tracking_id, order_id, driver_id, latitude, longitude, customer_latitude, customer_longitude, estimated_time_minutes, status) VALUES
(gen_random_uuid(), (SELECT order_id FROM _order1_id), (SELECT user_id FROM _driver1_id), 10.7770, 106.7005, 10.7750, 106.7020, 15, 'on_the_way');


-- 11. Chèn dữ liệu vào bảng order_notifications (Thông báo cho Khách hàng B)
INSERT INTO order_notifications (notification_id, order_id, user_id, type, title, message, is_read) VALUES
(gen_random_uuid(), (SELECT order_id FROM _order1_id), (SELECT user_id FROM _customer2_id), 'order_confirmed', 'Đơn hàng đã được xác nhận!', 'Đơn hàng #... của bạn đã được Nhà hàng A xác nhận.', TRUE),
(gen_random_uuid(), (SELECT order_id FROM _order1_id), (SELECT user_id FROM _customer2_id), 'on_the_way', 'Đơn hàng đang giao đến!', 'Tài xế đã nhận đơn hàng và đang trên đường đến với bạn.', FALSE);


-- Dọn dẹp TEMP TABLE
DROP TABLE _admin_id;
DROP TABLE _owner1_id;
DROP TABLE _owner2_id;
DROP TABLE _customer1_id;
DROP TABLE _customer2_id;
DROP TABLE _driver1_id;
DROP TABLE _rest_a_id;
DROP TABLE _rest_b_id;
DROP TABLE _cat_a1_id;
DROP TABLE _cat_a2_id;
DROP TABLE _prod_a1_id;
DROP TABLE _prod_a2_id;
DROP TABLE _prod_a3_id;
DROP TABLE _order1_id;

-- Kết thúc