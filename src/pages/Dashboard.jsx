import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTransactions } from '../context/TransactionContext';
import { useBudget } from '../context/BudgetContext';
import { useTheme } from '../context/ThemeContext';
import StatCard from '../components/StatCard';
import TransactionModal from '../components/TransactionModal';
import BudgetModal from '../components/BudgetModal';
import ConfirmationModal from '../components/ConfirmationModal';
import {
  TrendingUp,
  TrendingDown,
  Scale,
  Sparkles,
  Plus,
  Target,
  ArrowRight,
  PlusCircle,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { formatCurrency, formatDate, getCategoryMeta, getWalletMeta } from '../utils/formatters';

const COLORS = ['#6366f1', '#14b8a6', '#f59e0b', '#ec4899', '#3b82f6', '#ef4444', '#8b5cf6', '#10b981'];

const Dashboard = () => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const {
    transactions,
    analytics,
    fetchTransactions,
    fetchAnalytics,
    removeTransaction,
  } = useTransactions();
  
  const { budgetDetails, fetchCurrentBudget } = useBudget();

  // Modal control states
  const [txModalOpen, setTxModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [txToDelete, setTxToDelete] = useState(null);

  useEffect(() => {
    fetchTransactions();
    fetchAnalytics();
    fetchCurrentBudget();
  }, [fetchTransactions, fetchAnalytics, fetchCurrentBudget]);

  const handleOpenAddTx = () => {
    setSelectedTx(null);
    setTxModalOpen(true);
  };

  const handleOpenEditTx = (tx) => {
    setSelectedTx(tx);
    setTxModalOpen(true);
  };

  const handleOpenDeleteTx = (id) => {
    setTxToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (txToDelete) {
      await removeTransaction(txToDelete);
      fetchTransactions();
      fetchAnalytics();
      fetchCurrentBudget();
      setTxToDelete(null);
    }
  };

  // Safe variables computation
  const summary = analytics?.summary || { totalIncome: 0, totalExpenses: 0, currentBalance: 0 };
  const monthlyTrend = analytics?.monthlyTrend || [];
  const categoryBreakdown = analytics?.categoryBreakdown || [];

  const currentSavings = summary.totalIncome - summary.totalExpenses;
  const recentTransactions = transactions.slice(0, 5); // Grab top 5

  // Budget color scheme mapping
  const getBudgetProgressColor = (percent) => {
    if (percent >= 100) return 'bg-red-500';
    if (percent >= 90) return 'bg-orange-500';
    if (percent >= 80) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getBudgetTextColor = (percent) => {
    if (percent >= 100) return 'text-red-600 dark:text-red-400';
    if (percent >= 90) return 'text-orange-600 dark:text-orange-400';
    if (percent >= 80) return 'text-amber-600 dark:text-amber-400';
    return 'text-emerald-600 dark:text-emerald-400';
  };

  return (
    <div className="space-y-8">
      
      {/* Greetings & Quick action panel */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-3xl">
            Welcome, {user?.name}!
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1">
            <Sparkles className="h-4 w-4 text-indigo-500" />
            Here is your live wealth flow overview. Take absolute control of your cash.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setBudgetModalOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition"
          >
            <Target className="h-4.5 w-4.5 text-indigo-500" />
            Set Budget Limit
          </button>
          
          <button
            onClick={handleOpenAddTx}
            className="gradient-btn flex items-center gap-2 font-semibold"
          >
            <Plus className="h-4.5 w-4.5" />
            New Transaction
          </button>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Income"
          amount={summary.totalIncome}
          icon={TrendingUp}
          color="bg-emerald-500/10 text-emerald-600"
          description="Inflow earnings logged"
        />
        <StatCard
          title="Total Expenses"
          amount={summary.totalExpenses}
          icon={TrendingDown}
          color="bg-rose-500/10 text-rose-600"
          description="Outflow payments logged"
        />
        <StatCard
          title="Current Balance"
          amount={summary.currentBalance}
          icon={Scale}
          color="bg-indigo-500/10 text-indigo-600"
          description="Net aggregated cash assets"
        />
        <StatCard
          title="Monthly Savings"
          amount={currentSavings}
          icon={Sparkles}
          color={currentSavings >= 0 ? "bg-teal-500/10 text-teal-600" : "bg-red-500/10 text-red-600"}
          description="Retained financial savings"
        />
      </div>

      {/* Budget Limit Tracker Progress Bar */}
      <div className="glass-panel rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className={`rounded-xl p-2.5 ${budgetDetails.usagePercentage >= 90 ? 'bg-red-500/10 text-red-500' : 'bg-indigo-500/10 text-indigo-500'}`}>
              <Target className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Monthly Spend Budget Goal
              </h4>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {budgetDetails.budget > 0 
                  ? `Limit set to ${formatCurrency(budgetDetails.budget)} for this month`
                  : 'No monthly expenditure limit set yet. Set a budget limit to track progress!'}
              </p>
            </div>
          </div>

          {budgetDetails.budget > 0 && (
            <div className="text-right">
              <span className={`text-sm font-bold ${getBudgetTextColor(budgetDetails.usagePercentage)}`}>
                {budgetDetails.usagePercentage}% Used
              </span>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                {formatCurrency(budgetDetails.totalExpenses)} of {formatCurrency(budgetDetails.budget)}
              </p>
            </div>
          )}
        </div>

        {budgetDetails.budget > 0 && (
          <div className="mt-5">
            {/* Progress Bar */}
            <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getBudgetProgressColor(budgetDetails.usagePercentage)}`}
                style={{ width: `${Math.min(budgetDetails.usagePercentage, 100)}%` }}
              ></div>
            </div>

            {/* Threshold alerts banner */}
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1.5">
                {budgetDetails.usagePercentage >= 100 ? (
                  <span className="flex items-center gap-1 text-red-500 font-medium">
                    <AlertCircle className="h-4 w-4" />
                    Budget Exceeded! Spent {formatCurrency(Math.abs(budgetDetails.remaining))} extra!
                  </span>
                ) : budgetDetails.usagePercentage >= 80 ? (
                  <span className="flex items-center gap-1 text-amber-500 font-medium">
                    <AlertCircle className="h-4 w-4" />
                    Warning: Budget is reaching limits. Only {formatCurrency(budgetDetails.remaining)} remaining.
                  </span>
                ) : (
                  <span>Keep it up! {formatCurrency(budgetDetails.remaining)} budget remaining.</span>
                )}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Charts & Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Visual Analytics snapshot (left column) */}
        <div className="glass-panel flex flex-col justify-between rounded-2xl p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5 mb-6">
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Monthly Income vs Expenses
              </h4>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Overview of recent financial flows
              </p>
            </div>
            
            <Link
              to="/analytics"
              className="flex items-center gap-1 text-xs font-semibold text-indigo-500 hover:text-indigo-400"
            >
              Full Charts
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="h-72 w-full">
            {monthlyTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis
                    dataKey="name"
                    tick={{ fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: darkMode ? '#0f172a' : '#ffffff',
                      border: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
                      borderRadius: '12px',
                      color: darkMode ? '#f8fafc' : '#0f172a',
                    }}
                  />
                  <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="Income" />
                  <Bar dataKey="expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Expense" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                <Calendar className="h-10 w-10 opacity-40 mb-2" />
                <span className="text-xs">No monthly trends data logged yet</span>
              </div>
            )}
          </div>
        </div>

        {/* Expenses Category breakdown (Right Column) */}
        <div className="glass-panel flex flex-col rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5 mb-6">
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Category Expense Share
              </h4>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Current month allocations
              </p>
            </div>
          </div>

          <div className="relative flex-1 flex flex-col items-center justify-center">
            {categoryBreakdown.length > 0 ? (
              <>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryBreakdown}
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {categoryBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val) => formatCurrency(val)}
                        contentStyle={{
                          background: darkMode ? '#0f172a' : '#ffffff',
                          border: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
                          borderRadius: '10px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* List categories */}
                <div className="mt-4 w-full grid grid-cols-2 gap-2 text-xs">
                  {categoryBreakdown.slice(0, 4).map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-1.5 overflow-hidden">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></span>
                      <span className="truncate text-slate-600 dark:text-slate-400 text-[11px]">
                        {entry.name}: {formatCurrency(entry.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 py-10">
                <Calendar className="h-10 w-10 opacity-40 mb-2" />
                <span className="text-xs text-center">No monthly expense category logged</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions List Table */}
      <div className="glass-panel rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5 mb-4">
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Recent Transactions Ledger
            </h4>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Latest financial activity logged
            </p>
          </div>

          <Link
            to="/transactions"
            className="flex items-center gap-1 text-xs font-semibold text-indigo-500 hover:text-indigo-400"
          >
            All Ledger Records
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recentTransactions.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {recentTransactions.map((tx) => {
              const meta = getCategoryMeta(tx.category, tx.type);
              const walletMeta = getWalletMeta(tx.wallet);
              const Icon = meta.icon;

              return (
                <div
                  key={tx._id}
                  className="flex items-center justify-between py-3.5 hover:bg-slate-50/40 dark:hover:bg-white/5 px-2 rounded-xl transition duration-150"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    {/* Category Icon */}
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${meta.color}`}>
                      <Icon className="h-4.5 w-4.5" />
                    </div>

                    <div className="overflow-hidden">
                      <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {tx.title}
                      </p>
                      
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                        <span>{formatDate(tx.date)}</span>
                        <span>•</span>
                        <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-semibold ${walletMeta.color}`}>
                          {walletMeta.label}
                        </span>
                        {tx.recurring !== 'none' && (
                          <>
                            <span>•</span>
                            <span className="text-indigo-500 uppercase tracking-widest font-bold text-[8px] bg-indigo-500/10 px-1 rounded-sm">
                              {tx.recurring}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-4">
                    <span className={`text-xs font-extrabold ${tx.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>
                    
                    {/* Actions button */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditTx(tx)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/5 dark:hover:text-white text-[11px]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleOpenDeleteTx(tx._id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-red-500/10 hover:text-red-500 text-[11px]"
                      >
                        Del
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 py-12">
            <PlusCircle className="h-10 w-10 opacity-30 mb-3 text-indigo-500" />
            <span className="text-xs font-medium">Your financial ledger is completely empty</span>
            <button
              onClick={handleOpenAddTx}
              className="mt-3 text-xs text-indigo-500 hover:text-indigo-400 font-bold flex items-center gap-1"
            >
              Add your first transaction now
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>

      {/* OVERLAY MODALS */}
      <TransactionModal
        isOpen={txModalOpen}
        onClose={() => {
          setTxModalOpen(false);
          fetchTransactions();
          fetchAnalytics();
          fetchCurrentBudget();
        }}
        transaction={selectedTx}
      />

      <BudgetModal
        isOpen={budgetModalOpen}
        onClose={() => {
          setBudgetModalOpen(false);
          fetchCurrentBudget();
        }}
        initialAmount={budgetDetails.budget}
        month={budgetDetails.month}
        year={budgetDetails.year}
      />

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Transaction Record"
        message="Are you sure you want to permanently delete this transaction from your wealth flow? This action is irreversible."
      />
    </div>
  );
};

export default Dashboard;
export { Dashboard };
