const mongoose = require('mongoose');

const User = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    budget: { type: Number },
  },
  { collection: 'user-data' },
);

const UserModel = mongoose.model('UserData', User);

const BudgetEntry = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserData' },
    dateTime: { type: Date, required: true },
    nameOfTransaction: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { collection: 'budget-entries' },
);
const BudgetEntryModel = mongoose.model('BudgetEntry', BudgetEntry);

module.exports = { UserModel, BudgetEntryModel };
