import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FolderSync, Mail, Lock, ArrowRight, Loader2, Sparkles } from 'lucide-react';

interface LoginPageProps {
  onSwitchToRegister: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide email and password');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await login({ email, password });
    } catch (err: any) {
      console.error('[Login] Error:', err);
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-slate-950 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-600/15 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md z-10 space-y-8">
        {/* Brand */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl gradient-btn mx-auto flex items-center justify-center shadow-xl shadow-indigo-500/25">
            <FolderSync className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Welcome to <span className="gradient-text">FileSync</span>
          </h1>
          <p className="text-xs text-slate-400">
            Real-time file sharing & AI-powered productivity platform
          </p>
        </div>

        {/* Card */}
        <div className="glass-panel p-8 rounded-2xl border border-slate-800 shadow-2xl space-y-6">
          <h2 className="text-lg font-bold text-slate-100 text-center">Sign In to Your Account</h2>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="alex@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-btn py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center space-x-2 shadow-lg hover:scale-[1.01] transition-transform active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Tip */}
          <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-[11px] text-slate-400 space-y-1">
            <p className="font-semibold text-indigo-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Quick Demo Tip:
            </p>
            <p>Create two accounts (e.g. User A & User B) to experience live cross-user file transfer!</p>
          </div>
        </div>

        {/* Switch to Register */}
        <p className="text-center text-xs text-slate-400">
          Don't have an account yet?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-indigo-400 font-bold hover:underline ml-1"
          >
            Create Account
          </button>
        </p>
      </div>
    </div>
  );
};
