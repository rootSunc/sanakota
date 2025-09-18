require('dotenv').config();

// Import database connection and app
const { testConnection } = require('./config/database');
const app = require('./src/app');

const PORT = process.env.PORT || 5000;

// Test database connection on startup
testConnection();

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 API endpoint: http://localhost:${PORT}/`);
});

module.exports = app;
