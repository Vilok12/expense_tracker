const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

/**
 * @desc    Get detailed report summary for a specific month or year
 * @route   GET /api/reports/summary
 * @access  Private
 */
const getReportSummary = async (req, res) => {
  try {
    const userId = req.user._id;
    const { month, year, type } = req.query; // type can be 'monthly' or 'yearly'

    if (!year) {
      return res.status(400).json({ message: 'Please specify at least a target year' });
    }

    const query = { userId };
    let start, end;

    if (type === 'monthly' && month) {
      const m = parseInt(month);
      const y = parseInt(year);
      start = new Date(y, m - 1, 1);
      end = new Date(y, m, 0, 23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    } else {
      // Default to yearly
      const y = parseInt(year);
      start = new Date(y, 0, 1);
      end = new Date(y, 11, 31, 23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    }

    const transactions = await Transaction.find(query).sort({ date: 1 });
    
    // Aggregations
    let totalIncome = 0;
    let totalExpenses = 0;
    
    const categorySummary = {};
    const walletSummary = { cash: 0, bank: 0, upi: 0, credit_card: 0 };
    
    const breakdownList = transactions.map(tx => {
      const amount = tx.amount;
      const t = tx.type;
      
      if (t === 'income') {
        totalIncome += amount;
      } else {
        totalExpenses += amount;
        
        // Category breakdown
        if (!categorySummary[tx.category]) {
          categorySummary[tx.category] = 0;
        }
        categorySummary[tx.category] += amount;
      }

      // Wallet Summary
      if (walletSummary[tx.wallet] !== undefined) {
        if (t === 'income') {
          walletSummary[tx.wallet] += amount;
        } else {
          walletSummary[tx.wallet] -= amount;
        }
      }

      return {
        id: tx._id,
        title: tx.title,
        amount,
        type: t,
        category: tx.category,
        description: tx.description,
        date: tx.date,
        wallet: tx.wallet,
        recurring: tx.recurring,
      };
    });

    const netSavings = totalIncome - totalExpenses;
    
    // Fetch budgets for comparison
    let budgetAmount = 0;
    if (type === 'monthly' && month) {
      const bObj = await Budget.findOne({ userId, month: parseInt(month), year: parseInt(year) });
      budgetAmount = bObj ? bObj.budgetAmount : 0;
    } else {
      // Sum yearly budget
      const bList = await Budget.find({ userId, year: parseInt(year) });
      budgetAmount = bList.reduce((acc, b) => acc + b.budgetAmount, 0);
    }

    res.json({
      period: type === 'monthly' ? `${month}/${year}` : `${year}`,
      summary: {
        totalIncome: Number(totalIncome.toFixed(2)),
        totalExpenses: Number(totalExpenses.toFixed(2)),
        netSavings: Number(netSavings.toFixed(2)),
        budgetAmount: Number(budgetAmount.toFixed(2)),
      },
      categoryBreakdown: Object.keys(categorySummary).map(cat => ({
        category: cat,
        amount: Number(categorySummary[cat].toFixed(2)),
        percentage: totalExpenses > 0 ? Number(((categorySummary[cat] / totalExpenses) * 100).toFixed(2)) : 0
      })),
      walletBreakdown: walletSummary,
      transactions: breakdownList
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getReportSummary,
};
