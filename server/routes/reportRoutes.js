const express = require('express');
const router = express.Router();
const { getReportSummary } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

// All report routes require protection
router.use(protect);

router.get('/summary', getReportSummary);

module.exports = router;
