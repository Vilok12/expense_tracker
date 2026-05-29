import React, { useEffect, useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import TransactionModal from '../components/TransactionModal';
import ConfirmationModal from '../components/ConfirmationModal';
import {
  Search,
  SlidersHorizontal,
  Plus,
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
  Trash2,
  Edit3,
  Calendar,
  X,
  Wallet,
} from 'lucide-react';
import { formatCurrency, formatDate, getCategoryMeta, getWalletMeta } from '../utils/formatters';

const INCOME_CATEGORIES = ['Salary', 'Freelancing', 'Business', 'Investments', 'Other'];
const EXPENSE_CATEGORIES = ['Food', 'Shopping', 'Travel', 'Bills', 'Education', 'Healthcare', 'Entertainment', 'Other'];
const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

const Transactions = () => {
  const {
    transactions,
    filters,
    loading,
    updateFilters,
    resetFilters,
    fetchTransactions,
    removeTransaction,
  } = useTransactions();

  const [txModalOpen, setTxModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [txToDelete, setTxToDelete] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch whenever filters shift
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions, filters]);

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
      setTxToDelete(null);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    updateFilters({ [name]: value });
  };

  // Compute stats dynamically for current filtered ledger list
  const filteredIncome = transactions
    .filter((tx) => tx.type === 'income')
    .reduce((acc, tx) => acc + tx.amount, 0);

  const filteredExpenses = transactions
    .filter((tx) => tx.type === 'expense')
    .reduce((acc, tx) => acc + tx.amount, 0);

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Financial Transactions Ledger
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Complete database of your transaction history. Search, filter, and track flows.
          </p>
        </div>

        <button
          onClick={handleOpenAddTx}
          className="gradient-btn flex items-center gap-2 font-semibold"
        >
          <Plus className="h-4.5 w-4.5" />
          Add Transaction
        </button>
      </div>

      {/* Ledger Stats Snapshots */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="glass-panel flex items-center justify-between rounded-xl p-4 shadow-sm border-l-4 border-emerald-500">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Filtered Income Total
            </span>
            <p className="text-lg font-extrabold text-emerald-500 mt-0.5">
              {formatCurrency(filteredIncome)}
            </p>
          </div>
          <TrendingUp className="h-8 w-8 text-emerald-500/20" />
        </div>

        <div className="glass-panel flex items-center justify-between rounded-xl p-4 shadow-sm border-l-4 border-rose-500">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Filtered Expense Total
            </span>
            <p className="text-lg font-extrabold text-rose-500 mt-0.5">
              {formatCurrency(filteredExpenses)}
            </p>
          </div>
          <TrendingDown className="h-8 w-8 text-rose-500/20" />
        </div>

        <div className="glass-panel flex items-center justify-between rounded-xl p-4 shadow-sm border-l-4 border-indigo-500">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Net Interval Savings
            </span>
            <p className={`text-lg font-extrabold mt-0.5 ${filteredIncome - filteredExpenses >= 0 ? 'text-indigo-500' : 'text-rose-500'}`}>
              {formatCurrency(filteredIncome - filteredExpenses)}
            </p>
          </div>
          <ArrowLeftRight className="h-8 w-8 text-indigo-500/20" />
        </div>
      </div>

      {/* Search and Filters Layout */}
      <div className="glass-panel rounded-2xl p-4 shadow-sm space-y-4">
        
        {/* Search row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500 h-full w-4.5" />
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search transaction by title, payees, notes..."
              className="glass-input pl-10"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 transition ${
                showFilters ? 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400' : 'bg-white text-slate-700 dark:text-slate-300'
              }`}
            >
              <SlidersHorizontal className="h-4.5 w-4.5" />
              Filters
            </button>

            {(filters.type || filters.category || filters.wallet || filters.startDate || filters.endDate || filters.search) && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-semibold hover:bg-rose-500/20 transition"
              >
                <X className="h-4.5 w-4.5" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Collapsible advanced filters options */}
        {showFilters && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 pt-4 border-t border-slate-100 dark:border-white/5 animate-fade-in">
            
            {/* Filter by Type */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Transaction Type
              </label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="glass-input py-2 text-xs"
              >
                <option value="">All Types</option>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            {/* Filter by Category */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Category
              </label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="glass-input py-2 text-xs"
              >
                <option value="">All Categories</option>
                {ALL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Wallet */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Wallet / Account
              </label>
              <select
                name="wallet"
                value={filters.wallet}
                onChange={handleFilterChange}
                className="glass-input py-2 text-xs"
              >
                <option value="">All Wallets</option>
                <option value="cash">Cash</option>
                <option value="bank">Bank Account</option>
                <option value="upi">UPI / Digital Wallet</option>
                <option value="credit_card">Credit Card</option>
              </select>
            </div>

            {/* Custom Dates filter wrapper */}
            <div className="col-span-2 sm:col-span-1 grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  className="glass-input py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  className="glass-input py-2 text-xs"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Ledger List */}
      <div className="glass-panel rounded-2xl p-6 shadow-sm">
        
        {loading && transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
            <p className="mt-4 text-xs text-slate-400">Querying database records...</p>
          </div>
        ) : transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-white/5 text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-3">
                  <th className="py-3 px-2">Date</th>
                  <th className="py-3 px-2">Transaction Details</th>
                  <th className="py-3 px-2">Category</th>
                  <th className="py-3 px-2">Wallet / Account</th>
                  <th className="py-3 px-2 text-right">Amount</th>
                  <th className="py-3 px-2 text-center no-print">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {transactions.map((tx) => {
                  const meta = getCategoryMeta(tx.category, tx.type);
                  const walletMeta = getWalletMeta(tx.wallet);
                  const Icon = meta.icon;

                  return (
                    <tr
                      key={tx._id}
                      className="hover:bg-slate-50/30 dark:hover:bg-white/5 transition duration-150"
                    >
                      {/* Date */}
                      <td className="py-4 px-2 text-xs text-slate-500 dark:text-slate-400 shrink-0">
                        {formatDate(tx.date)}
                      </td>

                      {/* Details (Title & Description) */}
                      <td className="py-4 px-2 max-w-xs overflow-hidden">
                        <div className="flex items-center gap-2.5">
                          <div className={`flex h-8.5 w-8.5 items-center justify-center rounded-lg ${meta.color} shrink-0`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="overflow-hidden">
                            <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
                              {tx.title}
                            </p>
                            {tx.description && (
                              <p className="truncate text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                                {tx.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-2">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-semibold tracking-wider ${meta.color}`}>
                          {tx.category}
                        </span>
                      </td>

                      {/* Wallet */}
                      <td className="py-4 px-2">
                        <span className={`inline-flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 font-medium`}>
                          <Wallet className="h-3.5 w-3.5 text-slate-400" />
                          {walletMeta.label}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-2 text-right">
                        <span className={`text-xs font-extrabold ${tx.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                        </span>
                        
                        {tx.recurring !== 'none' && (
                          <div className="text-[8px] text-indigo-500 font-bold uppercase tracking-widest mt-0.5">
                            {tx.recurring} recurring
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-2 text-center no-print">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditTx(tx)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/5 dark:hover:text-white"
                            title="Edit"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => handleOpenDeleteTx(tx._id)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-red-500/10 hover:text-red-500"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500">
            <ArrowLeftRight className="h-12 w-12 opacity-30 mb-3 text-indigo-500" />
            <span className="text-xs font-semibold">No transactions match your filter criteria</span>
            <button
              onClick={resetFilters}
              className="mt-3 text-xs text-indigo-500 hover:text-indigo-400 font-bold"
            >
              Clear filters and show all
            </button>
          </div>
        )}
      </div>

      {/* MODALS */}
      <TransactionModal
        isOpen={txModalOpen}
        onClose={() => {
          setTxModalOpen(false);
          fetchTransactions();
        }}
        transaction={selectedTx}
      />

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Remove Transaction"
        message="This will completely delete this record from your wealth flow logs. Are you sure?"
      />
    </div>
  );
};

export default Transactions;
export { Transactions };
