import { useState, useEffect, useCallback } from 'react';
import { Account, Transaction, FinanceSummary, DailyFlow, CategoryExpense, SystemStatus } from '../types';
import { api, checkApiConnection } from '../api/client';
import {
  accounts as mockAccounts,
  transactions as mockTransactions,
  summary as mockSummary,
  dailyFlow as mockDailyFlow,
  getCategoryExpenses,
  categoryColors,
} from '../data/mockData';

interface FinanceData {
  accounts: Account[];
  transactions: Transaction[];
  summary: FinanceSummary;
  dailyFlow: DailyFlow[];
  categoryExpenses: CategoryExpense[];
  loading: boolean;
  error: string | null;
  isOnline: boolean;
}

/** Compute daily flow from a list of transactions */
function computeDailyFlow(txList: Transaction[], days: number): DailyFlow[] {
  const flow: DailyFlow[] = [];
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayTx = txList.filter((t) => t.date === dateStr);
    const income = dayTx
      .filter((t) => t.type === 'CREDIT')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = dayTx
      .filter((t) => t.type === 'DEBIT')
      .reduce((sum, t) => sum + t.amount, 0);
    flow.push({ date: dateStr, income, expense });
  }
  return flow;
}

/** Generate a deterministic color for any category name */
function getCategoryColor(category: string): string {
  if (categoryColors[category]) return categoryColors[category];
  // Generate a consistent color from the category name
  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16',
    '#06B6D4', '#A855F7', '#F43F5E', '#22C55E', '#EAB308',
  ];
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

/** Map API transaction response to frontend Transaction type */
function mapTransaction(tx: any): Transaction {
  return {
    id: tx.id,
    date: tx.date,
    description: tx.description || '',
    // Pluggy returns DEBITs as negative and CREDITs as positive;
    // frontend expects positive amounts with type field indicating sign
    amount: Math.abs(tx.amount),
    type: tx.type === 'CREDIT' ? 'CREDIT' : 'DEBIT',
    category: tx.category || 'Outros',
  };
}

/** Map API account to frontend Account type */
function mapAccount(acc: any): Account {
  return {
    name: acc.name,
    subtype: acc.subtype,
    balance: acc.balance,
    currency: acc.currency || 'BRL',
  };
}

export function useFinanceData(periodDays: number = 30): FinanceData {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(false);

  // Cached API data
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<FinanceSummary>({
    totalBalance: 0,
    income30d: 0,
    expenses30d: 0,
    net30d: 0,
    transactionCount: 0,
  });
  const [dailyFlow, setDailyFlow] = useState<DailyFlow[]>([]);
  const [categoryExpenses, setCategoryExpenses] = useState<CategoryExpense[]>([]);
  const [initialized, setInitialized] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Calculate date range
    const now = new Date();
    const dateTo = now.toISOString().split('T')[0];
    const dateFrom = new Date(now.getTime() - periodDays * 86400000).toISOString().split('T')[0];

    try {
      // Check connection first
      const connected = await checkApiConnection();
      setIsOnline(connected);

      if (!connected) {
        throw new Error('API não disponível');
      }

      // Fetch all data in parallel
      const [accountsRes, txsRes, summaryRes, categoriesRes] = await Promise.all([
        api.get<any>('/accounts'),
        api.get<any>('/transactions', {
          dateFrom,
          dateTo,
          limit: 200,
        }),
        api.get<any>('/transactions/summary', {
          dateFrom,
          dateTo,
        }),
        api.get<any>('/categories', {
          dateFrom,
          dateTo,
        }),
      ]);

      // Map accounts
      const mappedAccounts = accountsRes.accounts?.map(mapAccount) || [];
      setAccounts(mappedAccounts);

      // Map transactions
      const mappedTxs = txsRes.transactions?.map(mapTransaction) || [];
      setTransactions(mappedTxs);

      // Map summary - expenses come as negative from Pluggy, normalize them
      const rawIncome = summaryRes.total_income || 0;
      const rawExpenses = summaryRes.total_expenses || 0;
      const absExpenses = Math.abs(rawExpenses);
      const totalBalance = mappedAccounts.reduce((sum: number, a: Account) => sum + a.balance, 0);
      setSummary({
        totalBalance,
        income30d: rawIncome,
        expenses30d: absExpenses,
        net30d: rawIncome - absExpenses,
        transactionCount: summaryRes.transaction_count || mappedTxs.length,
      });

      // Compute daily flow from transactions
      setDailyFlow(computeDailyFlow(mappedTxs, periodDays));

      // Map categories - amounts come as negative from Pluggy
      const mappedCats = (categoriesRes.categories || []).map((c: any) => ({
        name: c.category,
        value: Math.round(Math.abs(c.total_amount) * 100) / 100,
        color: getCategoryColor(c.category),
      }));
      setCategoryExpenses(mappedCats);

      setInitialized(true);
    } catch (err: any) {
      console.warn('[FinanceData] API unavailable, using mock data:', err.message);
      setError(err.message);
      setIsOnline(false);

      // Fall back to mock data
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - periodDays);
      const cutoffStr = cutoff.toISOString().split('T')[0];

      const filteredTxs = mockTransactions.filter((t) => t.date >= cutoffStr);
      setAccounts(mockAccounts);

      const filteredSummary: FinanceSummary = {
        totalBalance: mockAccounts.reduce((s, a) => s + a.balance, 0),
        income30d: filteredTxs.filter((t) => t.type === 'CREDIT').reduce((s, t) => s + t.amount, 0),
        expenses30d: filteredTxs.filter((t) => t.type === 'DEBIT').reduce((s, t) => s + t.amount, 0),
        net30d: 0,
        transactionCount: filteredTxs.length,
      };
      filteredSummary.net30d = filteredSummary.income30d - filteredSummary.expenses30d;
      setSummary(filteredSummary);

      setTransactions(filteredTxs);
      setDailyFlow(computeDailyFlow(filteredTxs, periodDays));
      setCategoryExpenses(getCategoryExpenses(filteredTxs));
      setInitialized(true);
    } finally {
      setLoading(false);
    }
  }, [periodDays]);

  // Fetch on mount and when periodDays changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    accounts,
    transactions,
    summary,
    dailyFlow,
    categoryExpenses,
    loading,
    error,
    isOnline,
  };
}

/** Fetch system status from API, with mock fallback */
export async function fetchSystemStatus(): Promise<SystemStatus | null> {
  try {
    const data = await api.get<any>('/status');
    return {
      status: data.status,
      database: data.database,
      pluggy_configured: data.pluggy_configured,
      last_sync: data.last_sync || null,
      background_sync_running: data.background_sync_running,
      accounts_count: data.accounts_count || 0,
      transactions_count: data.transactions_count || 0,
      investments_count: data.investments_count || 0,
    };
  } catch {
    return null;
  }
}

/** Trigger a manual sync */
export async function triggerSync(): Promise<{ message: string; sync_result?: any } | null> {
  try {
    const result = await api.post<any>('/sync');
    return result;
  } catch {
    return null;
  }
}
