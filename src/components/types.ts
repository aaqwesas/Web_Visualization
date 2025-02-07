import { User } from '@supabase/supabase-js';


export type MenuItem = {
  id: number;
  DrinkName: string;
  description: string;
  price: number;
};

export type InsertMenuItem = Omit<MenuItem, 'id'>;


export type CartItem = {
  DrinkName: string;
  quantity: number;
  price: number; 
};

export type OrderDetail = {
  DrinkName: string;
  quantity: number;
};

export type SalesEntry = {
  id: number; // Auto-generated
  Details: OrderDetail[];
  price: number;
  sale_date: string;
};


export type AuthContextType = {
  user: User | null;
  role: string | null; // Added role state
  loading: boolean; // Added loading state
  signUp: (email: string, password: string) => Promise<void>; // Removed role parameter
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};
