const Transaction = require('../models/Transaction');
const { processRecurringTransactions } = require('../services/recurringService');

/**
 * @desc    Get all transactions with filters & search
 * @route   GET /api/transactions
 * @access  Private
 */
const getTransactions = async (req, res) => {
  try {
    const userId = req.user._id;

    // Process due recurring transactions on-demand
    await processRecurringTransactions(userId);

    const { category, type, wallet, month, year, startDate, endDate, search } = req.query;

    const query = { userId };

    // Apply Filters
    if (type) {
      query.type = type;
    }
    
    if (category) {
      query.category = category;
    }

    if (wallet) {
      query.wallet = wallet;
    }

    // Date / Period filters
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
      };
    } else if (month && year) {
      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);
      query.date = {
        $gte: startOfMonth,
        $lte: endOfMonth,
      };
    } else if (year) {
      const startOfYear = new Date(year, 0, 1);
      const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);
      query.date = {
        $gte: startOfYear,
        $lte: endOfYear,
      };
    }

    // Search term (filters title or description)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Execute query sorted by date descending
    const transactions = await Transaction.find(query).sort({ date: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Create a new transaction
 * @route   POST /api/transactions
 * @access  Private
 */
const createTransaction = async (req, res) => {
  try {
    const { title, amount, type, category, description, date, wallet, recurring } = req.body;

    if (!title || !amount || !type || !category || !wallet) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const transaction = await Transaction.create({
      userId: req.user._id,
      title,
      amount: Number(amount),
      type,
      category,
      description: description || '',
      date: date ? new Date(date) : new Date(),
      wallet,
      recurring: recurring || 'none',
      lastRecurringProcessed: recurring && recurring !== 'none' ? (date ? new Date(date) : new Date()) : null,
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc    Update a transaction
 * @route   PUT /api/transactions/:id
 * @access  Private
 */
const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Verify owner
    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to update this transaction' });
    }

    // Update fields
    const { title, amount, type, category, description, date, wallet, recurring } = req.body;

    transaction.title = title !== undefined ? title : transaction.title;
    transaction.amount = amount !== undefined ? Number(amount) : transaction.amount;
    transaction.type = type !== undefined ? type : transaction.type;
    transaction.category = category !== undefined ? category : transaction.category;
    transaction.description = description !== undefined ? description : transaction.description;
    transaction.date = date !== undefined ? new Date(date) : transaction.date;
    transaction.wallet = wallet !== undefined ? wallet : transaction.wallet;
    
    // If recurring changes
    if (recurring !== undefined && recurring !== transaction.recurring) {
      transaction.recurring = recurring;
      transaction.lastRecurringProcessed = recurring !== 'none' ? (date ? new Date(date) : new Date()) : null;
    }

    const updatedTransaction = await transaction.save();
    res.json(updatedTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc    Delete a transaction
 * @route   DELETE /api/transactions/:id
 * @access  Private
 */
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Verify owner
    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to delete this transaction' });
    }

    await transaction.deleteOne();
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get dashboard and charts analytics
 * @route   GET /api/transactions/analytics
 * @access  Private
 */
const getTransactionAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    // Process recurring transactions before calculations
    await processRecurringTransactions(userId);

    const transactions = await Transaction.find({ userId });

    let totalIncome = 0;
    let totalExpenses = 0;
    
    const categoryBreakdown = {};
    const walletBreakdown = { cash: 0, bank: 0, upi: 0, credit_card: 0 };
    
    // Monthly aggregations (Income vs Expense over past 12 months)
    const monthlySummary = {};

    transactions.forEach((tx) => {
      const amount = tx.amount;
      const type = tx.type;
      const cat = tx.category;
      const wallet = tx.wallet;
      
      // Calculate totals
      if (type === 'income') {
        totalIncome += amount;
      } else {
        totalExpenses += amount;
      }

      // Wallet Breakdown
      if (walletBreakdown[wallet] !== undefined) {
        if (type === 'income') {
          walletBreakdown[wallet] += amount;
        } else {
          walletBreakdown[wallet] -= amount; // Expenses subtract from wallet
        }
      }

      // Category breakdown (Focus on Expenses for Category Chart)
      if (type === 'expense') {
        if (!categoryBreakdown[cat]) {
          categoryBreakdown[cat] = 0;
        }
        categoryBreakdown[cat] += amount;
      }

      // Monthly analytical calculations
      if (tx.date) {
        const d = new Date(tx.date);
        const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; // e.g., '2026-05'
        
        if (!monthlySummary[monthKey]) {
          monthlySummary[monthKey] = { income: 0, expenses: 0, savings: 0 };
        }

        if (type === 'income') {
          monthlySummary[monthKey].income += amount;
        } else {
          monthlySummary[monthKey].expenses += amount;
        }

        monthlySummary[monthKey].savings = monthlySummary[monthKey].income - monthlySummary[monthKey].expenses;
      }
    });

    const currentBalance = totalIncome - totalExpenses;

    // Convert category breakdown to array for Recharts
    const formattedCategories = Object.keys(categoryBreakdown).map((name) => ({
      name,
      value: Number(categoryBreakdown[name].toFixed(2)),
    }));

    // Convert monthly Summary to sorted array for Recharts
    const formattedMonthlyTrend = Object.keys(monthlySummary)
      .sort()
      .map((key) => {
        const [year, month] = key.split('-');
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const name = `${monthNames[parseInt(month) - 1]} ${year.slice(-2)}`;
        
        const income = Number(monthlySummary[key].income.toFixed(2));
        const expenses = Number(monthlySummary[key].expenses.toFixed(2));
        const savings = Number(monthlySummary[key].savings.toFixed(2));

        return {
          monthKey: key,
          name,
          income,
          expenses,
          savings,
        };
      })
      .slice(-12); // Return last 12 months maximum

    res.json({
      summary: {
        totalIncome: Number(totalIncome.toFixed(2)),
        totalExpenses: Number(totalExpenses.toFixed(2)),
        currentBalance: Number(currentBalance.toFixed(2)),
      },
      categoryBreakdown: formattedCategories,
      walletBreakdown,
      monthlyTrend: formattedMonthlyTrend,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionAnalytics,
};
