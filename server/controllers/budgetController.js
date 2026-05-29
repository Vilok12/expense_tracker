const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

/**
 * @desc    Get budget and current expenditure for a specific month
 * @route   GET /api/budgets/current
 * @access  Private
 */
const getCurrentBudget = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    
    // Default to current month and year if not specified
    const month = req.query.month ? parseInt(req.query.month) : now.getMonth() + 1;
    const year = req.query.year ? parseInt(req.query.year) : now.getFullYear();

    // Fetch budget limits
    let budget = await Budget.findOne({ userId, month, year });
    
    // Calculate total expenses for the selected month/year
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    const transactions = await Transaction.find({
      userId,
      type: 'expense',
      date: {
        $gte: startOfMonth,
        $lte: endOfMonth
      }
    });

    const totalExpenses = transactions.reduce((acc, tx) => acc + tx.amount, 0);

    res.json({
      budget: budget ? budget.budgetAmount : 0,
      month,
      year,
      totalExpenses: Number(totalExpenses.toFixed(2)),
      remaining: budget ? Number((budget.budgetAmount - totalExpenses).toFixed(2)) : 0,
      usagePercentage: budget && budget.budgetAmount > 0 
        ? Number(((totalExpenses / budget.budgetAmount) * 100).toFixed(2))
        : 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Set or update budget for a specific month
 * @route   POST /api/budgets
 * @access  Private
 */
const setBudget = async (req, res) => {
  try {
    const userId = req.user._id;
    const { month, year, budgetAmount } = req.body;

    if (!month || !year || budgetAmount === undefined) {
      return res.status(400).json({ message: 'Please provide month, year and budget amount' });
    }

    if (budgetAmount < 0) {
      return res.status(400).json({ message: 'Budget amount must be a positive number' });
    }

    // Upsert budget (update if exists, create if not)
    const budget = await Budget.findOneAndUpdate(
      { userId, month, year },
      { budgetAmount: Number(budgetAmount) },
      { new: true, upsert: true, runValidators: true }
    );

    // Recalculate and return details
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    const expenses = await Transaction.find({
      userId,
      type: 'expense',
      date: {
        $gte: startOfMonth,
        $lte: endOfMonth
      }
    });

    const totalExpenses = expenses.reduce((acc, tx) => acc + tx.amount, 0);

    res.status(200).json({
      message: 'Budget saved successfully',
      budget: budget.budgetAmount,
      month,
      year,
      totalExpenses: Number(totalExpenses.toFixed(2)),
      remaining: Number((budget.budgetAmount - totalExpenses).toFixed(2)),
      usagePercentage: budget.budgetAmount > 0 
        ? Number(((totalExpenses / budget.budgetAmount) * 100).toFixed(2))
        : 0
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getCurrentBudget,
  setBudget,
};
