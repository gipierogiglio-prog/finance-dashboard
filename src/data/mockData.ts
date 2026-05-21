import { Account, Transaction, FinanceSummary } from '../types';

export const accounts: Account[] = [
  {
    name: 'Mercado Pago',
    subtype: 'CHECKING_ACCOUNT',
    balance: 62.02,
    currency: 'BRL',
  },
];

const seedTransactions: Omit<Transaction, 'id'>[] = [
  { date: '2026-05-21', description: 'Dinheiro retirado Economia', amount: 50.00, type: 'CREDIT', category: 'Same person transfer', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'TED' },
  { date: '2026-05-21', description: 'Pagamento com QR Pix WIINPAY SERVICOS LT', amount: 16.80, type: 'DEBIT', category: 'Serviços', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-05-20', description: 'Pagamento com QR Pix PAPALEGUAS GAS AERO', amount: 115.00, type: 'DEBIT', category: 'Gas', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-05-20', description: 'Rendimentos', amount: 0.06, type: 'CREDIT', category: 'Rendimentos', status: 'POSTED', account_name: 'Mercado Pago' },
  { date: '2026-05-19', description: 'Pagamento com QR Pix DRIFT COMERCIO DE A', amount: 43.01, type: 'DEBIT', category: 'Groceries', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-05-19', description: 'Rendimentos', amount: 0.08, type: 'CREDIT', category: 'Rendimentos', status: 'POSTED', account_name: 'Mercado Pago' },
  { date: '2026-05-18', description: 'Pagamento com QR Pix J L BARROS MERCEARI', amount: 10.10, type: 'DEBIT', category: 'Groceries', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-05-17', description: 'Pagamento com QR Pix Faith Posto De Comb', amount: 100.00, type: 'DEBIT', category: 'Gas stations', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-05-16', description: 'Pagamento com QR Pix JENNIFER DANTAS LIM', amount: 24.27, type: 'DEBIT', category: 'Serviços', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-05-15', description: 'Salário', amount: 15000.00, type: 'CREDIT', category: 'Salário', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-05-14', description: 'Pagamento com QR Pix FARMACIA DO TRABALHAD', amount: 89.90, type: 'DEBIT', category: 'Saúde', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-05-13', description: 'Assinatura Netflix', amount: 55.90, type: 'DEBIT', category: 'Entretenimento', status: 'PENDING', account_name: 'Mercado Pago', payment_method: 'Cartão de Crédito' },
  { date: '2026-05-12', description: 'Transferência recebida JOAO SANTOS', amount: 1200.00, type: 'CREDIT', category: 'Same person transfer', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-05-11', description: 'Pagamento com QR Pix MERCADO LIVRE', amount: 249.99, type: 'DEBIT', category: 'Shopping', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-05-10', description: 'Pagamento com QR Pix ACQUA ACADEMIA', amount: 119.90, type: 'DEBIT', category: 'Saúde', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-05-09', description: 'Pagamento com QR Pix IFOOD', amount: 47.50, type: 'DEBIT', category: 'Alimentação', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-05-08', description: 'Pagamento com QR Pix UBER', amount: 23.40, type: 'DEBIT', category: 'Transporte', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-05-07', description: 'Rendimentos', amount: 0.05, type: 'CREDIT', category: 'Rendimentos', status: 'POSTED', account_name: 'Mercado Pago' },
  { date: '2026-05-06', description: 'Pagamento com QR Pix POSTO PETROBRAS', amount: 187.00, type: 'DEBIT', category: 'Gas stations', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-05-05', description: 'Pagamento com QR Pix AMERICANAS', amount: 159.90, type: 'DEBIT', category: 'Shopping', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-05-04', description: 'Pagamento com QR Pix CASA DO PÃO', amount: 12.50, type: 'DEBIT', category: 'Alimentação', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-05-03', description: 'Pagamento de Boleto CAIXA', amount: 890.00, type: 'DEBIT', category: 'Serviços', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'Boleto' },
  { date: '2026-05-02', description: 'Pagamento com QR Pix RENNER', amount: 299.90, type: 'DEBIT', category: 'Shopping', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-05-01', description: 'Pagamento com QR Pix SAMSUNG', amount: 34.90, type: 'DEBIT', category: 'Serviços', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-04-30', description: 'Freela Design Sprint', amount: 3500.00, type: 'CREDIT', category: 'Proceeds', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-04-29', description: 'Pagamento com QR Pix TIM CELULAR', amount: 69.99, type: 'DEBIT', category: 'Serviços', status: 'PENDING', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-04-28', description: 'Pagamento com QR Pix VIVO FIBRA', amount: 119.99, type: 'DEBIT', category: 'Serviços', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-04-27', description: 'Pagamento com QR Pix EXTRA HIPER', amount: 234.76, type: 'DEBIT', category: 'Groceries', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-04-26', description: 'Pagamento com QR Pix MCDONALDS', amount: 42.50, type: 'DEBIT', category: 'Alimentação', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-04-25', description: 'Pagamento com QR Pix 99 TAXI', amount: 18.90, type: 'DEBIT', category: 'Transporte', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-04-24', description: 'Pagamento com QR Pix ASSAI ATACADISTA', amount: 367.42, type: 'DEBIT', category: 'Groceries', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-04-23', description: 'Pagamento com QR Pix CARREFOUR', amount: 189.33, type: 'DEBIT', category: 'Groceries', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-04-22', description: 'Pagamento com QR Pix DISNEY PLUS', amount: 43.90, type: 'DEBIT', category: 'Entretenimento', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'Cartão de Crédito' },
  { date: '2026-04-21', description: 'Pagamento com QR Pix SPOTIFY', amount: 21.90, type: 'DEBIT', category: 'Entretenimento', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'Cartão de Crédito' },
  { date: '2026-04-20', description: 'Pagamento com QR Pix PRIME VIDEO', amount: 19.90, type: 'DEBIT', category: 'Entretenimento', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'Cartão de Crédito' },
  { date: '2026-04-19', description: 'Pagamento com QR Pix DECATHLON', amount: 189.97, type: 'DEBIT', category: 'Shopping', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-04-18', description: 'Pagamento com QR Pix HORTIFRUTI', amount: 56.80, type: 'DEBIT', category: 'Groceries', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-04-17', description: 'Pagamento com QR Pix IGUATEMI ESTACION', amount: 32.00, type: 'DEBIT', category: 'Transporte', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-04-16', description: 'Pagamento com QR Pix FARMACIA POPULAR', amount: 34.60, type: 'DEBIT', category: 'Saúde', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-04-15', description: 'Salário', amount: 15000.00, type: 'CREDIT', category: 'Salário', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-04-14', description: 'Pagamento com QR Pix LOJAS RENNER', amount: 129.90, type: 'DEBIT', category: 'Shopping', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-04-13', description: 'Pagamento com QR Pix OUTBACK', amount: 187.50, type: 'DEBIT', category: 'Alimentação', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-04-12', description: 'Pagamento com QR Pix MAGALU', amount: 899.00, type: 'DEBIT', category: 'Shopping', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-04-11', description: 'Transferência recebida PAGAMENTO CLIENTE', amount: 4200.00, type: 'CREDIT', category: 'Proceeds', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-04-10', description: 'Pagamento com QR Pix HAPVIDA', amount: 189.90, type: 'DEBIT', category: 'Saúde', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-04-09', description: 'Pagamento com QR Pix SHEIN', amount: 157.84, type: 'DEBIT', category: 'Shopping', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-04-08', description: 'Pagamento com QR Pix LOCALIZA', amount: 245.00, type: 'DEBIT', category: 'Transporte', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-04-07', description: 'Rendimentos', amount: 0.07, type: 'CREDIT', category: 'Rendimentos', status: 'POSTED', account_name: 'Mercado Pago' },
  { date: '2026-04-06', description: 'Pagamento com QR Pix FEIRA DO CEASA', amount: 132.00, type: 'DEBIT', category: 'Groceries', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-04-05', description: 'Pagamento com QR Pix HAMBURGUERIA BOB', amount: 62.90, type: 'DEBIT', category: 'Alimentação', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-04-04', description: 'Pagamento com QR Pix CINEMARK', amount: 78.00, type: 'DEBIT', category: 'Entretenimento', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-04-03', description: 'Pagamento com QR Pix TOTVS ASSINATURA', amount: 197.00, type: 'DEBIT', category: 'Serviços', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-04-02', description: 'Pagamento com QR Pix AMBEV', amount: 45.90, type: 'DEBIT', category: 'Alimentação', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-04-01', description: 'Pagamento com QR Pix ZARA', amount: 349.90, type: 'DEBIT', category: 'Shopping', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-03-31', description: 'Freela Site WordPress', amount: 2500.00, type: 'CREDIT', category: 'Proceeds', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-03-30', description: 'Pagamento com QR Pix UNIMED', amount: 459.90, type: 'DEBIT', category: 'Saúde', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-03-29', description: 'Pagamento com QR Pix SAMSUNG STORE', amount: 2799.00, type: 'DEBIT', category: 'Shopping', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-03-28', description: 'Pagamento com QR Pix RAPPI', amount: 89.70, type: 'DEBIT', category: 'Alimentação', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-03-27', description: 'Pagamento com QR Pix POSTO SHELL', amount: 210.00, type: 'DEBIT', category: 'Gas stations', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-03-26', description: 'Pagamento com QR Pix DROGARIA SAO PAULO', amount: 127.40, type: 'DEBIT', category: 'Saúde', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-03-25', description: 'Pagamento com QR Pix AMERICANAS', amount: 89.99, type: 'DEBIT', category: 'Shopping', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-03-24', description: 'Pagamento com QR Pix ACQUA PARK', amount: 89.90, type: 'DEBIT', category: 'Lazer', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-03-23', description: 'Pagamento com QR Pix MERCADAO SAO JOSE', amount: 298.50, type: 'DEBIT', category: 'Groceries', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-03-22', description: 'Pagamento com QR Pix C&A', amount: 129.90, type: 'DEBIT', category: 'Shopping', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-03-21', description: 'Pagamento com QR Pix UBER EATS', amount: 37.50, type: 'DEBIT', category: 'Alimentação', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-03-20', description: 'Pagamento com QR Pix BRADESCO SEGUROS', amount: 247.23, type: 'DEBIT', category: 'Serviços', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-03-19', description: 'Pagamento com QR Pix GAS DA ALELO', amount: 95.00, type: 'DEBIT', category: 'Gas', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-03-18', description: 'Pagamento com QR Pix IMOBILIARIA CHAVES', amount: 2200.00, type: 'DEBIT', category: 'Moradia', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-03-17', description: 'Pagamento com QR Pix ENEL', amount: 189.42, type: 'DEBIT', category: 'Serviços', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-03-16', description: 'Pagamento com QR Pix SABESP', amount: 87.34, type: 'DEBIT', category: 'Serviços', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-03-15', description: 'Salário', amount: 15000.00, type: 'CREDIT', category: 'Salário', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-03-14', description: 'Pagamento com QR Pix NATALI CONSULTORIA', amount: 97.00, type: 'DEBIT', category: 'Serviços', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-03-13', description: 'Pagamento com QR Pix LEROY MERLIN', amount: 345.78, type: 'DEBIT', category: 'Shopping', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-03-12', description: 'Pagamento com QR Pix RODOVIARIA TIETE', amount: 67.00, type: 'DEBIT', category: 'Transporte', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-03-11', description: 'Rendimentos', amount: 0.09, type: 'CREDIT', category: 'Rendimentos', status: 'POSTED', account_name: 'Mercado Pago' },
  { date: '2026-03-10', description: 'Pagamento com QR Pix PARQUE SHOPPING', amount: 32.00, type: 'DEBIT', category: 'Transporte', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-03-09', description: 'Pagamento com QR Pix KABUM', amount: 449.90, type: 'DEBIT', category: 'Shopping', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-03-08', description: 'Pagamento com QR Pix PAO DE ACUCAR', amount: 167.30, type: 'DEBIT', category: 'Groceries', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-03-07', description: 'Pagamento com QR Pix SUBMARINO', amount: 79.90, type: 'DEBIT', category: 'Shopping', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-03-06', description: 'Pagamento com QR Pix MADERO', amount: 156.40, type: 'DEBIT', category: 'Alimentação', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-03-05', description: 'Pagamento com QR Pix POSTO IPIRANGA', amount: 175.00, type: 'DEBIT', category: 'Gas stations', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-03-04', description: 'Pagamento com QR Pix VIA VAREJO', amount: 699.00, type: 'DEBIT', category: 'Shopping', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-03-03', description: 'Pagamento com QR Pix FARMACIA NISSEI', amount: 45.60, type: 'DEBIT', category: 'Saúde', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-03-02', description: 'Pagamento com QR Pix IFOOD', amount: 56.90, type: 'DEBIT', category: 'Alimentação', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
  { date: '2026-03-01', description: 'Pagamento com QR Pix DECATHLON', amount: 79.99, type: 'DEBIT', category: 'Shopping', status: 'POSTED', account_name: 'Mercado Pago', payment_method: 'PIX' },
];

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export const transactions: Transaction[] = [
  ...new Map(
    seedTransactions.map((t) => [t.date + t.description + t.amount, { ...t, id: generateId() }])
  ).values(),
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const summary: FinanceSummary = {
  totalBalance: 62.02,
  income30d: 39974.40,
  expenses30d: 40272.98,
  net30d: -298.58,
  transactionCount: transactions.length,
};

export const dailyFlow: { date: string; income: number; expense: number }[] = generateDailyFlow();

function generateDailyFlow() {
  const flow: { date: string; income: number; expense: number }[] = [];
  const now = new Date('2026-05-21');

  for (let i = 30; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayTx = transactions.filter((t) => t.date === dateStr);
    const income = dayTx
      .filter((t) => t.type === 'CREDIT')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = dayTx
      .filter((t) => t.type === 'DEBIT')
      .reduce((sum, t) => sum + t.amount, 0);
    flow.push({ date: dateStr, income, expense });
  }
  return flow;
}

export const categoryColors: Record<string, string> = {
  'Serviços': '#3B82F6',
  'Gas': '#F59E0B',
  'Groceries': '#10B981',
  'Gas stations': '#EF4444',
  'Proceeds': '#8B5CF6',
  'Salário': '#22C55E',
  'Saúde': '#EC4899',
  'Entretenimento': '#F97316',
  'Shopping': '#6366F1',
  'Alimentação': '#EAB308',
  'Transporte': '#14B8A6',
  'Rendimentos': '#06B6D4',
  'Same person transfer': '#A855F7',
  'Moradia': '#F43F5E',
  'Lazer': '#84CC16',
};

export function getCategoryExpenses(
  txList: Transaction[]
): { name: string; value: number; color: string }[] {
  const expenses = txList.filter((t) => t.type === 'DEBIT');
  const grouped: Record<string, number> = {};
  expenses.forEach((t) => {
    grouped[t.category] = (grouped[t.category] || 0) + t.amount;
  });
  return Object.entries(grouped)
    .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100, color: categoryColors[name] || '#6B7280' }))
    .sort((a, b) => b.value - a.value);
}