import { supabase } from "./supabaseClient";
import { Product } from "@/type/product";

/**
 * Fetch products. The new schema uses table `product` with UUID `product_id`.
 * Optional restaurantId can be provided to filter products.
 */
export async function fetchProducts(restaurantId?: string): Promise<Product[]> {
  // Select product fields and include the related restaurant status so we can
  // filter out products that belong to inactive restaurants.
  let query = supabase
    .from("product")
    .select(
      `product_id,name,description,price,image_url,category_id,restaurant_id,restaurant(status)`
    )
    .order("created_at", { ascending: true });

  if (restaurantId) query = query.eq("restaurant_id", restaurantId);

  const { data, error } = await query;
  if (error) throw error;

  // Filter out products whose restaurant is not active
  const activeProducts = (data ?? []).filter((item: any) => {
    // Supabase returns related table as an array when selecting related rows
    const restStatus = item.restaurant && Array.isArray(item.restaurant) && item.restaurant[0] ? item.restaurant[0].status : undefined;
    return !(restStatus && restStatus !== "active");
  });

  return activeProducts.map((item: any) => ({
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
    .select(`product_id,name,description,price,image_url,category_id,restaurant_id,restaurant(status)`)
    .eq("product_id", id)
    .single();

  if (error) throw error;

  // If the product belongs to an inactive restaurant, treat it as not found
  const prodRestStatus = data && data.restaurant && Array.isArray(data.restaurant) && data.restaurant[0] ? data.restaurant[0].status : undefined;
  if (prodRestStatus && prodRestStatus !== "active") return null;

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
    .select(`product_id,name,description,price,image_url,category_id,restaurant_id,restaurant(status)`)
    .order("created_at", { ascending: true });

  if (categoryId) query = query.eq("category_id", categoryId);
  if (restaurantId) query = query.eq("restaurant_id", restaurantId);

  const { data, error } = await query;
  if (error) throw error;

  const activeProducts = (data ?? []).filter((item: any) => {
    const restStatus = item.restaurant && Array.isArray(item.restaurant) && item.restaurant[0] ? item.restaurant[0].status : undefined;
    return !(restStatus && restStatus !== "active");
  });

  return activeProducts.map((item: any) => ({
    id: item.product_id,
    name: item.name,
    description: item.description,
    price: Number(item.price),
    image: item.image_url,
    category_id: item.category_id,
    restaurant_id: item.restaurant_id,
  }));
}
