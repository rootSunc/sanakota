const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import middleware
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const wordsRoutes = require('./routes/words');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

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

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  });
});

module.exports = app;
