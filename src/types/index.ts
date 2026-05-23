export interface Account {
  id?: string;
  name: string;
  type: string;        // "BANK" | "CREDIT"
  subtype: string;
  balance: number;
  currency: string;
  credit_limit: number | null;
  credit_available: number | null;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  category: string;
  status?: 'POSTED' | 'PENDING';
  account_id?: string;
  account_name?: string;
  merchant?: string | null;
  payment_method?: string;
}

export interface FinanceSummary {
  totalBalance: number;
  income30d: number;
  expenses30d: number;
  net30d: number;
  transactionCount: number;
}

export interface DailyFlow {
  date: string;
  income: number;
  expense: number;
}

export interface SyncLog {
  id: number;
  synced_at: string;
  status: string;
  items_count: number;
  accounts_count: number;
  transactions_count: number;
  investments_count: number;
  error_message?: string | null;
}

export interface SystemStatus {
  status: string;
  database: string;
  pluggy_configured: boolean;
  last_sync: SyncLog | null;
  background_sync_running: boolean;
  accounts_count: number;
  transactions_count: number;
  investments_count: number;
}

export interface CategoryExpense {
  name: string;
  value: number;
  color: string;
}

export interface User {
  id: number;
  username: string;
  displayName?: string;
}

export interface PluggyConfig {
  configured: boolean;
  hasItem: boolean;
}

export interface SyncResult {
  success: boolean;
  items_count: number;
  accounts_count: number;
  transactions_count: number;
  investments_count: number;
  error_message: string | null;
  oauth_url: string | null;
}

export interface SyncResponse {
  message: string;
  sync_result?: SyncResult;
}

export interface ConnectedItem {
  id: string;
  item_id: string;
  name: string;
  status: string;
  created_at: string;
}