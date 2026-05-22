import React from 'react';
import { Account, FinanceSummary } from '../types';
import { formatCurrency } from '../utils/format';

interface OverviewProps {
  accounts: Account[];
  summary: FinanceSummary;
}

export function Overview({ accounts, summary }: OverviewProps) {
  const isPositive = summary.net30d >= 0;

  // Filter credit card accounts
  const creditCards = accounts.filter((a) => a.type === 'CREDIT');
  // BANK accounts
  const bankAccounts = accounts.filter((a) => a.type === 'BANK');

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Saldo Total (BANK accounts only) */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-5 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Saldo Total</span>
          <span className="text-lg">🏦</span>
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {formatCurrency(summary.totalBalance)}
        </p>
        <div className="mt-2 space-y-1.5">
          {bankAccounts.length > 0 ? (
            bankAccounts.map((acc) => (
              <div key={acc.name} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px] sm:max-w-[160px]">
                    {acc.name}
                  </span>
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap ml-2">
                  {formatCurrency(acc.balance)}
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-400 dark:text-gray-500">Nenhuma conta bancária</p>
          )}
        </div>
      </div>

      {/* Cartões de Crédito */}
      {creditCards.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-5 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Cartões de Crédito</span>
            <span className="text-lg">💳</span>
          </div>
          <div className="space-y-2">
            {creditCards.map((card) => (
              <div key={card.name}>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[100px] sm:max-w-[140px]">
                    {card.name}
                  </span>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">
                      Fatura: {formatCurrency(card.balance)}
                    </p>
                    {card.credit_limit != null && (
                      <p className="text-[10px] text-gray-400 dark:text-gray-500">
                        Limite: {formatCurrency(card.credit_limit)} · Disponível: {formatCurrency(card.credit_available ?? 0)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Receitas do Período */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-5 transition-colors">
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
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-5 transition-colors">
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
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-5 transition-colors">
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