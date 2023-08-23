const express = require('express');
const {
  fetchBudgetEntries,
  createBudgetEntry,
  deleteBudgetEntry,
  editBudgetEntry,
} = require('../controllers/budget-controller');
const { authenticateToken } = require('../middlewares/authenticateToken');

const budgetRouter = express.Router();

budgetRouter.get('/', authenticateToken, fetchBudgetEntries);
budgetRouter.post('/', authenticateToken, createBudgetEntry);
budgetRouter.put('/:id', authenticateToken, editBudgetEntry);
budgetRouter.delete('/:id', authenticateToken, deleteBudgetEntry);

module.exports = { budgetRouter };
