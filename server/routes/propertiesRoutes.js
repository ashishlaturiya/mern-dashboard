import express from 'express';
import { 
  getProperties, 
  getPropertyById, 
  createProperty, 
  updateProperty, 
  deleteProperty,
  getPropertiesByCity,
  getPropertiesByType,
  getPropertiesByStatus
} from '../controllers/propertiesController.js';

const router = express.Router();

router.route('/')
  .get(getProperties)
  .post(createProperty);

router.get('/byCity', getPropertiesByCity);
router.get('/byType', getPropertiesByType);
router.get('/byStatus', getPropertiesByStatus);

router.route('/:id')
  .get(getPropertyById)
  .put(updateProperty)
  .delete(deleteProperty);

export default router;