import OpenAI from 'openai';
import { OPENAI_API_KEY } from '../config/config.js';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
});

export const processNaturalLanguageQuery = async (query, availableData) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a data analysis assistant. Convert natural language queries into MongoDB queries. 
                   Available collections: ${JSON.stringify(Object.keys(availableData))}.
                   Schema information: ${JSON.stringify(availableData)}`
        },
        {
          role: "user",
          content: query
        }
      ],
      response_format: { type: "json_object" }
    });
    
    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Error processing query with LLM:', error);
    throw error;
  }
};