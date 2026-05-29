const express = require('express');
const router = express.Router();
const { getCurrentBudget, setBudget } = require('../controllers/budgetController');
const { protect } = require('../middleware/authMiddleware');

// All budget routes require protection
router.use(protect);

router.get('/current', getCurrentBudget);
router.post('/', setBudget);

module.exports = router;
