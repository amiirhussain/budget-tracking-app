const User = require('../models/user.model');
const BudgetEntry = require('../models/BudgetEntry');

module.exports = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ status: 'error', error: 'User not found' });
    }

    const budgetEntries = await BudgetEntry.find({ user: user._id });
    return res.json({ status: 'ok', budgetEntries });
  } catch (error) {
    next(error);
  }
};
