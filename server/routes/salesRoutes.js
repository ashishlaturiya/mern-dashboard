import express from 'express';
import { 
  getSales, 
  getSaleById, 
  createSale, 
  updateSale, 
  deleteSale,
  getSalesByCity,
  getSalesByGender,
  getSalesByAgent
} from '../controllers/salesController.js';

const router = express.Router();

router.route('/')
  .get(getSales)
  .post(createSale);

router.get('/byCity', getSalesByCity);
router.get('/byGender', getSalesByGender);
router.get('/byAgent', getSalesByAgent);

router.route('/:id')
  .get(getSaleById)
  .put(updateSale)
  .delete(deleteSale);

export default router;