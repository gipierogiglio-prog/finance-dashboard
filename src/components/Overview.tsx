import React from 'react';
import { Account, FinanceSummary } from '../types';
import { formatCurrency } from '../utils/format';

interface OverviewProps {
  accounts: Account[];
  summary: FinanceSummary;
}

export function Overview({ accounts, summary }: OverviewProps) {
  const isPositive = summary.net30d >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Saldo Total */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Saldo Total</span>
          <span className="text-lg">🏦</span>
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {formatCurrency(summary.totalBalance)}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          {accounts[0]?.name || 'Conta'}
        </p>
      </div>

      {/* Receitas do Período */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Receitas</span>
          <span className="text-lg">📈</span>
        </div>
        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
          {formatCurrency(summary.income30d)}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Total do período</p>
      </div>

      {/* Despesas do Período */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Despesas</span>
          <span className="text-lg">📉</span>
        </div>
        <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">
          {formatCurrency(summary.expenses30d)}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{summary.transactionCount} transações</p>
      </div>

      {/* Saldo do Período */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Saldo do Período</span>
          <span className="text-lg">{isPositive ? '✅' : '⚠️'}</span>
        </div>
        <p className={`text-2xl font-bold ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
          {formatCurrency(summary.net30d)}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          {isPositive ? 'Superávit' : 'Déficit'}
        </p>
      </div>
    </div>
  );
}