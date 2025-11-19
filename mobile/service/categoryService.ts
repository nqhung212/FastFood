import { supabase } from "./supabaseClient";
import { Category } from "@/type/category";

export async function fetchCategories(restaurantId?: string): Promise<Category[]> {
  let query = supabase.from("category").select(`category_id,name,restaurant_id`).order('created_at', { ascending: true });
  if (restaurantId) query = query.eq('restaurant_id', restaurantId);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map((c: any) => ({ id: c.category_id, name: c.name, restaurant_id: c.restaurant_id }));
}
