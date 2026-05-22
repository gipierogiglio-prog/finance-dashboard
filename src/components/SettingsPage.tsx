import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { PluggyConfig, SyncResponse } from '../types';

interface SettingsPageProps {
  onBack: () => void;
}

export function SettingsPage({ onBack }: SettingsPageProps) {
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [config, setConfig] = useState<PluggyConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'oauth'; text: string; oauthUrl?: string } | null>(null);

  // Load current config
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const data = await api.get<{ configured: boolean; hasItem: boolean }>('/user/pluggy-config');
        setConfig({ configured: data.configured, hasItem: data.hasItem });
      } catch {
        setConfig({ configured: false, hasItem: false });
      } finally {
        setLoading(false);
      }
    };
    loadConfig();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      await api.put('/user/pluggy-config', { client_id: clientId, client_secret: clientSecret });
      setMessage({ type: 'success', text: '✅ Credenciais salvas com sucesso!' });
      setConfig({ configured: true, hasItem: config?.hasItem ?? false });
      setClientId('');
      setClientSecret('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Erro ao salvar credenciais' });
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setMessage(null);

    try {
      // First save, then test with a sync
      await api.put('/user/pluggy-config', { client_id: clientId, client_secret: clientSecret });
      const result = await api.post<{ message: string; sync_result?: { oauth_url?: string } }>('/sync');
      
      if (result.sync_result?.oauth_url) {
        setMessage({
          type: 'oauth',
          text: '🔐 Autorização necessária! Clique no link abaixo para conectar sua conta MeuPluggy:',
          oauthUrl: result.sync_result.oauth_url
        });
      } else {
        setMessage({ type: 'success', text: result.message || '✅ Conexão bem-sucedida!' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Erro ao testar conexão' });
    } finally {
      setTesting(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setMessage(null);

    try {
      const result = await api.post<{ message: string; sync_result?: { oauth_url?: string } }>('/sync');
      
      if (result.sync_result?.oauth_url) {
        setMessage({
          type: 'oauth',
          text: '🔐 Autorização necessária! Clique no link abaixo para conectar sua conta MeuPluggy:',
          oauthUrl: result.sync_result.oauth_url
        });
      } else {
        setMessage({ type: 'success', text: result.message || '✅ Sincronização concluída!' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Erro ao sincronizar' });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-2">
            <button
              onClick={onBack}
              className="flex items-center justify-center w-10 h-10 rounded-lg
                         text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700
                         active:bg-gray-200 dark:active:bg-gray-600 transition-colors"
              title="Voltar"
            >
              ←
            </button>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              Configurações
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Current Status */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
            Status da Conexão Pluggy
          </h2>
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Carregando...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {config?.configured ? (
                <>
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                  <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    Configurado ✅
                  </span>
                </>
              ) : (
                <>
                  <span className="w-3 h-3 rounded-full bg-gray-400 inline-block" />
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Não configurado ❌
                  </span>
                </>
              )}
              {config?.hasItem && (
                <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">
                  · Conta Pluggy vinculada
                </span>
              )}
            </div>
          )}
        </div>

        {/* Pluggy Credentials Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
            Credenciais Pluggy
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Insira suas credenciais da API Pluggy para conectar suas contas bancárias.
            As credenciais ficam armazenadas de forma segura no servidor.
          </p>

          <form onSubmit={handleSave} className="space-y-4">
            {/* Client ID */}
            <div>
              <label
                htmlFor="pluggy-client-id"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Client ID
              </label>
              <input
                id="pluggy-client-id"
                type="text"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="Seu Client ID Pluggy"
                required
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           placeholder-gray-400 dark:placeholder-gray-500
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           outline-none transition-all text-sm"
              />
            </div>

            {/* Client Secret */}
            <div>
              <label
                htmlFor="pluggy-client-secret"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Client Secret
              </label>
              <input
                id="pluggy-client-secret"
                type="password"
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                placeholder="Seu Client Secret Pluggy"
                required
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           placeholder-gray-400 dark:placeholder-gray-500
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           outline-none transition-all text-sm"
              />
            </div>

            {/* Message */}
            {message && (
              <div
                className={`rounded-lg px-3 py-2 border ${
                  message.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800'
                    : message.type === 'oauth'
                    ? 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800'
                    : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800'
                }`}
              >
                <p
                  className={`text-sm ${
                    message.type === 'success'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : message.type === 'oauth'
                      ? 'text-amber-700 dark:text-amber-300'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {message.text}
                </p>
                {message.type === 'oauth' && message.oauthUrl && (
                  <a
                    href={message.oauthUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg
                               bg-blue-600 hover:bg-blue-700 active:bg-blue-800
                               text-white text-sm font-medium transition-colors"
                  >
                    🔗 Autorizar MeuPluggy
                  </a>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={saving || !clientId || !clientSecret}
                className="flex-1 py-2.5 px-4 rounded-lg font-medium text-sm text-white
                           bg-blue-600 hover:bg-blue-700 active:bg-blue-800
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-colors shadow-sm flex items-center justify-center gap-2
                           min-h-[44px]"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Salvando...</span>
                  </>
                ) : (
                  'Salvar'
                )}
              </button>

              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testing || !clientId || !clientSecret}
                className="flex-1 py-2.5 px-4 rounded-lg font-medium text-sm
                           bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300
                           hover:bg-gray-200 dark:hover:bg-gray-600 active:bg-gray-300 dark:active:bg-gray-500
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-colors flex items-center justify-center gap-2
                           min-h-[44px]"
              >
                {testing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-600 dark:border-gray-300 border-t-transparent rounded-full animate-spin" />
                    <span>Testando...</span>
                  </>
                ) : (
                  'Testar Conexão'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Sync Button */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
            Sincronização
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Force uma sincronização imediata com o Pluggy para buscar os dados mais recentes.
          </p>
          <button
            onClick={handleSync}
            disabled={syncing}
            className="py-2.5 px-4 rounded-lg font-medium text-sm text-white
                       bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors shadow-sm flex items-center justify-center gap-2
                       min-h-[44px] w-full sm:w-auto"
          >
            {syncing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Sincronizando...</span>
              </>
            ) : (
              <>
                <span>🔄</span>
                <span>Sincronizar Agora</span>
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}