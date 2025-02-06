// Existing types
export type MenuItem = {
  id: number;
  DrinkName: string;
  description: string;
  price: number;
};

export type InsertMenuItem = Omit<MenuItem, 'id'>;

// CartItem type remains unchanged
export type CartItem = {
  DrinkName: string;
  quantity: number;
  price: number; // price per unit
};

// Additional types
export type OrderDetail = {
  DrinkName: string;
  quantity: number;
};

export type SalesEntry = {
  id: number; // Auto-generated
  Details: OrderDetail[];
  price: number;
  sale_date: string; // ISO 8601 format
};

// If not already defined, define Category, PaymentMethod, etc.