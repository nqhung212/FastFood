
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE user_account (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT CHECK (role IN ('customer','restaurant_owner','admin')),
  phone TEXT,
  status BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE customer (
  customer_id UUID PRIMARY KEY REFERENCES user_account(user_id),
  default_address TEXT,
  phone TEXT
);

CREATE TABLE restaurant (
  restaurant_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES user_account(user_id),
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  status TEXT CHECK (status IN ('active','inactive')) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE restaurant
ADD COLUMN address TEXT,
ADD COLUMN latitude DOUBLE PRECISION,
ADD COLUMN longitude DOUBLE PRECISION;


CREATE TABLE category (
  category_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurant(restaurant_id),
  name TEXT NOT NULL,
  icon_url TEXT,
  status BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE product (
  product_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurant(restaurant_id),
  category_id UUID REFERENCES category(category_id),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  price NUMERIC NOT NULL,
  status BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cart (
  cart_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customer(customer_id),
  product_id UUID REFERENCES product(product_id),
  quantity INT DEFAULT 1,
  price NUMERIC NOT NULL,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'active'
);

CREATE TABLE "order" (
  order_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customer(customer_id),
  restaurant_id UUID REFERENCES restaurant(restaurant_id),
  total_price NUMERIC NOT NULL,
  payment_status TEXT CHECK (payment_status IN
    ('pending','paid','failed','refunded')
  ) DEFAULT 'pending',
  order_status TEXT CHECK (order_status IN
    ('pending','confirmed','preparing','delivering','completed','cancelled')
  ) DEFAULT 'pending',
  shipping_name TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  shipping_phone TEXT NOT NULL,
  shipping_method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_item (
  order_item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES "order"(order_id),
  product_id UUID REFERENCES product(product_id),
  quantity INT NOT NULL,
  price NUMERIC NOT NULL
);

CREATE TABLE payment (
  payment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES "order"(order_id),
  provider TEXT CHECK (provider IN ('momo','cod')),
  amount NUMERIC NOT NULL,
  momo_transaction_id TEXT,
  status TEXT CHECK (status IN ('pending','success','failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE drone (
  drone_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  status TEXT CHECK (status IN ('idle','assigned','delivering','charging','maintenance'))
      DEFAULT 'idle',
  battery_level INT CHECK (battery_level BETWEEN 0 AND 100) DEFAULT 100,
  max_payload_kg NUMERIC DEFAULT 3.0,
  current_lat NUMERIC(10, 8),
  current_lng NUMERIC(11, 8),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE drone_delivery (
  mission_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID UNIQUE REFERENCES "order"(order_id),
  drone_id UUID REFERENCES drone(drone_id),
  
  pickup_lat NUMERIC(10, 8),
  pickup_lng NUMERIC(11, 8),
  drop_lat NUMERIC(10, 8),
  drop_lng NUMERIC(11, 8),

  start_at TIMESTAMPTZ,
  finish_at TIMESTAMPTZ,

  status TEXT CHECK (status IN ('assigned','taking_off','enroute','delivered','failed'))
      DEFAULT 'assigned',

  updated_at TIMESTAMPTZ DEFAULT NOW()
);


