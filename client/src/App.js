import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/react';

// Layout Components
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';

// Pages
import Dashboard from './pages/Dashboard/Dashboard';
import NpsAnalysisPage from './pages/NpsAnalysis/NpsAnalysisPage';
import SalesByCityPage from './pages/SalesByCityPage/SalesByCityPage';
import GenderAnalysisPage from './pages/GenderAnalysisPage/GenderAnalysisPage';
import FeedbackAnalysisPage from './pages/FeedbackAnalysisPage/FeedbackAnalysisPage';
import PropertiesPage from './pages/PropertiesPage/PropertiesPage';
import SalesPage from './pages/SalesPage/SalesPage';
import FeedbackPage from './pages/FeedbackPage/FeedbackPage';

// Theme
import theme from './theme';
import { ChakraProvider } from '@chakra-ui/react';

const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Box display="flex" height="100vh">
          <Sidebar />
          <Box flex="1" marginLeft="16rem" width="calc(100% - 16rem)">
            <Header />
            <Box as="main" p={4}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/nps-analysis" element={<NpsAnalysisPage />} />
                <Route path="/sales-by-city" element={<SalesByCityPage />} />
                <Route path="/gender-analysis" element={<GenderAnalysisPage />} />
                <Route path="/feedback-analysis" element={<FeedbackAnalysisPage />} />
                <Route path="/feedback" element={<FeedbackPage />} />
                <Route path="/properties" element={<PropertiesPage />} />
                <Route path="/sales" element={<SalesPage />} />
              </Routes>
            </Box>
          </Box>
        </Box>
      </Router>
    </ChakraProvider>
  );
};

export default App;