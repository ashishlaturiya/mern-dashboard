import express from 'express';
import { 
  getSalesSummary, 
  getNpsSummary,
  getRecentSales,
  getTopPerformingAgents,
  getInventoryStatus,
  getSalesTrends,
  getFeedbackSentiment
} from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/sales-summary', getSalesSummary);
router.get('/nps-summary', getNpsSummary);
router.get('/recent-sales', getRecentSales);
router.get('/top-agents', getTopPerformingAgents);
router.get('/inventory-status', getInventoryStatus);
router.get('/sales-trends', getSalesTrends);
router.get('/feedback-sentiment', getFeedbackSentiment);

export default router;