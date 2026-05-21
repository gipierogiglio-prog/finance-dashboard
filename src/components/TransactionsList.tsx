import React from 'react';
import { Transaction } from '../types';
import { formatCurrency, formatDate, getCategoryIcon } from '../utils/format';

interface TransactionsListProps {
  transactions: Transaction[];
  limit?: number;
}

export function TransactionsList({ transactions, limit = 10 }: TransactionsListProps) {
  const displayed = transactions.slice(0, limit);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 transition-colors">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Transações Recentes
      </h3>
      <div className="space-y-1">
        {displayed.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-xl flex-shrink-0">{getCategoryIcon(tx.category)}</span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-xs">
                  {tx.description}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(tx.date)} · {tx.category}
                </p>
              </div>
            </div>
            <span
              className={`text-sm font-semibold flex-shrink-0 ml-2 ${
                tx.type === 'CREDIT'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {tx.type === 'CREDIT' ? '+' : '-'}
              {formatCurrency(tx.amount)}
            </span>
          </div>
        ))}
      </div>
      {transactions.length > limit && (
        <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-3">
          + {transactions.length - limit} transações no período
        </p>
      )}
    </div>
  );
}