import { supabase } from "./supabaseClient";
import { Product } from "@/type/product";

/**
 * Lấy danh sách tất cả sản phẩm (đã có rồi)
 */
export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      description,
      price,
      image,
      category_id
    `);

  if (error) throw error;

  return data.map((item: any) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    price: Number(item.price),
    image: item.image,
    category_id: item.category_id,
  }));
}

export async function fetchProductById(id: number) {
  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      description,
      price,
      image,
      category_id,
      categories ( name )
    `)
    .eq("id", id)
    .single();

  if (error) throw error;

  return {
    ...data,
    category: data.categories?.[0]?.name || "",
  };
}
export async function fetchProductsByCategory(categoryId?: number): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select('id,name,description,price,image,category_id')
    .order('id', { ascending: true })

  if (typeof categoryId === 'number') {
    query = query.eq('category_id', categoryId)
  }

  const { data, error } = await query
  if (error) throw error
  return (data ?? []).map((item: any) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    price: Number(item.price),
    image: item.image,
    category_id: item.category_id,
  }))
}
