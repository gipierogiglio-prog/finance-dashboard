import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { DailyFlow } from '../types';
import { formatDateLong } from '../utils/format';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface FlowChartProps {
  data: DailyFlow[];
}

export function FlowChart({ data }: FlowChartProps) {
  const chartData = {
    labels: data.map((d) => formatDateLong(d.date)),
    datasets: [
      {
        label: 'Receitas',
        data: data.map((d) => d.income),
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
        borderRadius: 4,
        barPercentage: 0.6,
      },
      {
        label: 'Despesas',
        data: data.map((d) => d.expense),
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
        borderRadius: 4,
        barPercentage: 0.6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: document.documentElement.classList.contains('dark') ? '#D1D5DB' : '#374151',
          usePointStyle: true,
          padding: 16,
        },
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
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#9CA3AF' : '#6B7280',
          maxRotation: 45,
          font: { size: 10 },
        },
      },
      y: {
        grid: {
          color: document.documentElement.classList.contains('dark') ? '#374151' : '#F3F4F6',
        },
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#9CA3AF' : '#6B7280',
          font: { size: 11 },
          callback: function (value: any) {
            return new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              notation: 'compact',
              compactDisplay: 'short',
            }).format(value);
          },
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 transition-colors">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Fluxo Financeiro
      </h3>
      <div className="h-72">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}