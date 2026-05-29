import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GuestRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-[#0b0f19]">
        <div className="relative h-12 w-12">
          <div className="absolute h-full w-full rounded-full border-4 border-indigo-100 dark:border-indigo-950"></div>
          <div className="absolute h-full w-full animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return !user ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

export default GuestRoute;
