import express from 'express';
import { getAllFeedback, createFeedback, getFeedbackAnalysis } from '../controllers/feedbackController.js';

const router = express.Router();

// GET all feedback
router.get('/', getAllFeedback);

// POST new feedback
router.post('/', createFeedback);

// GET feedback analysis
router.get('/analysis', getFeedbackAnalysis);

export default router;