const Transaction = require('../models/Transaction');

/**
 * Scans a user's master recurring transactions and automatically
 * generates child instances if their due date has elapsed.
 * 
 * @param {string} userId - ID of the user whose recurring transactions to process
 */
const processRecurringTransactions = async (userId) => {
  try {
    // Find all master recurring transactions (recurring != 'none')
    const masterTransactions = await Transaction.find({
      userId,
      recurring: { $ne: 'none' },
      isRecurringChild: false
    });

    const now = new Date();
    const newTransactions = [];

    for (const master of masterTransactions) {
      // The start reference point is either the last processed occurrence or the original transaction date
      let currentRefDate = master.lastRecurringProcessed
        ? new Date(master.lastRecurringProcessed)
        : new Date(master.date);

      let nextDue = getNextOccurenceDate(currentRefDate, master.recurring);
      let updatedLastProcessed = master.lastRecurringProcessed;

      // Keep generating occurrences as long as the next due date is in the past or is today
      while (nextDue <= now) {
        // Create a copy of the master transaction as a child transaction
        const childTx = {
          userId: master.userId,
          title: `${master.title} (Recurring)`,
          amount: master.amount,
          type: master.type,
          category: master.category,
          description: master.description || `Generated from recurring ${master.recurring} schedule.`,
          date: new Date(nextDue),
          wallet: master.wallet,
          recurring: 'none', // Child transactions don't repeat independently
          isRecurringChild: true,
        };

        newTransactions.push(childTx);

        // Advance reference and calculate next
        updatedLastProcessed = new Date(nextDue);
        nextDue = getNextOccurenceDate(updatedLastProcessed, master.recurring);
      }

      // If we generated any new child transactions, update the master transaction's tracking field
      if (updatedLastProcessed && (!master.lastRecurringProcessed || updatedLastProcessed > new Date(master.lastRecurringProcessed))) {
        master.lastRecurringProcessed = updatedLastProcessed;
        await master.save();
      }
    }

    if (newTransactions.length > 0) {
      await Transaction.insertMany(newTransactions);
      console.log(`Generated ${newTransactions.length} recurring transactions for user: ${userId}`);
    }
  } catch (error) {
    console.error('Error processing recurring transactions:', error);
  }
};

/**
 * Calculates the next occurrence date based on frequency.
 */
function getNextOccurenceDate(date, frequency) {
  const next = new Date(date);
  if (frequency === 'daily') {
    next.setDate(next.getDate() + 1);
  } else if (frequency === 'weekly') {
    next.setDate(next.getDate() + 7);
  } else if (frequency === 'monthly') {
    next.setMonth(next.getMonth() + 1);
  }
  return next;
}

module.exports = { processRecurringTransactions };
