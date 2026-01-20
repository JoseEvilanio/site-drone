
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }
      onClose();
    } catch (err: any) {
      console.error(err);
      if (err.message === 'Invalid login credentials') {
        setError('E-mail ou senha incorretos.');
      } else {
        setError('Ocorreu um erro ao tentar entrar. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 p-10 rounded-3xl shadow-2xl animate-fade-in-up">
        <button onClick={onClose} className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors">
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="text-center mb-10">
          <span className="material-symbols-outlined text-primary text-5xl mb-4">lock_person</span>
          <h2 className="font-display text-3xl text-white">Área Restrita</h2>
          <p className="text-zinc-500 text-sm mt-2">Acesse com sua conta cadastrada</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-2">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-950 border-zinc-800 focus:border-primary focus:ring-primary rounded-xl p-4 text-white transition-all outline-none"
              placeholder="seu@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-2">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950 border-zinc-800 focus:border-primary focus:ring-primary rounded-xl p-4 text-white transition-all outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-xs text-center font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-black font-bold py-4 rounded-xl uppercase tracking-widest hover:bg-white transition-all shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Entrando...' : 'Entrar no Painel'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
