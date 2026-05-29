import toast from 'react-hot-toast';

/**
 * Converts transaction array data into a structured CSV file and initiates a browser download.
 *
 * @param {Array} transactions - List of transactions
 * @param {String} reportName - File download basename
 */
export const exportToCSV = (transactions, reportName = 'financial_report') => {
  if (!transactions || transactions.length === 0) {
    toast.error('No transactions available to export');
    return;
  }

  const headers = [
    'Date',
    'Title',
    'Amount ($)',
    'Type',
    'Category',
    'Wallet',
    'Recurring Freq',
    'Description'
  ];

  const rows = transactions.map((tx) => [
    new Date(tx.date).toLocaleDateString('en-US'),
    `"${tx.title.replace(/"/g, '""')}"`, // escape quotes
    tx.amount,
    tx.type.toUpperCase(),
    tx.category,
    tx.wallet.toUpperCase(),
    tx.recurring,
    `"${(tx.description || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${reportName}_${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  toast.success('Excel-compatible CSV exported successfully!');
};

/**
 * Triggers standard browser printing of the current page.
 * Uses print CSS tags to strip sidebars and topbars, generating a clean high-fidelity report.
 */
export const triggerPDFPrint = () => {
  toast.success('Preparing print layout... Close sidebar if necessary, or print from the browser.', {
    duration: 3000
  });
  setTimeout(() => {
    window.print();
  }, 500);
};
