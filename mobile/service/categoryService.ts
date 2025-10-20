import { supabase } from "./supabaseClient";
import { Category } from "@/type/category";

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from("categories").select("*");
  if (error) throw error;
  return data || [];
}
