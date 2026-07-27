export interface Property {
  id: string;
  description: string;
  initial_price: number;
  subsequent_price: number;
  type: string;
  address: string;
  city: string;
  // state: string
  latitude: number;
  longitude: number;
  images: string[];
  is_featured: boolean;
  is_sold: boolean;
  created_at: string;
}
