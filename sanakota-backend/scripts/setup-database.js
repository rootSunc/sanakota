#!/usr/bin/env node

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'sanakota_db',
  user: process.env.DB_USER || 'sanakota',
  password: process.env.DB_PASSWORD || 'sanakota123',
};

async function setupDatabase() {
  console.log('🚀 Setting up Sanakota database...\n');
  console.log('📋 Configuration:');
  console.log(`  Host: ${dbConfig.host}`);
  console.log(`  Port: ${dbConfig.port}`);
  console.log(`  Database: ${dbConfig.database}`);
  console.log(`  User: ${dbConfig.user}`);
  console.log(`  Password: ${dbConfig.password ? '***' : 'NOT SET'}\n`);

  const pool = new Pool(dbConfig);

  try {
    // Test connection first
    console.log('🔄 Testing database connection...');
    const client = await pool.connect();
    console.log('✅ Database connection successful!');
    client.release();

    // Read and execute schema file
    const schemaPath = path.join(__dirname, '../database/schema/01_create_words_table.sql');
    if (fs.existsSync(schemaPath)) {
      console.log('📋 Creating tables and indexes...');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      await pool.query(schema);
      console.log('✅ Tables and indexes created successfully');
    }

    // Read and execute seed file
    const seedPath = path.join(__dirname, '../database/seeds/01_sample_words.sql');
    if (fs.existsSync(seedPath)) {
      console.log('🌱 Seeding database with sample data...');
      const seed = fs.readFileSync(seedPath, 'utf8');
      await pool.query(seed);
      console.log('✅ Sample data inserted successfully');
    }

    // Verify setup
    const result = await pool.query('SELECT COUNT(*) as count FROM words');
    console.log(`📊 Total words in database: ${result.rows[0].count}`);

    await pool.end();
    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Start the server: npm run dev');
    console.log('2. Test the API endpoints');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure PostgreSQL is running');
    console.log('2. Verify your .env file has correct credentials');
    console.log('3. Ensure the sanakota user exists and has proper permissions');
    console.log('4. Check if the sanakota_db database exists');
    
    await pool.end();
    process.exit(1);
  }
}

// Run setup if this script is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;
