import React, { useState, useEffect } from 'react';
import { listItems, addItem, removeItem } from '../api/client';
import { triggerSync } from '../hooks/useFinanceData';
import type { ConnectedItem } from '../types';

interface AccountsPageProps {
  onBack: () => void;
}

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

function getStatusBadge(status: string): { emoji: string; label: string; color: string } {
  const s = status.toUpperCase();
  if (s === 'UPDATED') return { emoji: '🟢', label: 'Atualizado', color: 'text-emerald-600 dark:text-emerald-400' };
  if (s === 'UPDATING') return { emoji: '🟡', label: 'Atualizando', color: 'text-amber-600 dark:text-amber-400' };
  if (s === 'ERROR') return { emoji: '🔴', label: 'Erro', color: 'text-rose-600 dark:text-rose-400' };
  return { emoji: '⚪', label: s, color: 'text-gray-500 dark:text-gray-400' };
}

export function AccountsPage({ onBack }: AccountsPageProps) {
  const [items, setItems] = useState<ConnectedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Add form state
  const [showForm, setShowForm] = useState(false);
  const [newItemId, setNewItemId] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [adding, setAdding] = useState(false);

  // Remove confirmation
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [removing, setRemoving] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const data = await listItems();
      // API might return the array directly or wrapped
      setItems(Array.isArray(data) ? data : (data as any).items || []);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Erro ao carregar contas' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemId.trim()) return;

    setAdding(true);
    setMessage(null);
    try {
      await addItem(newItemId.trim(), newItemName.trim() || undefined);
      setMessage({ type: 'success', text: '✅ Conta adicionada com sucesso!' });
      setNewItemId('');
      setNewItemName('');
      setShowForm(false);
      await fetchItems();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Erro ao adicionar conta' });
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (itemId: string) => {
    setRemoving(true);
    setMessage(null);
    try {
      await removeItem(itemId);
      setMessage({ type: 'success', text: '🗑️ Conta removida com sucesso!' });
      setRemovingId(null);
      await fetchItems();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Erro ao remover conta' });
    } finally {
      setRemoving(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setMessage(null);
    try {
      const result = await triggerSync();
      if (result) {
        setMessage({ type: 'success', text: result.message || '✅ Sincronização concluída!' });
      } else {
        setMessage({ type: 'error', text: 'Erro ao sincronizar. Backend offline?' });
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
              Gerenciamento de Contas
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Message */}
        {message && (
          <div
            className={`rounded-xl px-4 py-3 border ${
              message.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800'
                : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800'
            }`}
          >
            <p
              className={`text-sm ${
                message.type === 'success'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {message.text}
            </p>
          </div>
        )}

        {/* Actions Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => { setShowForm(!showForm); setMessage(null); }}
              className="flex-1 py-2.5 px-4 rounded-lg font-medium text-sm text-white
                         bg-blue-600 hover:bg-blue-700 active:bg-blue-800
                         transition-colors shadow-sm flex items-center justify-center gap-2
                         min-h-[44px]"
            >
              <span>{showForm ? '✕ Cancelar' : '➕ Adicionar Conta'}</span>
            </button>
            <button
              onClick={handleSync}
              disabled={syncing}
              className="flex-1 py-2.5 px-4 rounded-lg font-medium text-sm text-white
                         bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors shadow-sm flex items-center justify-center gap-2
                         min-h-[44px]"
            >
              {syncing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sincronizando...</span>
                </>
              ) : (
                <>
                  <span>🔄</span>
                  <span>Sincronizar</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Add Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
              Adicionar Nova Conta
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Insira o Item ID fornecido pelo MeuPluggy após conectar sua conta bancária.
            </p>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label
                  htmlFor="item-id"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Item ID *
                </label>
                <input
                  id="item-id"
                  type="text"
                  value={newItemId}
                  onChange={(e) => setNewItemId(e.target.value)}
                  placeholder="UUID do Item (ex: 550e8400-e29b-41d4-a716-446655440000)"
                  required
                  pattern="^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"
                  title="UUID no formato 8-4-4-4-12"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             placeholder-gray-400 dark:placeholder-gray-500
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             outline-none transition-all text-sm font-mono"
                />
              </div>
              <div>
                <label
                  htmlFor="item-name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Nome (opcional)
                </label>
                <input
                  id="item-name"
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="Ex: Nubank, Itaú, etc."
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             placeholder-gray-400 dark:placeholder-gray-500
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             outline-none transition-all text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={adding || !newItemId.trim()}
                className="w-full py-2.5 px-4 rounded-lg font-medium text-sm text-white
                           bg-blue-600 hover:bg-blue-700 active:bg-blue-800
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-colors shadow-sm flex items-center justify-center gap-2
                           min-h-[44px]"
              >
                {adding ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Adicionando...</span>
                  </>
                ) : (
                  'Salvar'
                )}
              </button>
            </form>
          </div>
        )}

        {/* Items Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center gap-2 p-8">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Carregando contas...</span>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center p-8">
              <span className="text-3xl block mb-2">🏦</span>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Nenhuma conta conectada
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Clique em "Adicionar Conta" para conectar seu primeiro banco.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Item ID
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {items.map((item) => {
                    const badge = getStatusBadge(item.status);
                    return (
                      <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                          {item.name || '—'}
                        </td>
                        <td className="px-4 py-3 text-sm font-mono text-gray-600 dark:text-gray-400">
                          <code className="text-xs bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                            {item.item_id}
                          </code>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-sm font-medium ${badge.color}`}>
                            {badge.emoji} {badge.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {removingId === item.item_id ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setRemovingId(null)}
                                className="px-3 py-1.5 text-xs font-medium rounded-lg
                                           text-gray-600 dark:text-gray-400
                                           hover:bg-gray-100 dark:hover:bg-gray-700
                                           transition-colors"
                                disabled={removing}
                              >
                                Cancelar
                              </button>
                              <button
                                onClick={() => handleRemove(item.item_id)}
                                disabled={removing}
                                className="px-3 py-1.5 text-xs font-medium rounded-lg
                                           text-white bg-rose-600 hover:bg-rose-700
                                           active:bg-rose-800 disabled:opacity-50
                                           disabled:cursor-not-allowed transition-colors
                                           flex items-center gap-1"
                              >
                                {removing ? (
                                  <>
                                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Removendo...</span>
                                  </>
                                ) : (
                                  'Confirmar'
                                )}
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setRemovingId(item.item_id)}
                              className="px-3 py-1.5 text-xs font-medium rounded-lg
                                         text-rose-600 dark:text-rose-400
                                         hover:bg-rose-50 dark:hover:bg-rose-900/20
                                         transition-colors"
                            >
                              🗑️ Remover
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}