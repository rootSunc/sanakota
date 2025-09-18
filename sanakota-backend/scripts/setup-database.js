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
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
};

async function setupDatabase() {
  console.log('🚀 Setting up Sanakota database...\n');

  // First, connect to postgres database to create our database
  const adminConfig = {
    ...dbConfig,
    database: 'postgres'
  };

  const adminPool = new Pool(adminConfig);

  try {
    // Check if database exists
    const dbExists = await adminPool.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [dbConfig.database]
    );

    if (dbExists.rows.length === 0) {
      console.log(`📦 Creating database: ${dbConfig.database}`);
      await adminPool.query(`CREATE DATABASE ${dbConfig.database}`);
      console.log('✅ Database created successfully');
    } else {
      console.log('✅ Database already exists');
    }

    await adminPool.end();

    // Now connect to our database
    const pool = new Pool(dbConfig);

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
    console.log('1. Update your .env file with correct database credentials');
    console.log('2. Start the server: npm run dev');
    console.log('3. Test the API endpoints');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
}

// Run setup if this script is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;
