export type Product = {
  id: string; // UUID (product_id)
  name: string;
  description?: string;
  price: number;
  image?: string; // maps to image_url
  category_id?: string; // UUID
  restaurant_id?: string; // UUID
  categories?: string;
};
