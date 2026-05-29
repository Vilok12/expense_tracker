import React, { useState, useEffect } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { X } from 'lucide-react';

const INCOME_CATEGORIES = ['Salary', 'Freelancing', 'Business', 'Investments', 'Other'];
const EXPENSE_CATEGORIES = ['Food', 'Shopping', 'Travel', 'Bills', 'Education', 'Healthcare', 'Entertainment', 'Other'];

const TransactionModal = ({ isOpen, onClose, transaction }) => {
  const { addTransaction, editTransaction } = useTransactions();
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: 'Food',
    wallet: 'cash',
    date: new Date().toISOString().slice(0, 10),
    recurring: 'none',
    description: '',
  });

  const [saving, setSaving] = useState(false);

  // Set form data if editing a transaction
  useEffect(() => {
    if (transaction) {
      setFormData({
        title: transaction.title || '',
        amount: transaction.amount || '',
        type: transaction.type || 'expense',
        category: transaction.category || 'Food',
        wallet: transaction.wallet || 'cash',
        date: transaction.date ? new Date(transaction.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        recurring: transaction.recurring || 'none',
        description: transaction.description || '',
      });
    } else {
      setFormData({
        title: '',
        amount: '',
        type: 'expense',
        category: 'Food',
        wallet: 'cash',
        date: new Date().toISOString().slice(0, 10),
        recurring: 'none',
        description: '',
      });
    }
  }, [transaction, isOpen]);

  // Sync category default when transaction type toggles
  useEffect(() => {
    if (!transaction) {
      setFormData((prev) => ({
        ...prev,
        category: prev.type === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0],
      }));
    }
  }, [formData.type, transaction]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const success = transaction
      ? await editTransaction(transaction._id, formData)
      : await addTransaction(formData);

    setSaving(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl transition-all dark:bg-slate-900 border border-slate-100 dark:border-white/5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {transaction ? 'Edit Transaction Details' : 'Add New Transaction'}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
              Title / Payee *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Weekly Groceries, Monthly Salary"
              className="glass-input"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Amount */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                Amount ($) *
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0.01"
                className="glass-input"
                required
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="glass-input"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="glass-input"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="glass-input"
              >
                {formData.type === 'income'
                  ? INCOME_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))
                  : EXPENSE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Wallet */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                Wallet / Account *
              </label>
              <select
                name="wallet"
                value={formData.wallet}
                onChange={handleChange}
                className="glass-input"
              >
                <option value="cash">Cash</option>
                <option value="bank">Bank Account</option>
                <option value="upi">UPI / Digital Wallet</option>
                <option value="credit_card">Credit Card</option>
              </select>
            </div>

            {/* Recurring */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                Recurring Period
              </label>
              <select
                name="recurring"
                value={formData.recurring}
                onChange={handleChange}
                className="glass-input"
              >
                <option value="none">One-time (None)</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add payment notes, reference numbers, details..."
              rows="3"
              className="glass-input resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="gradient-btn font-semibold"
              disabled={saving}
            >
              {saving ? 'Saving...' : transaction ? 'Update Record' : 'Create Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
export { TransactionModal };
