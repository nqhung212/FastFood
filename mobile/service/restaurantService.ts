import { supabase } from "@/service/supabaseClient";
import { Restaurant } from "@/type/restaurant";

export async function fetchRestaurants(): Promise<Restaurant[]> {
  try {
    // Chỉ lấy các nhà hàng có status = 'active'
    const { data, error } = await supabase
      .from("restaurant")
      .select("restaurant_id,name,description,logo_url,status")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("fetchRestaurants error:", error);
      return [];
    }

    return (data || []).map((r: any) => ({
      id: r.restaurant_id,
      name: r.name,
      description: r.description,
      logo: r.logo_url,
      status: r.status,
    }));
  } catch (err) {
    console.error("fetchRestaurants unexpected error:", err);
    return [];
  }
}

export async function fetchRestaurantById(id: string): Promise<Restaurant | null> {
  try {
    const { data, error } = await supabase
      .from('restaurant')
      .select('restaurant_id,name,description,logo_url,status')
      .eq('restaurant_id', id)
      .limit(1)
      .single();

    if (error) {
      console.error('fetchRestaurantById error:', error);
      return null;
    }

    if (!data) return null;

    return {
      id: data.restaurant_id,
      name: data.name,
      description: data.description,
      logo: data.logo_url,
      status: data.status,
    };
  } catch (err) {
    console.error('fetchRestaurantById unexpected error:', err);
    return null;
  }
}
