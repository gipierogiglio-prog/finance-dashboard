import React, { useState } from 'react';
import { Transaction } from '../types';
import { formatCurrency, formatDate, getCategoryIcon } from '../utils/format';
import { TransactionDetail } from './TransactionDetail';

interface TransactionsListProps {
  transactions: Transaction[];
  limit?: number;
}

export function TransactionsList({ transactions, limit = 10 }: TransactionsListProps) {
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const displayed = transactions.slice(0, limit);

  const openDetail = (tx: Transaction) => {
    setSelectedTx(tx);
    setDetailOpen(true);
  };

  const closeDetail = () => {
    setDetailOpen(false);
    setTimeout(() => setSelectedTx(null), 200);
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-5 transition-colors">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
          Transações Recentes
        </h3>
        <div className="space-y-1">
          {displayed.map((tx) => (
            <div
              key={tx.id}
              onClick={() => openDetail(tx)}
              className="flex items-center justify-between py-2.5 sm:py-3 px-1.5 sm:px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors min-h-[52px] cursor-pointer"
            >
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 mr-2">
              <span className="text-lg sm:text-xl flex-shrink-0">{getCategoryIcon(tx.category)}</span>
              <div className="min-w-0 max-w-[130px] sm:max-w-xs">
                <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
                  {tx.description}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {formatDate(tx.date)} · {tx.category}
                </p>
              </div>
            </div>
            <span
              className={`text-xs sm:text-sm font-semibold flex-shrink-0 whitespace-nowrap ${
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

      <TransactionDetail
        transaction={selectedTx}
        isOpen={detailOpen}
        onClose={closeDetail}
      />
    </>
  );
}