import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  Target,
  FileBarChart,
  User,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  Wallet,
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Transactions', path: '/transactions', icon: ArrowLeftRight },
    { name: 'Analytics', path: '/analytics', icon: PieChart },
    { name: 'Budgets', path: '/budgets', icon: Target },
    { name: 'Reports', path: '/reports', icon: FileBarChart },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-[#0b0f19] dark:text-slate-100">
      
      {/* SIDEBAR - Desktop View (no-print) */}
      <aside className="no-print hidden w-64 flex-col border-r border-slate-200/50 bg-white/70 backdrop-blur-md dark:border-white/5 dark:bg-slate-900/60 md:flex">
        
        {/* LOGO Header */}
        <div className="flex h-20 items-center justify-start gap-3 px-6 border-b border-slate-200/40 dark:border-white/5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-sans text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              WealthFlow
            </h1>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-500 dark:text-indigo-400">
              Finance Tracker
            </span>
          </div>
        </div>

        {/* Links */}
        <nav className="flex-1 space-y-1 py-6 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-slate-100 hover:text-slate-950 dark:hover:bg-white/5 dark:hover:text-white ${
                    isActive
                      ? 'sidebar-active shadow-sm font-semibold'
                      : 'text-slate-500 dark:text-slate-400'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* User Info footer and actions */}
        <div className="border-t border-slate-200/50 p-4 dark:border-white/5 bg-slate-100/30 dark:bg-slate-950/20">
          <div className="mb-4 flex items-center justify-between gap-2 px-2">
            <div className="overflow-hidden">
              <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
                {user?.name}
              </p>
              <p className="truncate text-[10px] text-slate-400 dark:text-slate-500">
                {user?.email}
              </p>
            </div>
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-200/50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>

          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3.5 rounded-xl border border-red-200/20 bg-red-500/10 px-4 py-2.5 text-xs font-medium text-red-600 transition hover:bg-red-500/20 dark:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER & NAVIGATION - Tablet/Phone View (no-print) */}
      <div className="no-print flex flex-col md:hidden w-full">
        <header className="flex h-16 w-full items-center justify-between border-b border-slate-200/50 bg-white/70 px-4 backdrop-blur-md dark:border-white/5 dark:bg-slate-900/60">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 text-white">
              <Wallet className="h-4 w-4" />
            </div>
            <span className="font-sans text-md font-bold tracking-tight text-slate-900 dark:text-white">
              WealthFlow
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5"
            >
              {darkMode ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* MOBILE SLIDE-OUT PANEL / DRAWER */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex bg-slate-950/40 backdrop-blur-sm">
            <div className="relative flex w-4/5 max-w-sm flex-col bg-white p-6 shadow-2xl dark:bg-slate-900">
              
              <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 text-white">
                    <Wallet className="h-4 w-4" />
                  </div>
                  <span className="font-sans text-md font-bold tracking-tight text-slate-900 dark:text-white">
                    WealthFlow
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 space-y-1 py-6">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition ${
                          isActive
                            ? 'sidebar-active shadow-sm'
                            : 'text-slate-500 dark:text-slate-400'
                        }`
                      }
                    >
                      <Icon className="h-5 w-5" />
                      {item.name}
                    </NavLink>
                  );
                })}
              </nav>

              <div className="border-t border-slate-100 pt-4 dark:border-white/5">
                <div className="mb-4">
                  <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {user?.name}
                  </p>
                  <p className="truncate text-[10px] text-slate-400 dark:text-slate-500">
                    {user?.email}
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-red-500/10 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-500/20 dark:text-red-400"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MAIN VIEW AREA */}
      <main className="flex-1 overflow-x-hidden p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
export { DashboardLayout };
