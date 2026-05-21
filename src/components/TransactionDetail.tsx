import React, { useEffect, useCallback } from 'react';
import { Transaction } from '../types';
import { formatCurrency, getCategoryIcon } from '../utils/format';

interface TransactionDetailProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

function formatDateLong(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function getTypeLabel(type: string): string {
  return type === 'CREDIT' ? 'Crédito' : 'Débito';
}

function getStatusLabel(status: string | undefined): string {
  if (status === 'PENDING') return 'Pendente';
  if (status === 'POSTED') return 'Confirmado';
  return status || '—';
}

export function TransactionDetail({ transaction, isOpen, onClose }: TransactionDetailProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !transaction) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm transition-opacity" />

      {/* Modal Card */}
      <div
        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden transition-all duration-200 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full
                     bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300
                     hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          aria-label="Fechar"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header with icon */}
        <div className="flex flex-col items-center pt-8 pb-5 px-6 border-b border-gray-100 dark:border-gray-700">
          {/* Large category icon */}
          <span className="text-5xl mb-3">{getCategoryIcon(transaction.category)}</span>

          {/* Amount */}
          <span
            className={`text-3xl sm:text-4xl font-bold ${
              transaction.type === 'CREDIT'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {transaction.type === 'CREDIT' ? '+' : '-'}
            {formatCurrency(transaction.amount)}
          </span>

          {/* Status badge */}
          <div className="mt-3">
            {transaction.status === 'PENDING' ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Pendente
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Confirmado
              </span>
            )}
          </div>
        </div>

        {/* Details body */}
        <div className="px-6 py-5 space-y-4">
          {/* Description - full, not truncated */}
          <div>
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
              Descrição
            </p>
            <p className="text-sm text-gray-900 dark:text-white leading-relaxed">
              {transaction.description}
            </p>
          </div>

          {/* Detail rows */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                Data
              </p>
              <p className="text-sm text-gray-900 dark:text-white">
                {formatDateLong(transaction.date)}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                Categoria
              </p>
              <p className="text-sm text-gray-900 dark:text-white">
                {transaction.category}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                Tipo
              </p>
              <p className="text-sm text-gray-900 dark:text-white">
                {getTypeLabel(transaction.type)}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                Conta
              </p>
              <p className="text-sm text-gray-900 dark:text-white">
                {transaction.account_name || '—'}
              </p>
            </div>
            {transaction.payment_method && (
              <div>
                <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                  Método de pagamento
                </p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {transaction.payment_method}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl text-sm font-medium
                       bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200
                       hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}