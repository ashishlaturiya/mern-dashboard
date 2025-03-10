# Fayredge Dashboard

A comprehensive real estate sales and customer feedback dashboard for Fayredge properties built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- **Sales Analytics:** Track sales by city, agent performance, and trends over time
- **NPS (Net Promoter Score) Analysis:** Monitor customer satisfaction and feedback
- **Customer Demographics:** Analyze sales patterns by gender and age group
- **Feedback Analysis:** Sentiment analysis and keyword tracking from customer feedback
- **Property Inventory Management:** Track available, reserved, and sold properties

## Tech Stack

### Frontend
- React with hooks and context API
- Chakra UI for responsive design
- Recharts for data visualization
- React Router for navigation
- Axios for API requests

### Backend
- Node.js with Express
- MongoDB with Mongoose ODM
- RESTful API architecture
- ES6+ JavaScript

## Project Structure

```
fayredge-dashboard/
├── client/                     # Frontend React application
│   ├── public/                 # Static assets
│   └── src/                    # React source files
│       ├── components/         # Reusable components
│       ├── pages/              # Page components
│       ├── services/           # API service functions
│       └── ...
├── server/                     # Backend Node.js/Express application
│   ├── config/                 # Configuration files
│   ├── controllers/            # Route controllers
│   ├── models/                 # Mongoose models
│   ├── routes/                 # API routes
│   ├── scripts/                # Scripts (including db seeder)
│   └── ...
└── ...
```

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- MongoDB (local or Atlas connection)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/fayredge-dashboard.git
   cd fayredge-dashboard
   ```

2. Install dependencies for server, client, and root:
   ```
   npm run install-all
   ```

3. Create a `.env` file in the server directory:
   ```
   MONGO_URI=mongodb://localhost:27017/fayredgeDashboard
   PORT=5000
   ```

4. Seed the database with sample data:
   ```
   npm run seed-db
   ```

5. Run the development server (both frontend and backend):
   ```
   npm run dev
   ```

6. Access the application at http://localhost:3000

## API Endpoints

### Dashboard
- GET `/api/dashboard/sales-summary` - Get sales summary statistics
- GET `/api/dashboard/nps-summary` - Get NPS summary
- GET `/api/dashboard/recent-sales` - Get recent sales
- GET `/api/dashboard/top-agents` - Get top performing agents
- GET `/api/dashboard/inventory-status` - Get inventory status
- GET `/api/dashboard/sales-trends` - Get sales trends
- GET `/api/dashboard/feedback-sentiment` - Get feedback sentiment analysis

### Sales
- GET `/api/sales` - Get all sales
- GET `/api/sales/:id` - Get a specific sale
- GET `/api/sales/byCity` - Get sales grouped by city
- GET `/api/sales/byGender` - Get sales grouped by gender
- GET `/api/sales/byAgent` - Get sales grouped by agent

### Properties
- GET `/api/properties` - Get all properties
- GET `/api/properties/:id` - Get a specific property
- GET `/api/properties/byCity` - Get properties grouped by city
- GET `/api/properties/byType` - Get properties grouped by type
- GET `/api/properties/byStatus` - Get properties grouped by status

## License

This project is licensed under the MIT License.