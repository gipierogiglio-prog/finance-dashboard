export interface Account {
  name: string;
  subtype: string;
  balance: number;
  currency: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  category: string;
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