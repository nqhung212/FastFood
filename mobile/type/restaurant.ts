export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  // Trạng thái nhà hàng: 'active' | 'inactive'
  status?: string;
}
