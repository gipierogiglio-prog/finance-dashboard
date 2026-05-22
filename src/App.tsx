import React, { useState, useEffect, useCallback } from 'react';
import { Overview } from './components/Overview';
import { TransactionsList } from './components/TransactionsList';
import { FlowChart } from './components/FlowChart';
import { CategoryChart } from './components/CategoryChart';
import { Statement } from './components/Statement';
import { PeriodFilter } from './components/PeriodFilter';
import { ThemeToggle } from './components/ThemeToggle';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { SettingsPage } from './components/SettingsPage';
import { useFinanceData, fetchSystemStatus, triggerSync } from './hooks/useFinanceData';
import { hasToken, clearToken, getUserProfile } from './api/client';
import { SystemStatus } from './types';
import { formatCurrency } from './utils/format';

type Page = 'login' | 'register' | 'dashboard' | 'settings';

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Decode JWT payload to get the username without hitting the API */
function getUsernameFromToken(): string | null {
  try {
    const token = localStorage.getItem('financeiro_token');
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub || payload.username || null;
  } catch {
    return null;
  }
}

function DashboardPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  // ── Theme ───────────────────────────────────────────────────
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // ── Dashboard data ───────────────────────────────────────────
  const [period, setPeriod] = useState(30);
  const { accounts, transactions, summary, dailyFlow, categoryExpenses, loading, isOnline } =
    useFinanceData(period);

  const [sysStatus, setSysStatus] = useState<SystemStatus | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // Get user info from JWT
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    // Try JWT decode first (fastest)
    const name = getUsernameFromToken();
    if (name) {
      setUserName(name);
    } else {
      // Fall back to API
      getUserProfile()
        .then((profile) => setUserName(profile.display_name || profile.username))
        .catch(() => setUserName(null));
    }
  }, []);

  // Fetch system status periodically
  const refreshStatus = useCallback(async () => {
    const status = await fetchSystemStatus();
    if (status) setSysStatus(status);
  }, []);

  useEffect(() => {
    refreshStatus();
    const interval = setInterval(refreshStatus, 30000); // every 30s
    return () => clearInterval(interval);
  }, [refreshStatus]);

  const handleSync = async () => {
    setSyncing(true);
    setSyncMessage(null);
    try {
      const result = await triggerSync();
      if (result) {
        setSyncMessage(result.message);
        // Refresh data after sync
        setTimeout(() => {
          refreshStatus();
          window.location.reload();
        }, 1500);
      } else {
        setSyncMessage('Erro ao sincronizar. Backend offline?');
      }
    } catch (err: any) {
      setSyncMessage(err.message || 'Erro ao sincronizar');
    } finally {
      setTimeout(() => setSyncing(false), 1000);
    }
  };

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const lastSync = sysStatus?.last_sync;
  const lastSyncLabel = lastSync
    ? `Última sincronização: ${formatDate(lastSync.synced_at)}`
    : 'Nunca sincronizado';

  const handleLogout = () => {
    clearToken();
    onNavigate('login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-1">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <span className="text-xl sm:text-2xl flex-shrink-0">💰</span>
              <h1 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white truncate">
                Financeiro
              </h1>
            </div>
            <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
              {/* User Name */}
              {userName && (
                <span className="hidden sm:inline text-sm text-gray-600 dark:text-gray-400 font-medium mr-1">
                  👤 {userName}
                </span>
              )}

              {/* Connection Indicator */}
              <div className="hidden sm:flex items-center gap-1.5 text-xs px-2">
                {isOnline ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">Ao vivo</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                    <span className="text-amber-600 dark:text-amber-400 font-medium">Offline</span>
                  </>
                )}
              </div>

              {/* Settings Button */}
              <button
                onClick={() => onNavigate('settings')}
                title="Configurações"
                className="flex items-center justify-center w-9 h-9 rounded-lg
                           text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700
                           active:bg-gray-200 dark:active:bg-gray-600
                           transition-colors text-lg"
              >
                ⚙️
              </button>

              {/* Sync Button */}
              <button
                onClick={handleSync}
                disabled={syncing}
                title={lastSyncLabel}
                className="flex items-center justify-center gap-1.5 px-2 sm:px-3 py-2 sm:py-1.5 text-sm font-medium rounded-lg
                           bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-colors shadow-sm min-h-[44px]"
              >
                <span className={`text-base ${syncing ? 'animate-spin' : ''}`}>
                  🔄
                </span>
                <span className="hidden sm:inline">{syncing ? 'Sincronizando...' : 'Sincronizar'}</span>
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                title="Sair"
                className="flex items-center justify-center px-2 sm:px-3 py-2 sm:py-1.5 text-sm font-medium rounded-lg
                           text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700
                           active:bg-gray-200 dark:active:bg-gray-600
                           transition-colors min-h-[44px]"
              >
                <span className="text-base">🚪</span>
                <span className="hidden sm:inline ml-1">Sair</span>
              </button>

              <div className="hidden sm:block">
                <PeriodFilter value={period} onChange={setPeriod} />
              </div>
              <div className="sm:hidden">
                <PeriodFilter value={period} onChange={setPeriod} compact />
              </div>
              <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
            </div>
          </div>

          {/* User name on mobile */}
          {userName && (
            <div className="flex sm:hidden items-center gap-1 pb-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                👤 {userName}
              </span>
            </div>
          )}

          {/* Sync message */}
          {syncMessage && (
            <div className="pb-3 -mt-1 px-1">
              <p className={`text-xs ${
                syncMessage.includes('Erro')
                  ? 'text-rose-500 dark:text-rose-400'
                  : 'text-emerald-600 dark:text-emerald-400'
              }`}>
                {syncMessage}
              </p>
            </div>
          )}

          {/* Last sync info on mobile */}
          <div className="flex sm:hidden items-center gap-2 pb-2">
            <div className="flex items-center gap-1.5 text-xs">
              {isOnline ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  <span className="text-emerald-600 dark:text-emerald-400">Ao vivo</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                  <span className="text-amber-600 dark:text-amber-400">Offline (dados mock)</span>
                </>
              )}
            </div>
            {lastSync && (
              <span className="text-xs text-gray-400 dark:text-gray-500 truncate">
                · {lastSyncLabel}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/10 dark:bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Carregando dados...
            </span>
          </div>
        </div>
      )}

      {/* Offline banner */}
      {!loading && !isOnline && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <p className="text-xs text-amber-700 dark:text-amber-400 text-center">
              ⚠️ Backend indisponível — exibindo dados mockados.
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Overview */}
        <Overview accounts={accounts} summary={summary} />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FlowChart data={dailyFlow} />
          <CategoryChart data={categoryExpenses} />
        </div>

        {/* Transactions + placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TransactionsList transactions={transactions} limit={8} />
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 p-4 sm:p-5 flex items-center justify-center">
            <div className="text-center">
              <span className="text-3xl block mb-2">🏗️</span>
              <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                Em breve: Investimentos
              </p>
              <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">
                Dashboard de investimentos em desenvolvimento
              </p>
            </div>
          </div>
        </div>

        {/* Full Statement */}
        <Statement transactions={transactions} />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center gap-2">
            <p className="text-center text-xs text-gray-400 dark:text-gray-500">
              Dados via API Pluggy · Open Finance Brasil
            </p>
            {lastSync && (
              <span className="text-xs text-gray-400 dark:text-gray-500">
                · {lastSyncLabel}
              </span>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  // ── Auth state ──────────────────────────────────────────────
  const [authenticated, setAuthenticated] = useState(() => hasToken());
  const [page, setPage] = useState<Page>('dashboard');

  const handleLogin = useCallback(() => {
    setAuthenticated(true);
    setPage('dashboard');
  }, []);

  // Listen for 401 unauthorized events from the API client
  useEffect(() => {
    const onUnauthorized = () => {
      clearToken();
      setAuthenticated(false);
      setPage('login');
    };
    window.addEventListener('auth:unauthorized', onUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', onUnauthorized);
  }, []);

  // ── Routing logic ────────────────────────────────────────────

  // Not authenticated → login
  if (!authenticated) {
    if (page === 'register') {
      return <RegisterPage onRegister={() => setPage('login')} />;
    }
    return <LoginPage onLogin={handleLogin} onRegister={() => setPage('register')} />;
  }

  // Authenticated pages
  if (page === 'settings') {
    return <SettingsPage onBack={() => setPage('dashboard')} />;
  }

  // Default: dashboard
  return <DashboardPage onNavigate={setPage} />;
}

export default App;