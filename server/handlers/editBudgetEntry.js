const BudgetEntry = require('../models/BudgetEntry');

module.exports = async (req, res, next) => {
  try {
    const entry = await BudgetEntry.findById(req.params.id);

    if (!entry) {
      return res
        .status(404)
        .json({ status: 'error', error: 'Entry not found' });
    }

    entry.name = req.body.name;
    entry.date = req.body.date;
    entry.price = req.body.price;

    await entry.save();
    res.json({ status: 'ok', message: 'Budget entry updated.' });
  } catch (err) {
    next(err);
  }
};
