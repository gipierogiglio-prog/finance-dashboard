# Dashboard Financeiro Pessoal

Dashboard web para visualização de dados financeiros pessoais, consumindo dados da API Pluggy (Open Finance Brasil).

## Stack

- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** (estilização)
- **Chart.js** + **react-chartjs-2** (gráficos)

## Funcionalidades

- ✅ Visão geral: saldo total, receitas, despesas, saldo do período
- ✅ Transações recentes com ícones por categoria
- ✅ Gráfico de fluxo financeiro (receitas vs despesas por dia)
- ✅ Gráfico de pizza por categoria de gastos
- ✅ Extrato completo com filtros (busca, tipo, categoria) e ordenação
- ✅ Filtro por período (7, 15, 30 dias)
- ✅ Tema escuro/claro
- ✅ Responsivo (mobile-first)
- ✅ Indicador de superávit/déficit

## Como rodar

```bash
cd finance-dashboard
npm install
npm run dev
```

Acesse `http://localhost:5173` no navegador.

## Dados

Os dados são mockados com base no script original `pluggy_sync.py`, simulando ~87 transações realistas nos últimos 60+ dias. Futuramente, o dashboard pode consumir uma API FastAPI intermediária que consulta a API Pluggy real.

## Estrutura

```
src/
├── components/     # Componentes React
│   ├── Overview.tsx
│   ├── TransactionsList.tsx
│   ├── FlowChart.tsx
│   ├── CategoryChart.tsx
│   ├── Statement.tsx
│   ├── PeriodFilter.tsx
│   └── ThemeToggle.tsx
├── data/           # Dados mockados
│   └── mockData.ts
├── hooks/          # Custom hooks
│   └── useFinanceData.ts
├── types/          # Interfaces TypeScript
│   └── index.ts
├── utils/          # Utilitários
│   └── format.ts
├── App.tsx
├── main.tsx
└── index.css
```