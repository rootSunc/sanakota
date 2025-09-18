const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database connection and routes
const { testConnection } = require('./database/config');
const wordsRoutes = require('./routes/words');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test database connection on startup
testConnection();

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Sanakota Backend API',
    status: 'Server is running successfully',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      words: '/api/words',
      search: '/api/words/search',
      stats: '/api/words/stats'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: 'Connected'
  });
});

// API Routes
app.use('/api/words', wordsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 API endpoint: http://localhost:${PORT}/`);
});

module.exports = app;
