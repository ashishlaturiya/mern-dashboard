import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Sales API calls
export const getSales = async () => {
  try {
    const response = await api.get('/sales');
    return response.data;
  } catch (error) {
    console.error('Error fetching sales:', error);
    throw error;
  }
};

export const getSalesByCity = async () => {
  try {
    const response = await api.get('/sales/byCity');
    return response.data;
  } catch (error) {
    console.error('Error fetching sales by city:', error);
    throw error;
  }
};

export const getSalesByGender = async () => {
  try {
    const response = await api.get('/sales/byGender');
    return response.data;
  } catch (error) {
    console.error('Error fetching sales by gender:', error);
    throw error;
  }
};

export const getSalesByAgent = async () => {
  try {
    const response = await api.get('/sales/byAgent');
    return response.data;
  } catch (error) {
    console.error('Error fetching sales by agent:', error);
    throw error;
  }
};

// Properties API calls
export const getProperties = async () => {
  try {
    const response = await api.get('/properties');
    return response.data;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};

export const getPropertiesByCity = async () => {
  try {
    const response = await api.get('/properties/byCity');
    return response.data;
  } catch (error) {
    console.error('Error fetching properties by city:', error);
    throw error;
  }
};

export const getPropertiesByType = async () => {
  try {
    const response = await api.get('/properties/byType');
    return response.data;
  } catch (error) {
    console.error('Error fetching properties by type:', error);
    throw error;
  }
};

export const getPropertiesByStatus = async () => {
  try {
    const response = await api.get('/properties/byStatus');
    return response.data;
  } catch (error) {
    console.error('Error fetching properties by status:', error);
    throw error;
  }
};

// Dashboard API calls
export const getSalesSummary = async () => {
  try {
    const response = await api.get('/dashboard/sales-summary');
    return response.data;
  } catch (error) {
    console.error('Error fetching sales summary:', error);
    throw error;
  }
};

export const getNpsSummary = async () => {
  try {
    const response = await api.get('/dashboard/nps-summary');
    return response.data;
  } catch (error) {
    console.error('Error fetching NPS summary:', error);
    throw error;
  }
};

export const getRecentSales = async () => {
  try {
    const response = await api.get('/dashboard/recent-sales');
    return response.data;
  } catch (error) {
    console.error('Error fetching recent sales:', error);
    throw error;
  }
};

export const getTopAgents = async () => {
  try {
    const response = await api.get('/dashboard/top-agents');
    return response.data;
  } catch (error) {
    console.error('Error fetching top agents:', error);
    throw error;
  }
};

export const getInventoryStatus = async () => {
  try {
    const response = await api.get('/dashboard/inventory-status');
    return response.data;
  } catch (error) {
    console.error('Error fetching inventory status:', error);
    throw error;
  }
};

export const getSalesTrends = async () => {
  try {
    const response = await api.get('/dashboard/sales-trends');
    return response.data;
  } catch (error) {
    console.error('Error fetching sales trends:', error);
    throw error;
  }
};

export const getFeedbackSentiment = async () => {
  try {
    const response = await api.get('/dashboard/feedback-sentiment');
    return response.data;
  } catch (error) {
    console.error('Error fetching feedback sentiment:', error);
    throw error;
  }
};