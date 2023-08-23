const mongoose = require('mongoose');

const BudgetEntry = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user-data',
      required: true,
    },
    name: { type: String, required: true },
    date: { type: Date, required: true },
    price: { type: Number, required: true },
  },
  { collection: 'budget-entries' },
);

module.exports = mongoose.model('BudgetEntry', BudgetEntry);
