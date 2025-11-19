import { supabase } from "./supabaseClient";
import { Product } from "@/type/product";

/**
 * Fetch products. The new schema uses table `product` with UUID `product_id`.
 * Optional restaurantId can be provided to filter products.
 */
export async function fetchProducts(restaurantId?: string): Promise<Product[]> {
  let query = supabase
    .from("product")
    .select(
      `product_id,name,description,price,image_url,category_id,restaurant_id`
    )
    .order("created_at", { ascending: true });

  if (restaurantId) query = query.eq("restaurant_id", restaurantId);

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map((item: any) => ({
    id: item.product_id,
    name: item.name,
    description: item.description,
    price: Number(item.price),
    image: item.image_url,
    category_id: item.category_id,
    restaurant_id: item.restaurant_id,
  }));
}

export async function fetchProductById(id: string) {
  const { data, error } = await supabase
    .from("product")
    .select(`product_id,name,description,price,image_url,category_id,restaurant_id`)
    .eq("product_id", id)
    .single();

  if (error) throw error;

  return {
    id: data.product_id,
    name: data.name,
    description: data.description,
    price: Number(data.price),
    image: data.image_url,
    category_id: data.category_id,
    restaurant_id: data.restaurant_id,
  };
}

export async function fetchProductsByCategory(categoryId?: string, restaurantId?: string): Promise<Product[]> {
  let query = supabase
    .from("product")
    .select(`product_id,name,description,price,image_url,category_id,restaurant_id`)
    .order("created_at", { ascending: true });

  if (categoryId) query = query.eq("category_id", categoryId);
  if (restaurantId) query = query.eq("restaurant_id", restaurantId);

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map((item: any) => ({
    id: item.product_id,
    name: item.name,
    description: item.description,
    price: Number(item.price),
    image: item.image_url,
    category_id: item.category_id,
    restaurant_id: item.restaurant_id,
  }));
}
