import React, { useEffect, useState, useCallback } from 'react';
import { useBudget } from '../context/BudgetContext';
import BudgetModal from '../components/BudgetModal';
import {
  Target,
  Sparkles,
  Calendar,
  AlertCircle,
  TrendingDown,
  Percent,
  CheckCircle,
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const Budgets = () => {
  const { budgetDetails, loading, fetchCurrentBudget } = useBudget();
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const handleFetch = useCallback(() => {
    fetchCurrentBudget(selectedMonth, selectedYear);
  }, [fetchCurrentBudget, selectedMonth, selectedYear]);

  useEffect(() => {
    handleFetch();
  }, [handleFetch]);

  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear((prev) => prev - 1);
    } else {
      setSelectedMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear((prev) => prev + 1);
    } else {
      setSelectedMonth((prev) => prev + 1);
    }
  };

  // Helper selectors
  const usage = budgetDetails.usagePercentage || 0;
  const budget = budgetDetails.budget || 0;
  const remaining = budgetDetails.remaining || 0;
  const totalExpenses = budgetDetails.totalExpenses || 0;

  const getProgressColor = (percent) => {
    if (percent >= 100) return 'bg-red-500';
    if (percent >= 90) return 'bg-orange-500';
    if (percent >= 80) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getTextColor = (percent) => {
    if (percent >= 100) return 'text-red-600 dark:text-red-400';
    if (percent >= 90) return 'text-orange-600 dark:text-orange-400';
    if (percent >= 80) return 'text-amber-600 dark:text-amber-400';
    return 'text-emerald-600 dark:text-emerald-400';
  };

  const getProgressThemeColor = (percent) => {
    if (percent >= 100) return 'border-red-500 bg-red-500/10 text-red-700 dark:text-red-400';
    if (percent >= 90) return 'border-orange-500 bg-orange-500/10 text-orange-700 dark:text-orange-400';
    if (percent >= 80) return 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-400';
    return 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400';
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Monthly Budget Planning
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure, track, and optimize spending ceilings. Avoid debt with real-time alerts.
          </p>
        </div>

        <button
          onClick={() => setBudgetModalOpen(true)}
          className="gradient-btn flex items-center gap-2 font-semibold"
        >
          <Target className="h-4.5 w-4.5" />
          Configure Selected Budget
        </button>
      </div>

      {/* Date Interval Selector */}
      <div className="glass-panel flex items-center justify-between rounded-xl p-4 shadow-sm">
        <button
          onClick={handlePrevMonth}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300 transition"
        >
          Previous Month
        </button>

        <div className="flex items-center gap-2 font-sans font-bold text-slate-800 dark:text-white text-md">
          <Calendar className="h-4.5 w-4.5 text-indigo-500" />
          <span>{MONTH_NAMES[selectedMonth - 1]} {selectedYear}</span>
        </div>

        <button
          onClick={handleNextMonth}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300 transition"
        >
          Next Month
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="mt-4 text-xs text-slate-400">Loading budget records...</p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Main budget status card */}
          <div className="glass-panel rounded-2xl p-6 shadow-sm">
            {budget > 0 ? (
              <div className="space-y-6">
                
                {/* Visual Status grid */}
                <div className="grid gap-4 sm:grid-cols-3">
                  
                  {/* Total limit */}
                  <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-white/5 dark:bg-slate-900/35">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Budget Goal Limit
                    </span>
                    <p className="text-xl font-extrabold text-slate-800 dark:text-white mt-1">
                      {formatCurrency(budget)}
                    </p>
                  </div>

                  {/* Spent */}
                  <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-white/5 dark:bg-slate-900/35">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Total Expenses Spent
                    </span>
                    <p className="text-xl font-extrabold text-rose-500 mt-1">
                      {formatCurrency(totalExpenses)}
                    </p>
                  </div>

                  {/* Remaining */}
                  <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-white/5 dark:bg-slate-900/35">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Budget Remaining Capacity
                    </span>
                    <p className={`text-xl font-extrabold mt-1 ${remaining >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {formatCurrency(remaining)}
                    </p>
                  </div>

                </div>

                {/* Progress Visualizer */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <span>Usage Progress</span>
                    <span className={getTextColor(usage)}>{usage}% Consumed</span>
                  </div>

                  <div className="h-4.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden p-0.5 border border-slate-200/50 dark:border-white/5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getProgressColor(usage)}`}
                      style={{ width: `${Math.min(usage, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Dynamic alert block box */}
                <div className={`rounded-xl border-l-4 p-4 text-xs flex gap-3 ${getProgressThemeColor(usage)}`}>
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <div>
                    {usage >= 100 ? (
                      <div>
                        <p className="font-bold">Budget Exceeded Warning!</p>
                        <p className="mt-1 opacity-90">
                          You have exceeded the monthly budget limit by {formatCurrency(Math.abs(remaining))}. Avoid further non-essential expenses to protect your reserves.
                        </p>
                      </div>
                    ) : usage >= 90 ? (
                      <div>
                        <p className="font-bold">Critical Threshold Reached (90%+ Spent)</p>
                        <p className="mt-1 opacity-90">
                          You have consumed over 90% of your allocated budget. You only have {formatCurrency(remaining)} left. Tighten your purse strings!
                        </p>
                      </div>
                    ) : usage >= 80 ? (
                      <div>
                        <p className="font-bold">Budget Alert (80%+ Spent)</p>
                        <p className="mt-1 opacity-90">
                          You are nearing your spending cap. {formatCurrency(remaining)} remains. We recommend review of your upcoming subscriptions and bills.
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
                        <span className="font-semibold">Healthy Flow: Your expenses are well within the planned monthly budget limit. Good job!</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-500">
                <Target className="h-12 w-12 opacity-30 mb-3 text-indigo-500 animate-bounce" />
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  No Budget Goal Set for {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
                </h4>
                <p className="mt-1 text-xs text-slate-400 text-center max-w-sm">
                  Setting budget targets enables real-time warning notifications when you spend above 80% and 90% levels.
                </p>
                <button
                  onClick={() => setBudgetModalOpen(true)}
                  className="gradient-btn mt-4 font-semibold text-xs py-2 px-4 flex items-center gap-1.5"
                >
                  <PlusCircle className="h-4.5 w-4.5" />
                  Set Monthly Budget Now
                </button>
              </div>
            )}
          </div>

          {/* Advice/Tips Section */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="glass-panel rounded-2xl p-5 shadow-sm space-y-2">
              <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                💡 Smarter budgeting tips
              </h5>
              <ul className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 list-disc list-inside space-y-1">
                <li>Follow the 50/30/20 rule: 50% essentials, 30% wants, 20% savings.</li>
                <li>Set up recurring transactions to automatically log utility bills on time.</li>
                <li>Check your category shares to identify unnecessary subscription drains.</li>
              </ul>
            </div>

            <div className="glass-panel rounded-2xl p-5 shadow-sm space-y-2">
              <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                📊 Budget Alert Thresholds
              </h5>
              <ul className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 space-y-1">
                <li>🟢 <strong>Below 80% Usage</strong>: Safe spending zone.</li>
                <li>🟡 <strong>80% Usage</strong>: Warning info toast alert trigger.</li>
                <li>🟠 <strong>90% Usage</strong>: Amber high-priority banner toast alert trigger.</li>
                <li>🔴 <strong>100%+ Usage</strong>: Critical limit exceeded warning alert trigger.</li>
              </ul>
            </div>
          </div>

        </div>
      )}

      {/* OVERLAY MODAL */}
      <BudgetModal
        isOpen={budgetModalOpen}
        onClose={() => {
          setBudgetModalOpen(false);
          handleFetch();
        }}
        initialAmount={budgetDetails.budget}
        month={selectedMonth}
        year={selectedYear}
      />
    </div>
  );
};

export default Budgets;
export { Budgets };
