import Sale from '../models/Sale.js';
import Property from '../models/Property.js';

// Get sales summary (total value, count, avg price)
export const getSalesSummary = async (req, res) => {
  try {
    const summary = await Sale.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: 1 },
          totalValue: { $sum: '$price' },
          averagePrice: { $avg: '$price' }
        }
      }
    ]);
    
    res.json(summary[0] || { totalSales: 0, totalValue: 0, averagePrice: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get NPS summary
export const getNpsSummary = async (req, res) => {
  try {
    const npsSummary = await Sale.aggregate([
      {
        $group: {
          _id: null,
          averageNps: { $avg: '$nps' },
          detractors: {
            $sum: {
              $cond: [{ $lte: ['$nps', 6] }, 1, 0]
            }
          },
          passives: {
            $sum: {
              $cond: [
                { $and: [{ $gt: ['$nps', 6] }, { $lt: ['$nps', 9] }] },
                1,
                0
              ]
            }
          },
          promoters: {
            $sum: {
              $cond: [{ $gte: ['$nps', 9] }, 1, 0]
            }
          },
          totalResponses: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          averageNps: 1,
          detractors: 1,
          passives: 1,
          promoters: 1,
          totalResponses: 1,
          npsScore: {
            $multiply: [
              {
                $divide: [
                  { $subtract: ['$promoters', '$detractors'] },
                  '$totalResponses'
                ]
              },
              100
            ]
          }
        }
      }
    ]);
    
    res.json(npsSummary[0] || {
      averageNps: 0,
      detractors: 0,
      passives: 0,
      promoters: 0,
      totalResponses: 0,
      npsScore: 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get recent sales
export const getRecentSales = async (req, res) => {
  try {
    const recentSales = await Sale.find()
      .sort({ dateOfSale: -1 })
      .limit(10);
    
    res.json(recentSales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get top performing agents
export const getTopPerformingAgents = async (req, res) => {
  try {
    const topAgents = await Sale.aggregate([
      {
        $group: {
          _id: '$salesAgent',
          totalSales: { $sum: 1 },
          totalValue: { $sum: '$price' },
          averageNps: { $avg: '$nps' }
        }
      },
      { $sort: { totalValue: -1 } },
      { $limit: 5 }
    ]);
    
    res.json(topAgents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get inventory status
export const getInventoryStatus = async (req, res) => {
  try {
    const inventoryStatus = await Property.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalValue: { $sum: '$price' }
        }
      }
    ]);
    
    res.json(inventoryStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get sales trends (by month)
export const getSalesTrends = async (req, res) => {
  try {
    const salesTrends = await Sale.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$dateOfSale' },
            month: { $month: '$dateOfSale' }
          },
          count: { $sum: 1 },
          totalValue: { $sum: '$price' }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1
        }
      },
      {
        $project: {
          _id: 0,
          period: {
            $concat: [
              { $toString: '$_id.year' },
              '-',
              {
                $cond: {
                  if: { $lt: ['$_id.month', 10] },
                  then: { $concat: ['0', { $toString: '$_id.month' }] },
                  else: { $toString: '$_id.month' }
                }
              }
            ]
          },
          count: 1,
          totalValue: 1
        }
      }
    ]);
    
    res.json(salesTrends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get feedback sentiment (basic implementation)
export const getFeedbackSentiment = async (req, res) => {
  try {
    // This is a very basic implementation
    // In a real app, you'd use NLP or a sentiment analysis service
    const keywords = {
      positive: ['great', 'excellent', 'satisfied', 'good', 'perfect', 'recommend'],
      negative: ['slow', 'higher', 'longer', 'needed', 'sometimes']
    };
    
    const feedbacks = await Sale.find({}, 'feedback nps');
    
    const results = feedbacks.map(item => {
      const text = item.feedback.toLowerCase();
      let positiveCount = 0;
      let negativeCount = 0;
      
      keywords.positive.forEach(word => {
        if (text.includes(word)) positiveCount++;
      });
      
      keywords.negative.forEach(word => {
        if (text.includes(word)) negativeCount++;
      });
      
      const sentiment = positiveCount > negativeCount 
        ? 'positive' 
        : positiveCount < negativeCount 
          ? 'negative' 
          : 'neutral';
          
      return {
        feedback: item.feedback,
        nps: item.nps,
        sentiment
      };
    });
    
    const summary = {
      positive: results.filter(r => r.sentiment === 'positive').length,
      neutral: results.filter(r => r.sentiment === 'neutral').length,
      negative: results.filter(r => r.sentiment === 'negative').length,
      total: results.length,
      samples: results.slice(0, 10) // Return first 10 samples
    };
    
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};