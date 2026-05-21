import React from 'react';

interface PeriodFilterProps {
  value: number;
  onChange: (days: number) => void;
  compact?: boolean;
}

const periods = [
  { label: '7', value: 7, fullLabel: '7 dias' },
  { label: '15', value: 15, fullLabel: '15 dias' },
  { label: '30', value: 30, fullLabel: '30 dias' },
];

export function PeriodFilter({ value, onChange, compact = false }: PeriodFilterProps) {
  return (
    <div className="flex items-center gap-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-1 transition-colors">
      {periods.map((p) => (
        <button
          key={p.value}
          onClick={() => onChange(p.value)}
          className={`px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-all min-h-[36px] min-w-[36px] sm:min-w-0 ${
            value === p.value
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          title={p.fullLabel}
        >
          {compact ? p.label : p.fullLabel}
        </button>
      ))}
    </div>
  );
}