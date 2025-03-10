import mongoose from 'mongoose';

const PropertySchema = new mongoose.Schema({
  propertyId: {
    type: String,
    required: true,
    unique: true
  },
  propertyName: {
    type: String,
    required: true
  },
  propertyType: {
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
    },
    address: {
      type: String,
      required: true
    }
  },
  price: {
    type: Number,
    required: true
  },
  bedrooms: {
    type: Number,
    required: true
  },
  bathrooms: {
    type: Number,
    required: true
  },
  area: {
    type: Number,
    required: true
  },
  features: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['Available', 'Sold', 'Reserved'],
    default: 'Available'
  },
  listedDate: {
    type: Date,
    default: Date.now
  }
});

const Property = mongoose.model('Property', PropertySchema);

export default Property;