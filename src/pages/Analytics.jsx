import React, { useEffect } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { useTheme } from '../context/ThemeContext';
import { PieChart as PieIcon, BarChart2, TrendingUp, HelpCircle } from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
  LineChart,
  Line,
} from 'recharts';
import { formatCurrency } from '../utils/formatters';

const CHART_COLORS = ['#6366f1', '#14b8a6', '#f59e0b', '#ec4899', '#3b82f6', '#10b981', '#f43f5e', '#a855f7'];

const Analytics = () => {
  const { analytics, fetchAnalytics, loading } = useTransactions();
  const { darkMode } = useTheme();

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const categoryBreakdown = analytics?.categoryBreakdown || [];
  const monthlyTrend = analytics?.monthlyTrend || [];
  const summary = analytics?.summary || { totalIncome: 0, totalExpenses: 0, currentBalance: 0 };

  const tooltipStyle = {
    background: darkMode ? '#0f172a' : '#ffffff',
    border: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
    borderRadius: '12px',
    color: darkMode ? '#f8fafc' : '#0f172a',
    fontSize: '12px',
  };

  const gridStroke = darkMode ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)';
  const labelColor = darkMode ? '#94a3b8' : '#64748b';

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Visual Wealth Analytics
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Detailed visual breakdown of spending habits, income ratios, and monthly trends.
        </p>
      </div>

      {loading && !analytics ? (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="mt-4 text-xs text-slate-400">Loading graphics and processing aggregates...</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          
          {/* A. Expense By Category (Pie Chart) */}
          <div className="glass-panel rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-1">
                <PieIcon className="h-4.5 w-4.5 text-indigo-500" />
                A. Expense Allocation By Category
              </h4>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Percentage breakdown of expenses
              </p>
            </div>

            <div className="h-72 w-full mt-6 flex items-center justify-center">
              {categoryBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryBreakdown}
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val) => formatCurrency(val)} contentStyle={tooltipStyle} />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      tick={{ fill: labelColor, fontSize: 11 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-slate-400 text-xs flex flex-col items-center">
                  <HelpCircle className="h-8 w-8 opacity-30 mb-2" />
                  No expense records logged to classify categories.
                </div>
              )}
            </div>
          </div>

          {/* B. Monthly Expense Trend (Bar Chart) */}
          <div className="glass-panel rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-1">
                <BarChart2 className="h-4.5 w-4.5 text-rose-500" />
                B. Monthly Expense Outflow Trend
              </h4>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Overview of spending across the last 12 months
              </p>
            </div>

            <div className="h-72 w-full mt-6">
              {monthlyTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: labelColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: labelColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(val) => formatCurrency(val)} contentStyle={tooltipStyle} />
                    <Bar dataKey="expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Expenses" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-center text-slate-400 text-xs flex-col">
                  <HelpCircle className="h-8 w-8 opacity-30 mb-2" />
                  Insufficient monthly data points.
                </div>
              )}
            </div>
          </div>

          {/* C. Income vs Expense (Comparison Chart) */}
          <div className="glass-panel rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-1">
                <BarChart2 className="h-4.5 w-4.5 text-emerald-500" />
                C. Income vs Expense Comparison
              </h4>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Monthly ratio of cash inflow vs outflow
              </p>
            </div>

            <div className="h-72 w-full mt-6">
              {monthlyTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: labelColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: labelColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(val) => formatCurrency(val)} contentStyle={tooltipStyle} />
                    <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" name="Income" />
                    <Area type="monotone" dataKey="expenses" stroke="#f43f5e" fillOpacity={1} fill="url(#colorExpense)" name="Expenses" />
                    <Legend tick={{ fill: labelColor, fontSize: 11 }} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-center text-slate-400 text-xs flex-col">
                  <HelpCircle className="h-8 w-8 opacity-30 mb-2" />
                  Insufficient monthly comparison records.
                </div>
              )}
            </div>
          </div>

          {/* D. Monthly Savings Trend (Line Chart) */}
          <div className="glass-panel rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-1">
                <TrendingUp className="h-4.5 w-4.5 text-indigo-500" />
                D. Monthly Savings Flow Trend
              </h4>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Tracking net savings flow (Inflow minus Outflow)
              </p>
            </div>

            <div className="h-72 w-full mt-6">
              {monthlyTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: labelColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: labelColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(val) => formatCurrency(val)} contentStyle={tooltipStyle} />
                    <Line type="monotone" dataKey="savings" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4 }} name="Net Savings" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-center text-slate-400 text-xs flex-col">
                  <HelpCircle className="h-8 w-8 opacity-30 mb-2" />
                  Insufficient monthly savings points.
                </div>
              )}
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
};

export default Analytics;
export { Analytics };
