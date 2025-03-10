// server/models/Sale.js
import mongoose from 'mongoose';

const SaleSchema = new mongoose.Schema({
  propertyId: {
    type: String,
    required: true
  },
  propertyName: {
    type: String,
    required: true
  },
  location: {
    city: {
      type: String,
      required: true
    },
    district: {
      type: String,
      required: true
    }
  },
  price: {
    type: Number,
    required: true
  },
  dateOfSale: {
    type: Date,
    required: true
  },
  customer: {
    gender: {
      type: String,
      required: true
    },
    ageGroup: {
      type: String,
      required: true
    }
  },
  salesAgent: {
    type: String,
    required: true
  },
  nps: {
    type: Number,
    min: 0,
    max: 10,
    required: true
  },
  feedback: {
    type: String,
    default: ''
  }
});

const Sale = mongoose.model('Sale', SaleSchema);

export default Sale;