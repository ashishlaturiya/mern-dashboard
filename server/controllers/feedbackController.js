import Feedback from '../models/Feedback.js';

// Get all feedback entries
export const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new feedback
export const createFeedback = async (req, res) => {
  try {
    const { text, sentiment, source, category } = req.body;
    
    // Perform basic sentiment analysis if not provided
    let calculatedSentiment = sentiment;
    if (!sentiment) {
      calculatedSentiment = analyzeTextSentiment(text);
    }
    
    const feedback = new Feedback({
      text,
      sentiment: calculatedSentiment,
      source: source || 'customer',
      category: category || 'general',
      createdAt: new Date()
    });
    
    const savedFeedback = await feedback.save();
    res.status(201).json(savedFeedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get feedback summary and analysis
export const getFeedbackAnalysis = async (req, res) => {
  try {
    // Count by sentiment
    const sentimentCounts = await Feedback.aggregate([
      {
        $group: {
          _id: '$sentiment',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Count by category
    const categoryCounts = await Feedback.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get recent feedback
    const recentFeedback = await Feedback.find()
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Extract common keywords (simplified)
    const keywordAnalysis = await extractCommonKeywords();
    
    res.json({
      sentimentCounts,
      categoryCounts,
      recentFeedback,
      keywordAnalysis
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Very basic sentiment analysis function
// In a production app, you'd use a proper NLP library or API
function analyzeTextSentiment(text) {
  const positiveWords = ['great', 'excellent', 'good', 'satisfied', 'happy', 'thanks', 'awesome', 'love'];
  const negativeWords = ['bad', 'poor', 'terrible', 'unhappy', 'disappointed', 'issue', 'problem', 'fail'];
  
  const lowerText = text.toLowerCase();
  let positiveCount = 0;
  let negativeCount = 0;
  
  positiveWords.forEach(word => {
    if (lowerText.includes(word)) positiveCount++;
  });
  
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) negativeCount++;
  });
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

// Extract common keywords from feedback
// This is a simplified version - in production you'd use more sophisticated NLP
async function extractCommonKeywords() {
  const allFeedback = await Feedback.find({}, 'text');
  const allText = allFeedback.map(f => f.text).join(' ').toLowerCase();
  
  // Remove common words
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'to', 'of', 'for', 'with'];
  let words = allText.match(/\b\w+\b/g) || [];
  words = words.filter(word => !stopWords.includes(word) && word.length > 3);
  
  // Count word frequencies
  const wordCounts = {};
  words.forEach(word => {
    wordCounts[word] = (wordCounts[word] || 0) + 1;
  });
  
  // Return top keywords
  return Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));
}

export default {
  getAllFeedback,
  createFeedback,
  getFeedbackAnalysis
};