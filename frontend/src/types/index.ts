export type UserRole = 'super_admin' | 'dev_admin' | 'billing_admin' | 'stock_admin' | 'shop_owner' | 'shop_staff';

export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  phone: string;
  avatar?: string;
  language: string;
}

export interface Shop {
  id: string;
  name: string;
  shop_type: string;
  city: string;
  state: string;
  health_score: number;
  health_score_display: string;
  products_count: number;
  is_active: boolean;
  subscription_plan: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category_name: string;
  supplier_name: string;
  cost_price: number;
  selling_price: number;
  stock_quantity: number;
  min_stock_level: number;
  unit: string;
  stock_status: 'in_stock' | 'low_stock' | 'out_of_stock';
  profit_margin: number;
  is_dead_stock: boolean;
  last_sold_at: string | null;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  customer_name: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  paid_amount: number;
  payment_status: 'paid' | 'partial' | 'unpaid' | 'credit';
  payment_mode: string;
  created_at: string;
}

export interface DashboardStats {
  today_sales: number;
  today_transactions: number;
  week_sales: number;
  month_sales: number;
  sales_growth: number;
  profit_margin: number;
  stock_turnover: number;
  pending_payments: number;
  active_products: number;
  low_stock_items: number;
  out_of_stock_items: number;
  dead_stock_value: number;
}

export interface AIInsight {
  id: string;
  insight_type: string;
  title: string;
  message: string;
  data: Record<string, unknown>;
  priority: 'low' | 'medium' | 'high' | 'critical';
  is_read: boolean;
  is_actioned: boolean;
  created_at: string;
}

export interface TrendDataPoint {
  date: string;
  sales: number;
  transactions: number;
}

export interface SalesByHour {
  hour: number;
  sales: number;
}

export interface TopProduct {
  name: string;
  quantity: number;
  revenue: number;
  growth: number;
}

export interface ReorderItem {
  id: string;
  product_name: string;
  current_stock: number;
  avg_daily_sales: number;
  expected_stockout_days: number;
  suggested_quantity: number;
  supplier_name: string;
  supplier_phone: string;
  status: string;
}

export interface CustomerPrediction {
  id: string;
  customer_name: string;
  customer_phone: string;
  product_name: string;
  predicted_next_purchase_date: string;
  confidence_score: number;
  purchase_frequency_days: number;
  last_purchased_date: string;
  whatsapp_sent: boolean;
}
