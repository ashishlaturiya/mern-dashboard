import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  sentiment: {
    type: String,
    enum: ['positive', 'neutral', 'negative'],
    default: 'neutral'
  },
  source: {
    type: String,
    enum: ['customer', 'agent', 'system'],
    default: 'customer'
  },
  category: {
    type: String,
    enum: ['general', 'service', 'property', 'pricing', 'agent', 'website', 'other'],
    default: 'general'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Feedback = mongoose.model('Feedback', FeedbackSchema);

export default Feedback;