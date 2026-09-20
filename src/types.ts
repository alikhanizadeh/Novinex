export type CategoryId = 'pots' | 'pans' | 'sets' | 'dining' | 'appliances' | 'tools';

export interface Category {
  id: CategoryId;
  nameFa: string;
  image: string;
  count: number;
}

export interface Product {
  id: string;
  nameFa: string;
  nameEn?: string;
  brand: string;
  category: CategoryId;
  price: number; // in Tomans
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  gallery?: string[];
  specs: string;
  description: string;
  isFeatured?: boolean;
  isSpecialOffer?: boolean;
  badge?: string;
  inStock: boolean;
  material?: string;
  origin?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface Review {
  id: string;
  name: string;
  role: string;
  rating: number;
  comment: string;
  date?: string;
  avatar?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  password?: string;
  role: string;
  joinedDate: string;
  avatar?: string;
}

export interface OrderHistoryItem {
  id: string;
  date: string;
  items: CartItem[];
  totalAmount: number;
  status: 'در حال پردازش' | 'ارسال شده' | 'تحویل شده';
  trackingCode: string;
  recipientName: string;
  phone: string;
  address: string;
}
