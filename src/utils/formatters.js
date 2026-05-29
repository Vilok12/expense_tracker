import React from 'react';
import {
  Briefcase,
  DollarSign,
  TrendingUp,
  Award,
  HelpCircle,
  Coffee,
  ShoppingBag,
  Plane,
  FileText,
  BookOpen,
  HeartPulse,
  Film,
} from 'lucide-react';

/**
 * Formats a numeric value into standard USD currency layout.
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

/**
 * Formats a Date object or date-string into a clean reader-friendly string.
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Maps transaction category strings to corresponding Lucide icons and Tailwind styles.
 */
export const getCategoryMeta = (category, type) => {
  const normalized = category ? category.toLowerCase().trim() : '';

  // Income categories
  if (type === 'income') {
    switch (normalized) {
      case 'salary':
        return { icon: Briefcase, color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' };
      case 'freelancing':
        return { icon: DollarSign, color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400' };
      case 'business':
        return { icon: TrendingUp, color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' };
      case 'investments':
        return { icon: Award, color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' };
      default:
        return { icon: HelpCircle, color: 'bg-slate-500/10 text-slate-600 dark:text-slate-400' };
    }
  }

  // Expense categories
  switch (normalized) {
    case 'food':
      return { icon: Coffee, color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' };
    case 'shopping':
      return { icon: ShoppingBag, color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400' };
    case 'travel':
      return { icon: Plane, color: 'bg-sky-500/10 text-sky-600 dark:text-sky-400' };
    case 'bills':
      return { icon: FileText, color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' };
    case 'education':
      return { icon: BookOpen, color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' };
    case 'healthcare':
      return { icon: HeartPulse, color: 'bg-red-500/10 text-red-600 dark:text-red-400' };
    case 'entertainment':
      return { icon: Film, color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400' };
    default:
      return { icon: HelpCircle, color: 'bg-slate-500/10 text-slate-600 dark:text-slate-400' };
  }
};

/**
 * Returns user-friendly labels for wallet keys.
 */
export const getWalletMeta = (wallet) => {
  switch (wallet) {
    case 'cash':
      return { label: 'Cash', color: 'bg-stone-500/10 text-stone-600 dark:text-stone-400' };
    case 'bank':
      return { label: 'Bank Account', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' };
    case 'upi':
      return { label: 'UPI / Digital Wallet', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' };
    case 'credit_card':
      return { label: 'Credit Card', color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400' };
    default:
      return { label: wallet, color: 'bg-slate-500/10 text-slate-600 dark:text-slate-400' };
  }
};
