const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Transaction title is required'],
      trim: true,
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    type: {
      type: String,
      required: true,
      enum: {
        values: ['income', 'expense'],
        message: '{VALUE} is not a valid transaction type (must be income or expense)',
      },
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
      index: true,
    },
    wallet: {
      type: String,
      required: [true, 'Wallet type is required'],
      enum: {
        values: ['cash', 'bank', 'upi', 'credit_card'],
        message: '{VALUE} is not a valid wallet (must be cash, bank, upi, or credit_card)',
      },
      default: 'cash',
    },
    recurring: {
      type: String,
      enum: ['none', 'daily', 'weekly', 'monthly'],
      default: 'none',
    },
    isRecurringChild: {
      type: Boolean,
      default: false,
    },
    lastRecurringProcessed: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for text searching titles and descriptions
transactionSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Transaction', transactionSchema);
