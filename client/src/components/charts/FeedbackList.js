import React from 'react';

const FeedbackList = ({ feedbackData }) => {
  if (!feedbackData || feedbackData.length === 0) {
    return <div>No feedback data available.</div>;
  }

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-500';
      case 'neutral':
        return 'text-yellow-500';
      case 'negative':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'fas fa-smile';
      case 'neutral':
        return 'fas fa-meh';
      case 'negative':
        return 'fas fa-frown';
      default:
        return 'fas fa-question-circle';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Recent Customer Feedback</h3>
      </div>
      <div className="overflow-y-auto max-h-96">
        {feedbackData.map((item) => (
          <div 
            key={item._id} 
            className="p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start">
              <div 
                className={`mr-3 ${getSentimentColor(item.sentiment)}`}
              >
                <i className={`${getSentimentIcon(item.sentiment)} text-xl`}></i>
              </div>
              <div className="flex-1">
                <p className="text-gray-700">{item.feedback}</p>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <span className="mr-3">NPS: {item.nps}</span>
                  <span className="mr-3">{item.gender}</span>
                  <span className="mr-3">{item.city}</span>
                  <span>{new Date(item.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackList;