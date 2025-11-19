CREATE TABLE public.cart (
    cart_id integer NOT NULL DEFAULT nextval('cart_cart_id_seq'::regclass),
    customer_id uuid,
    product_id integer,
    quantity integer NOT NULL DEFAULT 1,
    price numeric NOT NULL,
    added_at timestamp with time zone DEFAULT now(),
    status text DEFAULT 'active'::text,
    CONSTRAINT cart_pkey PRIMARY KEY (cart_id),
    CONSTRAINT cart_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customer(customer_id),
    CONSTRAINT cart_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(product_id)
);
CREATE TABLE public.category (
    category_id integer NOT NULL DEFAULT nextval('category_category_id_seq'::regclass),
    restaurant_id uuid,
    name text NOT NULL UNIQUE,
    icon_url text,
    status boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT category_pkey PRIMARY KEY (category_id),
    CONSTRAINT category_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurant(restaurant_id)
);
CREATE TABLE public.customer (
    customer_id uuid NOT NULL,
    customer_name text NOT NULL,
    address text,
    status boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    phone text,
    CONSTRAINT customer_pkey PRIMARY KEY (customer_id),
    CONSTRAINT customer_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES auth.users(id)
    );
CREATE TABLE public.order_detail (
    order_detail_id integer NOT NULL DEFAULT nextval('order_detail_order_detail_id_seq'::regclass),
    order_id integer,
    product_id integer,
    quantity integer NOT NULL DEFAULT 1,
    price numeric NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT order_detail_pkey PRIMARY KEY (order_detail_id),
    CONSTRAINT order_detail_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id),
    CONSTRAINT order_detail_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(product_id)
);
CREATE TABLE public.orders (
    order_id integer NOT NULL DEFAULT nextval('orders_order_id_seq'::regclass),
    restaurant_id uuid,
    customer_id uuid,
    order_date timestamp with time zone DEFAULT now(),
    delivery_address text,
    total_amount numeric NOT NULL DEFAULT 0.00,
    order_status text DEFAULT 'pending'::text,
    payment_status text DEFAULT 'unpaid'::text,
    note text,
    CONSTRAINT orders_pkey PRIMARY KEY (order_id),
    CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customer(customer_id),
    CONSTRAINT orders_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurant(restaurant_id)
);
CREATE TABLE public.payment (
    payment_id integer NOT NULL DEFAULT nextval('payment_payment_id_seq'::regclass),
    order_id integer,
    payment_date timestamp with time zone DEFAULT now(),
    amount numeric NOT NULL,
    method text,
    transaction_id text,
    note text,
    CONSTRAINT payment_pkey PRIMARY KEY (payment_id),
    CONSTRAINT payment_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id)
);
CREATE TABLE public.product (
    product_id integer NOT NULL DEFAULT nextval('product_product_id_seq'::regclass),
    restaurant_id uuid,
    product_name text NOT NULL,
    category_id integer,
    price numeric NOT NULL DEFAULT 0.00,
    image text,
    description text,
    status boolean NOT NULL DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT product_pkey PRIMARY KEY (product_id),
    CONSTRAINT product_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.category(category_id),
    CONSTRAINT product_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurant(restaurant_id)
);
CREATE TABLE public.restaurant (
    restaurant_id uuid NOT NULL,
    restaurant_name text NOT NULL,
    address text,
    phone text,
    status boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    image text,
    email text,
    CONSTRAINT restaurant_pkey PRIMARY KEY (restaurant_id),
    CONSTRAINT restaurant_user_fkey FOREIGN KEY (restaurant_id) REFERENCES auth.users(id)
);