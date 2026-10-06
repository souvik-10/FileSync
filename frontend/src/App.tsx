import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TransferProvider } from './context/TransferContext';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { FolderSync, Loader2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100 space-y-4">
        <div className="w-12 h-12 rounded-2xl gradient-btn flex items-center justify-center shadow-xl shadow-indigo-500/20">
          <FolderSync className="w-6 h-6 text-white" />
        </div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400">
          <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
          <span>Initializing FileSync Workspace...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return authView === 'login' ? (
      <LoginPage onSwitchToRegister={() => setAuthView('register')} />
    ) : (
      <RegisterPage onSwitchToLogin={() => setAuthView('login')} />
    );
  }

  return (
    <TransferProvider>
      <DashboardPage />
    </TransferProvider>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
