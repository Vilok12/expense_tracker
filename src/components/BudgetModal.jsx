import React, { useState, useEffect } from 'react';
import { useBudget } from '../context/BudgetContext';
import { X } from 'lucide-react';

const BudgetModal = ({ isOpen, onClose, initialAmount, month, year }) => {
  const { saveBudget } = useBudget();
  const [amount, setAmount] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setAmount(initialAmount ? String(initialAmount) : '');
  }, [initialAmount, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) < 0) return;
    setSaving(true);
    const success = await saveBudget(month, year, Number(amount));
    setSaving(false);
    if (success) {
      onClose();
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition-all dark:bg-slate-900 border border-slate-100 dark:border-white/5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Set Monthly Budget Goal
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
          
          <div className="rounded-xl bg-indigo-50/50 p-4 text-xs text-indigo-700 dark:bg-indigo-950/15 dark:text-indigo-400">
            Configure your total expenditure limit for <strong>{monthNames[month - 1]} {year}</strong>. We'll send real-time system alerts when spending consumes 80% and 90% of this capacity.
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
              Budget Goal Limit ($) *
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 1500.00"
              step="0.01"
              min="0.00"
              className="glass-input"
              required
              autoFocus
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
              {saving ? 'Saving...' : 'Set Budget Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetModal;
export { BudgetModal };
