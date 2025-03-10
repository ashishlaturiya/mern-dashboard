import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get all feedback entries
export const getAllFeedback = async () => {
  try {
    const response = await axios.get(`${API_URL}/feedback`);
    return response.data;
  } catch (error) {
    console.error('Error fetching feedback:', error);
    throw error;
  }
};

// Submit new feedback
export const submitFeedback = async (feedbackData) => {
  try {
    const response = await axios.post(`${API_URL}/feedback`, feedbackData);
    return response.data;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
};

// Get feedback analysis
export const getFeedbackAnalysis = async () => {
  try {
    const response = await axios.get(`${API_URL}/feedback/analysis`);
    return response.data;
  } catch (error) {
    console.error('Error fetching feedback analysis:', error);
    throw error;
  }
};