import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, LayoutDashboard, LogOut, Code, Menu, X, Building2 } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [sandboxCount, setSandboxCount] = useState(0);

  const isActive = (path: string) => {
    return location.pathname === path
      ? 'text-brand-500 bg-brand-500/10 border-brand-500/20 font-bold'
      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border-transparent';
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Guest sandbox counter logic
  useEffect(() => {
    const updateSandboxCount = () => {
      const stored = localStorage.getItem('guest_problems_progress');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setSandboxCount(Object.keys(parsed).length);
        } catch (e) {
          setSandboxCount(0);
        }
      } else {
        setSandboxCount(0);
      }
    };

    updateSandboxCount();

    window.addEventListener('storage', updateSandboxCount);
    // Poll every 1s to sync sandbox state changes across page operations
    const interval = setInterval(updateSandboxCount, 1000);
    return () => {
      window.removeEventListener('storage', updateSandboxCount);
      clearInterval(interval);
    };
  }, [location.pathname]);

  return (
    <nav 
      className="bg-[#0B0F19] sticky top-0 z-50 border-b border-white/5 px-6 py-4 flex items-center justify-between" 
      ref={menuRef}
    >
      <div className="flex items-center gap-3">
        <div className="bg-brand-600/20 p-2 rounded-xl border border-brand-500/20">
          <Code className="w-6 h-6 text-brand-500" />
        </div>
        <Link to={user ? '/' : '/patterns'} className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent font-outfit">
          PatternMaster
        </Link>
      </div>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-2">
        {user && (
          <Link
            to="/"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${isActive('/')}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
        )}
        <Link
          to="/patterns"
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${isActive('/patterns')}`}
        >
          <BookOpen className="w-4 h-4" />
          Pattern Library
        </Link>
        <Link
          to="/companies"
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${isActive('/companies')}`}
        >
          <Building2 className="w-4 h-4" />
          Companies
        </Link>
      </div>

      {/* Desktop User Info & Logout / Login / Sign Up */}
      {user ? (
        <div className="hidden md:flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm font-medium text-slate-200">{user.name}</div>
            <div className="text-xs text-slate-500">{user.email}</div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 bg-white/5 hover:bg-red-500/15 border border-white/10 hover:border-red-500/30 text-slate-400 hover:text-red-400 px-3.5 py-2 rounded-xl text-sm font-medium transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      ) : (
        <div className="hidden md:flex items-center gap-4">
          <div className="bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs px-3 py-1.5 rounded-xl font-semibold font-mono">
            Sandbox: {sandboxCount}/3
          </div>
          <Link
            to="/login"
            className="text-sm font-medium text-slate-400 hover:text-slate-200 transition-all"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-brand-600/15"
          >
            Sign Up
          </Link>
        </div>
      )}

      {/* Mobile Hamburger Button */}
      <div className="flex md:hidden items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-11 h-11 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all focus:outline-none"
          aria-label="Toggle Menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown Drawer */}
      {isOpen && (
        <div className="absolute top-[73px] left-0 right-0 border border-white/5 shadow-2xl p-6 md:hidden flex flex-col gap-6 z-50 bg-[#0B0F19] rounded-b-2xl">
          <div className="flex flex-col gap-2">
            {user && (
              <Link
                to="/"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium border transition-all ${isActive('/')}`}
              >
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </Link>
            )}
            <Link
              to="/patterns"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium border transition-all ${isActive('/patterns')}`}
            >
              <BookOpen className="w-5 h-5" />
              Pattern Library
            </Link>
            <Link
              to="/companies"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium border transition-all ${isActive('/companies')}`}
            >
              <Building2 className="w-5 h-5" />
              Companies
            </Link>
          </div>

          <div className="border-t border-white/5 pt-6 flex flex-col gap-4">
            {user ? (
              <>
                <div className="px-4">
                  <div className="text-sm font-semibold text-slate-200">{user.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{user.email}</div>
                </div>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-red-500/15 border border-white/10 hover:border-red-500/30 text-slate-400 hover:text-red-400 py-3 rounded-xl text-sm font-semibold transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3 px-4">
                <div className="bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs py-2 rounded-xl text-center font-semibold font-mono">
                  Sandbox Tracker: {sandboxCount}/3
                </div>
                <div className="flex gap-4 w-full">
                  <Link
                    to="/login"
                    className="flex-1 text-center py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-slate-300 hover:text-white transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="flex-1 text-center py-2.5 bg-brand-600 rounded-xl text-sm font-semibold text-white hover:bg-brand-500 transition-all"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
