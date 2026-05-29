import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wallet, Mail, Lock, LogIn } from 'lucide-react';

const Login = () => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-slate-100 via-indigo-50/20 to-purple-50/20 px-4 dark:from-[#090d16] dark:via-[#101424] dark:to-[#0f0e1d]">
      
      {/* Background Decorative Glow (Aesthetics) */}
      <div className="absolute top-1/4 left-1/4 h-80 w-80 rounded-full bg-indigo-500/10 blur-[100px] animate-pulse-slow no-print"></div>
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-purple-500/10 blur-[100px] animate-pulse-slow no-print"></div>

      <div className="relative w-full max-w-md rounded-3xl border border-white/40 bg-white/60 p-8 shadow-2xl backdrop-blur-md dark:border-white/5 dark:bg-slate-900/60">
        
        {/* Brand Logo */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-500/20">
            <Wallet className="h-6 w-6" />
          </div>
          <h2 className="mt-4 font-sans text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome to WealthFlow
          </h2>
          <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
            Enter details to securely manage your personal finance tracker
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="glass-input pl-10"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="glass-input pl-10"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="gradient-btn w-full mt-2 font-semibold h-11 text-md"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                Verifying Credentials...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <LogIn className="h-4.5 w-4.5" />
                Sign In to Account
              </span>
            )}
          </button>
        </form>

        {/* Footer Redirect */}
        <div className="mt-8 border-t border-slate-100 pt-6 text-center text-xs dark:border-white/5">
          <span className="text-slate-400 dark:text-slate-500">
            Don't have an account?{' '}
          </span>
          <Link
            to="/register"
            className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Create one for free
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
export { Login };
