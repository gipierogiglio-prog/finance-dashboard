import React, { useState } from 'react';
import { register } from '../api/client';

interface RegisterPageProps {
  onRegister: () => void;
}

export function RegisterPage({ onRegister }: RegisterPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await register(username, password, displayName || undefined);
      setSuccess(true);
      setTimeout(() => {
        onRegister();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <span className="text-5xl block mb-3">💰</span>
          <h1 className="text-2xl font-bold text-white">Financeiro</h1>
          <p className="text-blue-200 text-sm mt-1">Criar nova conta</p>
        </div>

        {/* Register Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 text-center">
            Criar Conta
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label
                htmlFor="reg-username"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Usuário
              </label>
              <input
                id="reg-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Escolha um nome de usuário"
                required
                autoFocus
                autoComplete="username"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           placeholder-gray-400 dark:placeholder-gray-500
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           outline-none transition-all text-sm"
              />
            </div>

            {/* Display Name */}
            <div>
              <label
                htmlFor="reg-display-name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Nome de Exibição <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                id="reg-display-name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Como você quer ser chamado"
                autoComplete="name"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           placeholder-gray-400 dark:placeholder-gray-500
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           outline-none transition-all text-sm"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="reg-password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Senha
              </label>
              <input
                id="reg-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Escolha uma senha"
                required
                autoComplete="new-password"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           placeholder-gray-400 dark:placeholder-gray-500
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           outline-none transition-all text-sm"
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}

            {/* Success message */}
            {success && (
              <div className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-lg px-3 py-2">
                <p className="text-sm text-emerald-600 dark:text-emerald-400">
                  ✅ Conta criada! Redirecionando para login...
                </p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading || success || !username || !password}
              className="w-full py-2.5 px-4 rounded-lg font-medium text-sm text-white
                         bg-blue-600 hover:bg-blue-700 active:bg-blue-800
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors shadow-sm flex items-center justify-center gap-2
                         min-h-[44px]"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Criando...</span>
                </>
              ) : (
                'Criar Conta'
              )}
            </button>
          </form>

          {/* Login link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Já tem uma conta?{' '}
              <button
                onClick={onRegister}
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Fazer login
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-blue-200/60 text-xs mt-6">
          Dados via API Pluggy · Open Finance Brasil
        </p>
      </div>
    </div>
  );
}