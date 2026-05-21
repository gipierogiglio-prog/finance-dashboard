import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { CategoryExpense } from '../types';
import { formatCurrency } from '../utils/format';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryChartProps {
  data: CategoryExpense[];
}

export function CategoryChart({ data }: CategoryChartProps) {
  const total = data.reduce((s, c) => s + c.value, 0);

  const chartData = {
    labels: data.map((c) => c.name),
    datasets: [
      {
        data: data.map((c) => c.value),
        backgroundColor: data.map((c) => c.color),
        borderColor: document.documentElement.classList.contains('dark') ? '#1F2937' : '#FFFFFF',
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: document.documentElement.classList.contains('dark') ? '#1F2937' : '#FFFFFF',
        titleColor: document.documentElement.classList.contains('dark') ? '#F9FAFB' : '#111827',
        bodyColor: document.documentElement.classList.contains('dark') ? '#D1D5DB' : '#374151',
        borderColor: document.documentElement.classList.contains('dark') ? '#374151' : '#E5E7EB',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: function (context: any) {
            const value = context.parsed;
            const pct = ((value / total) * 100).toFixed(1);
            return ` ${context.label}: ${formatCurrency(value)} (${pct}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 transition-colors">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Gastos por Categoria
      </h3>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="h-56 w-56 flex-shrink-0">
          {data.length > 0 ? (
            <Doughnut data={chartData} options={options} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
              Nenhum gasto no período
            </div>
          )}
        </div>
        <div className="flex-1 w-full space-y-2 min-w-0">
          {data.slice(0, 8).map((cat) => {
            const pct = ((cat.value / total) * 100).toFixed(1);
            return (
              <div key={cat.name} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                    {cat.name}
                  </span>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-gray-400 dark:text-gray-500 w-10 text-right">
                    {pct}%
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-24 text-right">
                    {formatCurrency(cat.value)}
                  </span>
                </div>
              </div>
            );
          })}
          {data.length > 8 && (
            <p className="text-xs text-center text-gray-400 dark:text-gray-500 pt-2">
              + {data.length - 8} categorias
            </p>
          )}
        </div>
      </div>
    </div>
  );
}