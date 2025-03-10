import Property from '../models/Property.js';

// Get all properties
export const getProperties = async (req, res) => {
  try {
    const properties = await Property.find({});
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single property by ID
export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new property
export const createProperty = async (req, res) => {
  try {
    const property = new Property(req.body);
    const savedProperty = await property.save();
    res.status(201).json(savedProperty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update property
export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    Object.assign(property, req.body);
    const updatedProperty = await property.save();
    res.json(updatedProperty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete property
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    await property.deleteOne();
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get properties by city
export const getPropertiesByCity = async (req, res) => {
  try {
    const propertiesByCity = await Property.aggregate([
      {
        $group: {
          _id: '$location.city',
          count: { $sum: 1 },
          averagePrice: { $avg: '$price' }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    res.json(propertiesByCity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get properties by type
export const getPropertiesByType = async (req, res) => {
  try {
    const propertiesByType = await Property.aggregate([
      {
        $group: {
          _id: '$propertyType',
          count: { $sum: 1 },
          averagePrice: { $avg: '$price' },
          averageArea: { $avg: '$area' }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    res.json(propertiesByType);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get properties by status
export const getPropertiesByStatus = async (req, res) => {
  try {
    const propertiesByStatus = await Property.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalValue: { $sum: '$price' }
        }
      }
    ]);
    
    res.json(propertiesByStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};