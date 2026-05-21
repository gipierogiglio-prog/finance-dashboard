export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
}

export function formatDateLong(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
  });
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    'Serviços': '🔧',
    'Gas': '⛽',
    'Groceries': '🛒',
    'Gas stations': '⛽',
    'Proceeds': '💰',
    'Salário': '💼',
    'Saúde': '💊',
    'Entretenimento': '🎬',
    'Shopping': '🛍️',
    'Alimentação': '🍽️',
    'Transporte': '🚗',
    'Rendimentos': '📈',
    'Same person transfer': '🔄',
    'Moradia': '🏠',
    'Lazer': '🎯',
  };
  return icons[category] || '📄';
}

export function getPeriodDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
}

export function filterTransactions(tx: { date: string }[], days: number) {
  const cutoff = getPeriodDate(days);
  return tx.filter((t) => t.date >= cutoff);
}

export function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}