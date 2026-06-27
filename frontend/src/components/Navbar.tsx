import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, LayoutDashboard, LogOut, Code } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path
      ? 'text-brand-500 bg-brand-500/10 border-brand-500/20'
      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border-transparent';
  };

  return (
    <nav className="glass-panel sticky top-0 z-50 border-b border-white/5 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-brand-600/20 p-2 rounded-xl border border-brand-500/20">
          <Code className="w-6 h-6 text-brand-500" />
        </div>
        <Link to="/" className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent font-outfit">
          PatternMaster
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <Link
          to="/"
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${isActive('/')}`}
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </Link>
        <Link
          to="/patterns"
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${isActive('/patterns')}`}
        >
          <BookOpen className="w-4 h-4" />
          Pattern Library
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-sm font-medium text-slate-200">{user?.name}</div>
          <div className="text-xs text-slate-500">{user?.email}</div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 bg-white/5 hover:bg-red-500/15 border border-white/10 hover:border-red-500/30 text-slate-400 hover:text-red-400 px-3.5 py-2 rounded-xl text-sm font-medium transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </nav>
  );
};
