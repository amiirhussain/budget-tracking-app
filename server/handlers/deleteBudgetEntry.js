const BudgetEntry = require('../models/BudgetEntry');

module.exports = async (req, res, next) => {
  try {
    const entryId = req.params.id;
    await BudgetEntry.findByIdAndRemove(entryId);
    res.json({ status: 'ok', message: 'Budget entry deleted.' });
  } catch (err) {
    next(err);
  }
};
