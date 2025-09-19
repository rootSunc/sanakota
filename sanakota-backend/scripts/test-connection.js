#!/usr/bin/env node

const { Pool } = require('pg');
require('dotenv').config({ path: '../config.env' });

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'sanakota_db',
  user: process.env.DB_USER || 'sanakota',
  password: process.env.DB_PASSWORD || 'sanakota123',
};

async function testConnection() {
  console.log('🔄 Testing database connection...');
  console.log(`📋 Configuration:`);
  console.log(`   Host: ${dbConfig.host}`);
  console.log(`   Port: ${dbConfig.port}`);
  console.log(`   Database: ${dbConfig.database}`);
  console.log(`   User: ${dbConfig.user}`);
  console.log(`   Password: ***\n`);
  
  const pool = new Pool(dbConfig);
  
  try {
    const client = await pool.connect();
    console.log('✅ Connected to database successfully!');
    
    // Test a simple query
    const result = await client.query('SELECT version();');
    console.log(`📋 PostgreSQL version: ${result.rows[0].version.split(',')[0]}`);
    
    // Check if words table exists
    const tableResult = await client.query(`
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'words'
    `);
    
    if (tableResult.rows.length === 0) {
      console.log('⚠️  Words table does not exist.');
      console.log('💡 Please create the words table first using the SQL schema.');
    } else {
      console.log('✅ Words table exists!');
      
      // Count existing words
      const countResult = await client.query('SELECT COUNT(*) as count FROM words');
      console.log(`📊 Current word count: ${countResult.rows[0].count}`);
      
      // Show table structure
      const structureResult = await client.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'words' 
        ORDER BY ordinal_position;
      `);
      
      console.log('\n📋 Words table structure:');
      structureResult.rows.forEach(row => {
        console.log(`   ${row.column_name}: ${row.data_type} (${row.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
      });
    }
    
    client.release();
    await pool.end();
    
    console.log('\n🎉 Database connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Make sure PostgreSQL is running');
    console.error('2. Check if the database and user exist');
    console.error('3. Verify the password is correct');
    console.error('4. Check if the host and port are correct');
    
    await pool.end();
    process.exit(1);
  }
}

// Run test if this script is executed directly
if (require.main === module) {
  testConnection();
}

module.exports = testConnection;
