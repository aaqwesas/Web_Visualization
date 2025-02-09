// src/components/types.ts
import { User } from '@supabase/supabase-js';

/**
 * Represents an item on the menu.
 */
export type MenuItem = {
  id : number;
  DrinkName: string;
  description: string;
  price: number;
  created_at?: Date;
}

/**
 * Represents the data required to insert a new menu item.
 */
export type InsertMenuItem = Omit<MenuItem, 'id'>;

/**
 * Represents an item in the user's cart.
 */
export type CartItem = {
  DrinkName: string;
  quantity: number;
  price: number;
}

/**
 * Represents the details of an order.
 */
export type OrderDetail = {
  DrinkName: string;
  quantity: number;
}

/**
 * Represents a sales entry fetched from Supabase.
 */
export type Sale = {
  id: number;
  Details: SaleDetail[];
  price: number;
  sale_date: string; // ISO date string, e.g., '2025-02-08'
}

/**
 * Represents the details of a sale.
 */
export type SaleDetail = {
  quantity: number;
  DrinkName: string;
}

/**
 * Represents aggregated data points for charts (e.g., Pie Chart).
 */
export type PieData = {
  name: string;
  value: number;
}

/**
 * Represents aggregated sales data over time.
 */
export type AggregatedDataPoint =  {
  period: string; // e.g., '2023-09-01' for Daily, '2023-W35' for Weekly, '2023-09' for Monthly
  totalSales: number;
}

/**
 * Represents aggregated revenue data for drinks.
 */
export type AggregatedRevenue = {
  name: string;    // DrinkName
  revenue: number; // Total revenue in dollars or appropriate currency unit
}

/**
 * Defines the shape of the authentication context.
 */
export type AuthContextType = {
  user: User | null;
  role: string | null; // User's role (e.g., 'admin', 'user')
  loading: boolean;    // Indicates if authentication status is being determined
  signUp: (email: string, password: string, role: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}