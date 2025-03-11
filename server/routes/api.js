// server/routes/api.js
import express from 'express';
import { handleNaturalLanguageQuery } from '../controllers/queryController.js';

const router = express.Router();

router.post('/natural-query', handleNaturalLanguageQuery);

export default router;