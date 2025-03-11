import { processNaturalLanguageQuery } from '../services/llmService.js';
import * as models from '../models/index.js';

export const handleNaturalLanguageQuery = async (req, res) => {
  try {
    const { query } = req.body;
    
    // Get available data models/schemas to help the LLM
    const availableData = {};
    Object.keys(models).forEach(modelName => {
      availableData[modelName] = models[modelName].schema.paths;
    });
    
    // Process with LLM
    const queryData = await processNaturalLanguageQuery(query, availableData);
    
    // Execute the generated query
    const result = await executeQuery(queryData);
    
    res.json({ data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper function to execute the generated query
async function executeQuery(queryData) {
  const { collection, filter, projection, sort, limit } = queryData;
  
  if (!models[collection]) {
    throw new Error(`Collection ${collection} not found`);
  }
  
  let query = models[collection].find(filter || {});
  
  if (projection) query = query.select(projection);
  if (sort) query = query.sort(sort);
  if (limit) query = query.limit(limit);
  
  return await query.exec();
}