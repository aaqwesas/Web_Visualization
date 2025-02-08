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

export interface SaleDetail {
  quantity: number;
  DrinkName: string;
}

export interface Sale {
  id: number;
  Details: SaleDetail[];
  price: number;
  sale_date: string; // ISO date string, e.g., '2025-02-08'
}

export interface AggregatedDataPoint {
  period: string; // e.g., '2023-09-01' for Daily, '2023-W35' for Weekly, '2023-09' for Monthly
  totalSales: number;
}

export interface AggregatedRevenue {
  name: string;      // DrinkName
  revenue: number;   // Total revenue in dollars or appropriate currency unit
}