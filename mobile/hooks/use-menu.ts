import { useEffect, useState } from "react";
import { fetchProductsByCategory } from "@/service/productService";
import { fetchCategories } from "@/service/categoryService";
import { Category } from "@/type/category";
import { Product } from "@/type/product";

export const useMenu = (restaurantId?: string) => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | "all">("all");
  const [loading, setLoading] = useState(true); // 🔹 thêm lại dòng này
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch filtered products whenever selectedCategory changes
  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
  const categoryId = selectedCategory === 'all' ? undefined : String(selectedCategory)
  const products = await fetchProductsByCategory(categoryId, restaurantId)
        if (!cancelled) setFilteredProducts(products)
      } catch (err: any) {
        console.error('Lỗi Supabase:', err)
        if (!cancelled) setError('Không thể tải sản phẩm từ Supabase.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [selectedCategory, restaurantId])

  // No client-side filtering anymore; handled by server

  useEffect(() => {
    async function loadCategories() {
      try {
        // fetch categories for the given restaurant when restaurantId is provided
        const data = await fetchCategories(restaurantId);
        setCategories(data);
        // reset selected category when restaurant changes
        setSelectedCategory('all');
      } catch (err) {
        console.error("Lỗi tải categories:", err);
      } finally {
        setLoadingCategories(false);
      }
    }
    loadCategories();
  }, [restaurantId]);

  return {
    filteredProducts,
    selectedCategory,
    setSelectedCategory,
    categories,
    loadingCategories,
    loading,
    error,
  };
};
