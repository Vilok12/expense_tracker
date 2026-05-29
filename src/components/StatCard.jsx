import React from 'react';
import { formatCurrency } from '../utils/formatters';

const StatCard = ({ title, amount, icon: Icon, color, trend, description }) => {
  return (
    <div className="glass-panel glass-panel-hover flex flex-col justify-between rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {title}
        </span>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color || 'bg-indigo-500/10 text-indigo-600'}`}>
          {Icon && <Icon className="h-5 w-5" />}
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white md:text-3xl">
          {formatCurrency(amount || 0)}
        </h3>
        
        {(trend || description) && (
          <div className="mt-2.5 flex items-center gap-1.5 text-xs">
            {trend && (
              <span className={`font-semibold ${trend.startsWith('+') || trend.includes('up') ? 'text-emerald-500' : 'text-rose-500'}`}>
                {trend}
              </span>
            )}
            {description && (
              <span className="text-slate-400 dark:text-slate-500">
                {description}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
export { StatCard };
