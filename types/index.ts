export interface Property {
  id: string;
  type: string;
  brief_description: string;
  detailed_description: string;
  initial_price: number;
  subsequent_price: number;
  address: string;
  city: string;
  state: string;
  mobile_number: string;
  whatsapp_number: string;
  latitude: number;
  longitude: number;
  images: string[];
  is_featured: boolean;
  is_sold: boolean;
  created_at: string;
}
