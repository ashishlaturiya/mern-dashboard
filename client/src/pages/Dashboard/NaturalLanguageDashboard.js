import React, { useState } from 'react';
import { executeNaturalLanguageQuery } from '../../services/api';
import { Card, Spinner } from 'react-bootstrap';
import DataTable from '../../components/llm/DataTable';
import DataChart from '../../components/llm/DataChart';

function NaturalLanguageDashboard() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [visualizationType, setVisualizationType] = useState('table'); // 'table', 'chart', etc.
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
        const response = await executeNaturalLanguageQuery(query);
        setResults(response.data.data);
      
      // Auto-detect best visualization type based on data
      if (response.data.data.length > 0) {
        // If data has numeric values and time/date fields, suggest a chart
        const hasNumbers = Object.values(response.data.data[0]).some(val => typeof val === 'number');
        const hasDates = Object.values(response.data.data[0]).some(val => val instanceof Date || !isNaN(Date.parse(val)));
        
        if (hasNumbers && hasDates) {
          setVisualizationType('chart');
        } else {
          setVisualizationType('table');
        }
      }
    } catch (error) {
      console.error('Error processing natural language query:', error);
      setError('Failed to process your query. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="dashboard-container">
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Ask about your data</Card.Title>
          <form onSubmit={handleSubmit}>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="E.g., Show me sales data for Chennai"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button 
                className="btn btn-primary" 
                type="submit"
                disabled={loading}
              >
                {loading ? <Spinner animation="border" size="sm" /> : 'Search'}
              </button>
            </div>
          </form>
        </Card.Body>
      </Card>
      
      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" />
          <p className="mt-2">Processing your query...</p>
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {!loading && results && (
        <Card>
          <Card.Body>
            <Card.Title>Results for: "{query}"</Card.Title>
            
            <div className="mb-3">
              <div className="btn-group" role="group">
                <button
                  type="button"
                  className={`btn ${visualizationType === 'table' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setVisualizationType('table')}
                >
                  Table View
                </button>
                <button
                  type="button"
                  className={`btn ${visualizationType === 'chart' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setVisualizationType('chart')}
                >
                  Chart View
                </button>
              </div>
            </div>
            
            {visualizationType === 'table' && (
              <DataTable data={results} />
            )}
            
            {visualizationType === 'chart' && (
              <DataChart data={results} />
            )}
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

export default NaturalLanguageDashboard;