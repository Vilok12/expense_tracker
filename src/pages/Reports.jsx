import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { exportToCSV, triggerPDFPrint } from '../utils/exporters';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  TrendingUp,
  TrendingDown,
  Scale,
  Target,
  FileSpreadsheet,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const Reports = () => {
  const [reportType, setReportType] = useState('monthly'); // 'monthly' or 'yearly'
  
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const params = {
        type: reportType,
        year: selectedYear,
      };
      if (reportType === 'monthly') {
        params.month = selectedMonth;
      }

      const { data } = await api.get('/reports/summary', { params });
      setReportData(data);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [reportType, selectedMonth, selectedYear]);

  const handleExportCSV = () => {
    if (!reportData || !reportData.transactions) return;
    const name = reportType === 'monthly'
      ? `monthly_report_${MONTH_NAMES[selectedMonth - 1]}_${selectedYear}`
      : `yearly_report_${selectedYear}`;
    exportToCSV(reportData.transactions, name);
  };

  const handlePrintPDF = () => {
    triggerPDFPrint();
  };

  const summary = reportData?.summary || { totalIncome: 0, totalExpenses: 0, netSavings: 0, budgetAmount: 0 };
  const categories = reportData?.categoryBreakdown || [];
  const transactions = reportData?.transactions || [];

  return (
    <div className="space-y-6">
      
      {/* Title (no-print) */}
      <div className="no-print flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Structured Financial Reports
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate printable summaries, categorize expenditures, and export ledger records.
          </p>
        </div>

        {reportData && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition"
            >
              <FileSpreadsheet className="h-4.5 w-4.5 text-indigo-500" />
              Export Excel / CSV
            </button>
            
            <button
              onClick={handlePrintPDF}
              className="gradient-btn flex items-center gap-2 font-semibold"
            >
              <Printer className="h-4.5 w-4.5" />
              Print Report (PDF)
            </button>
          </div>
        )}
      </div>

      {/* Configurations panel (no-print) */}
      <div className="no-print glass-panel rounded-2xl p-5 shadow-sm grid gap-4 sm:grid-cols-4 items-end">
        
        {/* Report Duration Type */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Report Type
          </label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="glass-input text-xs py-2"
          >
            <option value="monthly">Monthly Statement</option>
            <option value="yearly">Yearly Statement</option>
          </select>
        </div>

        {/* Month Selector (if monthly) */}
        {reportType === 'monthly' && (
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Select Month
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="glass-input text-xs py-2"
            >
              {MONTH_NAMES.map((name, i) => (
                <option key={name} value={i + 1}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Year Selector */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Select Year
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="glass-input text-xs py-2"
          >
            {Array.from({ length: 10 }, (_, i) => now.getFullYear() - i).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Refresh button */}
        <div>
          <button
            onClick={fetchReport}
            className="w-full rounded-xl border border-indigo-200 bg-indigo-500/10 py-2.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 transition"
          >
            Regenerate Summary
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-28">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="mt-4 text-xs text-slate-400">Aggregating records for print statement...</p>
        </div>
      ) : reportData ? (
        
        // Printable page sheet content
        <div className="space-y-6 bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-10 border border-slate-100 dark:border-white/5 shadow-md">
          
          {/* Header block (Visible on PRINT & Web) */}
          <div className="flex items-center justify-between pb-6 border-b-2 border-slate-100 dark:border-white/5">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-500">
                WealthFlow Statements
              </span>
              <h3 className="text-xl font-black text-slate-800 dark:text-white mt-1">
                {reportType === 'monthly' 
                  ? `${MONTH_NAMES[selectedMonth - 1]} ${selectedYear} Statement`
                  : `Yearly Financial Summary: ${selectedYear}`}
              </h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                Generated dynamically on {new Date().toLocaleDateString()}
              </p>
            </div>

            <div className="text-right">
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                WealthFlow
              </span>
              <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                Personal Finance Tracker
              </p>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            
            {/* Total Income */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-white/5 dark:bg-slate-900/35">
              <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                Total Inflow Income
              </span>
              <p className="text-lg font-extrabold text-slate-800 dark:text-white mt-1.5">
                {formatCurrency(summary.totalIncome)}
              </p>
            </div>

            {/* Total Expense */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-white/5 dark:bg-slate-900/35">
              <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                <TrendingDown className="h-3.5 w-3.5 text-rose-500" />
                Total Outflow Expense
              </span>
              <p className="text-lg font-extrabold text-slate-800 dark:text-white mt-1.5">
                {formatCurrency(summary.totalExpenses)}
              </p>
            </div>

            {/* Savings */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-white/5 dark:bg-slate-900/35">
              <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                <Scale className="h-3.5 w-3.5 text-indigo-500" />
                Statement Net Savings
              </span>
              <p className={`text-lg font-extrabold mt-1.5 ${summary.netSavings >= 0 ? 'text-indigo-500' : 'text-rose-500'}`}>
                {formatCurrency(summary.netSavings)}
              </p>
            </div>

            {/* Budget Compare */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-white/5 dark:bg-slate-900/35">
              <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                <Target className="h-3.5 w-3.5 text-indigo-500" />
                Budget Cap Ceiling
              </span>
              <p className="text-lg font-extrabold text-slate-800 dark:text-white mt-1.5">
                {summary.budgetAmount > 0 ? formatCurrency(summary.budgetAmount) : 'N/A'}
              </p>
            </div>

          </div>

          {/* Category breakups listing */}
          <div className="pt-4">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3">
              Expense Categories Breakdown
            </h4>

            {categories.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((c) => (
                  <div
                    key={c.category}
                    className="flex items-center justify-between rounded-xl border border-slate-100 p-3.5 text-xs dark:border-white/5 bg-slate-50/20 dark:bg-slate-950/10"
                  >
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {c.category}
                    </span>
                    <div className="text-right">
                      <span className="font-extrabold text-slate-800 dark:text-white">
                        {formatCurrency(c.amount)}
                      </span>
                      <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">
                        {c.percentage}% share
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-2">No expenditures logged for category classification.</p>
            )}
          </div>

          {/* Statement ledger table */}
          <div className="pt-6">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3">
              Detailed Statement Ledger ({transactions.length} Records)
            </h4>

            {transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-white/5 font-bold text-slate-400">
                      <th className="py-2.5 px-1">Date</th>
                      <th className="py-2.5 px-1">Payee / Title</th>
                      <th className="py-2.5 px-1">Category</th>
                      <th className="py-2.5 px-1">Wallet</th>
                      <th className="py-2.5 px-1 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {transactions.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/20 dark:hover:bg-white/5">
                        <td className="py-2 px-1 text-slate-500">
                          {formatDate(t.date)}
                        </td>
                        <td className="py-2 px-1 font-semibold text-slate-800 dark:text-slate-200 truncate max-w-xs">
                          {t.title}
                          {t.description && (
                            <span className="block text-[9px] font-normal text-slate-400 dark:text-slate-500 leading-normal">
                              {t.description}
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-1 text-slate-600 dark:text-slate-400">
                          {t.category}
                        </td>
                        <td className="py-2 px-1 text-slate-500 uppercase">
                          {t.wallet}
                        </td>
                        <td className={`py-2 px-1 text-right font-extrabold ${t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                <FileText className="h-10 w-10 opacity-30 mb-2" />
                <span>No ledger transactions mapped to this interval</span>
              </div>
            )}
          </div>

        </div>
      ) : (
        <div className="text-center text-slate-400 py-10">No report configurations loaded.</div>
      )}
    </div>
  );
};

export default Reports;
export { Reports };
