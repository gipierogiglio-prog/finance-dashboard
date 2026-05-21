import React, { useState } from 'react';
import { Transaction } from '../types';
import { formatCurrency, formatDate, getCategoryIcon } from '../utils/format';

interface StatementProps {
  transactions: Transaction[];
}

type SortKey = 'date' | 'amount' | 'category';
type SortDir = 'asc' | 'desc';

export function Statement({ transactions }: StatementProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'CREDIT' | 'DEBIT'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const categories = Array.from(new Set(transactions.map((t) => t.category))).sort();

  const filtered = transactions
    .filter((t) => {
      if (typeFilter !== 'ALL' && t.type !== typeFilter) return false;
      if (categoryFilter !== 'ALL' && t.category !== categoryFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'date') cmp = a.date.localeCompare(b.date);
      else if (sortKey === 'amount') cmp = a.amount - b.amount;
      else if (sortKey === 'category') cmp = a.category.localeCompare(b.category);
      return sortDir === 'asc' ? cmp : -cmp;
    });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <span className="ml-1 text-gray-300 dark:text-gray-600">↕</span>;
    return <span className="ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-5 transition-colors">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Extrato</h3>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-3 sm:mb-4">
        <input
          type="text"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-h-[44px] px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                     placeholder-gray-400 dark:placeholder-gray-500
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as any)}
          className="min-h-[44px] px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ALL">Todos</option>
          <option value="CREDIT">Receitas</option>
          <option value="DEBIT">Despesas</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="min-h-[44px] px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ALL">Todas categorias</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Table - scrollable horizontally on mobile */}
      <div className="overflow-x-auto -mx-1 sm:mx-0">
        <table className="w-full text-sm min-w-[400px] sm:min-w-0">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-2.5 sm:py-3 px-1.5 sm:px-2 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider hidden sm:table-cell">
                #
              </th>
              <th
                className="text-left py-2.5 sm:py-3 px-1.5 sm:px-2 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider cursor-pointer select-none whitespace-nowrap"
                onClick={() => toggleSort('date')}
              >
                Data <SortIcon column="date" />
              </th>
              <th className="text-left py-2.5 sm:py-3 px-1.5 sm:px-2 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                Descrição
              </th>
              <th
                className="text-left py-2.5 sm:py-3 px-1.5 sm:px-2 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider cursor-pointer select-none hidden sm:table-cell"
                onClick={() => toggleSort('category')}
              >
                Categoria <SortIcon column="category" />
              </th>
              <th
                className="text-right py-2.5 sm:py-3 px-1.5 sm:px-2 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider cursor-pointer select-none whitespace-nowrap"
                onClick={() => toggleSort('amount')}
              >
                Valor <SortIcon column="amount" />
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400 dark:text-gray-500">
                  Nenhuma transação encontrada
                </td>
              </tr>
            ) : (
              filtered.map((tx, idx) => (
                <tr
                  key={tx.id}
                  className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                >
                  <td className="py-2.5 sm:py-3 px-1.5 sm:px-2 text-gray-400 dark:text-gray-500 text-xs hidden sm:table-cell">
                    {idx + 1}
                  </td>
                  <td className="py-2.5 sm:py-3 px-1.5 sm:px-2 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    <span className="text-xs sm:text-sm">{formatDate(tx.date)}</span>
                  </td>
                  <td className="py-2.5 sm:py-3 px-1.5 sm:px-2 max-w-[130px] sm:max-w-xs">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className="flex-shrink-0">{getCategoryIcon(tx.category)}</span>
                      <span className="text-gray-900 dark:text-white truncate text-xs sm:text-sm">
                        {tx.description}
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 sm:py-3 px-1.5 sm:px-2 text-gray-500 dark:text-gray-400 hidden sm:table-cell text-xs sm:text-sm">
                    {tx.category}
                  </td>
                  <td
                    className={`py-2.5 sm:py-3 px-1.5 sm:px-2 text-right font-medium whitespace-nowrap text-xs sm:text-sm ${
                      tx.type === 'CREDIT'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {tx.type === 'CREDIT' ? '+' : '-'}
                    <span className="hidden sm:inline">{formatCurrency(tx.amount)}</span>
                    <span className="sm:hidden">{formatCurrency(tx.amount).replace('R$ ', 'R$')}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 text-center">
        {filtered.length} de {transactions.length} transações
      </p>
    </div>
  );
}