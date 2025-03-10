import Sale from '../models/Sale.js';

// Get all sales
export const getSales = async (req, res) => {
  try {
    const sales = await Sale.find({});
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single sale by ID
export const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new sale
export const createSale = async (req, res) => {
  try {
    const sale = new Sale(req.body);
    const savedSale = await sale.save();
    res.status(201).json(savedSale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update sale
export const updateSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    
    Object.assign(sale, req.body);
    const updatedSale = await sale.save();
    res.json(updatedSale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete sale
export const deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    
    await sale.remove();
    res.json({ message: 'Sale deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get sales by city
export const getSalesByCity = async (req, res) => {
  try {
    const salesByCity = await Sale.aggregate([
      {
        $group: {
          _id: '$location.city',
          count: { $sum: 1 },
          totalValue: { $sum: '$price' }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    res.json(salesByCity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get sales by gender
export const getSalesByGender = async (req, res) => {
  try {
    const salesByGender = await Sale.aggregate([
      {
        $group: {
          _id: '$customer.gender',
          count: { $sum: 1 },
          totalValue: { $sum: '$price' },
          avgNps: { $avg: '$nps' }
        }
      }
    ]);
    
    res.json(salesByGender);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get sales by agent
export const getSalesByAgent = async (req, res) => {
  try {
    const salesByAgent = await Sale.aggregate([
      {
        $group: {
          _id: '$salesAgent',
          count: { $sum: 1 },
          totalValue: { $sum: '$price' },
          avgNps: { $avg: '$nps' }
        }
      },
      { $sort: { totalValue: -1 } }
    ]);
    
    res.json(salesByAgent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};