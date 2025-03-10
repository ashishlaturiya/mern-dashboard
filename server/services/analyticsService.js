import Sale from '../models/Sale.js';
import Property from '../models/Property.js';

export const calculateSalesPerformance = async (period = 'monthly') => {
  try {
    let groupByPeriod;
    
    if (period === 'daily') {
      groupByPeriod = {
        year: { $year: '$dateOfSale' },
        month: { $month: '$dateOfSale' },
        day: { $dayOfMonth: '$dateOfSale' }
      };
    } else if (period === 'monthly') {
      groupByPeriod = {
        year: { $year: '$dateOfSale' },
        month: { $month: '$dateOfSale' }
      };
    } else if (period === 'quarterly') {
      groupByPeriod = {
        year: { $year: '$dateOfSale' },
        quarter: { $ceil: { $divide: [{ $month: '$dateOfSale' }, 3] } }
      };
    } else { // yearly
      groupByPeriod = {
        year: { $year: '$dateOfSale' }
      };
    }
    
    const salesPerformance = await Sale.aggregate([
      {
        $group: {
          _id: groupByPeriod,
          salesCount: { $sum: 1 },
          totalValue: { $sum: '$price' },
          averagePrice: { $avg: '$price' },
          averageNps: { $avg: '$nps' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.quarter': 1 } }
    ]);
    
    return salesPerformance;
  } catch (error) {
    console.error('Error calculating sales performance:', error);
    throw error;
  }
};

export const calculateInventoryTurnover = async (periodMonths = 6) => {
  try {
    // Calculate date threshold
    const now = new Date();
    const thresholdDate = new Date(now.setMonth(now.getMonth() - periodMonths));
    
    // Get total properties
    const totalProperties = await Property.countDocuments();
    
    // Get properties sold in the period
    const soldProperties = await Sale.countDocuments({
      dateOfSale: { $gte: thresholdDate }
    });
    
    // Calculate turnover rate (annualized)
    const turnoverRate = (soldProperties / totalProperties) * (12 / periodMonths);
    
    // Average days on market (for sold properties)
    const soldPropertiesDetails = await Property.find({ status: 'Sold' });
    
    let totalDaysOnMarket = 0;
    let propertiesWithDates = 0;
    
    for (const property of soldPropertiesDetails) {
      const sale = await Sale.findOne({ propertyId: property.propertyId });
      
      if (sale && property.listedDate) {
        const daysOnMarket = Math.round(
          (sale.dateOfSale - property.listedDate) / (1000 * 60 * 60 * 24)
        );
        totalDaysOnMarket += daysOnMarket;
        propertiesWithDates++;
      }
    }
    
    const averageDaysOnMarket = propertiesWithDates > 0 
      ? Math.round(totalDaysOnMarket / propertiesWithDates) 
      : 0;
    
    return {
      totalProperties,
      soldProperties,
      turnoverRate,
      averageDaysOnMarket,
      periodMonths
    };
  } catch (error) {
    console.error('Error calculating inventory turnover:', error);
    throw error;
  }
};

export const calculateSalesByDemographics = async () => {
  try {
    // Sales by gender
    const salesByGender = await Sale.aggregate([
      {
        $group: {
          _id: '$customer.gender',
          count: { $sum: 1 },
          totalValue: { $sum: '$price' },
          averagePrice: { $avg: '$price' },
          averageNps: { $avg: '$nps' }
        }
      }
    ]);
    
    // Sales by age group
    const salesByAgeGroup = await Sale.aggregate([
      {
        $group: {
          _id: '$customer.ageGroup',
          count: { $sum: 1 },
          totalValue: { $sum: '$price' },
          averagePrice: { $avg: '$price' },
          averageNps: { $avg: '$nps' }
        }
      },
      {
        $sort: {
          _id: 1 // Sort by age group
        }
      }
    ]);
    
    // Property preferences by demographics
    const propertyPreferencesByGender = await Sale.aggregate([
      {
        $lookup: {
          from: 'properties',
          localField: 'propertyId',
          foreignField: 'propertyId',
          as: 'propertyDetails'
        }
      },
      {
        $unwind: '$propertyDetails'
      },
      {
        $group: {
          _id: {
            gender: '$customer.gender',
            propertyType: '$propertyDetails.propertyType'
          },
          count: { $sum: 1 },
          averagePrice: { $avg: '$price' }
        }
      },
      {
        $sort: {
          '_id.gender': 1,
          'count': -1
        }
      }
    ]);
    
    return {
      salesByGender,
      salesByAgeGroup,
      propertyPreferencesByGender
    };
  } catch (error) {
    console.error('Error calculating sales by demographics:', error);
    throw error;
  }
};