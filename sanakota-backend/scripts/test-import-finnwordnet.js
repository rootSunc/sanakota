#!/usr/bin/env node

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '../config.env' });

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'sanakota_db',
  user: process.env.DB_USER || 'sanakota',
  password: process.env.DB_PASSWORD || 'sanakota123',
};

// Part of speech mapping from FinnWordNet to our format
const posMapping = {
  'N': 'noun',
  'V': 'verb', 
  'A': 'adjective',
  'Adv': 'adverb'
};

// Function to clean and parse synonyms from the synonym list
function parseSynonyms(synonymString) {
  if (!synonymString || synonymString.trim() === '') {
    return [];
  }
  
  // Split by '|' and clean up each synonym
  return synonymString.split('|').map(syn => {
    // Remove XML tags and extra whitespace
    return syn.replace(/<[^>]*>/g, '').trim();
  }).filter(syn => syn.length > 0);
}

// Function to extract the main lemma (first word) from synonym list
function extractMainLemma(synonymString) {
  const synonyms = parseSynonyms(synonymString);
  return synonyms.length > 0 ? synonyms[0] : null;
}

// Function to create inflections object from synonyms
function createInflections(synonymString) {
  const synonyms = parseSynonyms(synonymString);
  if (synonyms.length <= 1) {
    return {};
  }
  
  const inflections = {};
  synonyms.forEach((syn, index) => {
    if (index > 0) { // Skip the main lemma
      inflections[`form_${index}`] = syn;
    }
  });
  
  return inflections;
}

// Test function with sample data
async function testImport() {
  console.log('🧪 Testing Finnish WordNet import with sample data...\n');
  
  const pool = new Pool(dbConfig);
  
  try {
    // Test database connection
    console.log('🔄 Testing database connection...');
    const client = await pool.connect();
    console.log('✅ Database connection successful!');
    client.release();
    
    // Sample data from the actual TSV file
    const sampleData = [
      ['fi:a00001740', 'A', 'kykenevä | pystyvä | taitava', '(usually followed by `to\') having the necessary means or skill or know-how or authority to do something; "able to swim"; "she was able to program her computer"; "we were at last able to buy a car"; "able to get a grant for the project"', 'able', 'fi:a00001740', 'adj.all'],
      ['fi:a00002098', 'A', 'kyvytön', '(usually followed by `to\') not having the necessary means or skill or know-how; "unable to get to town without a car"; "unable to obtain funds"', 'unable', 'fi:a00002098', 'adj.all'],
      ['fi:a00002312', 'A', 'abaksiaalinen | selänpuoleinen', 'facing away from the axis of an organ or organism; "the abaxial surface of a leaf is the underside or side facing away from the stem"', 'abaxial | dorsal', 'fi:a00002312', 'adj.all']
    ];
    
    console.log('📊 Processing sample data...');
    
    // Clear existing test data
    console.log('🗑️  Clearing existing test data...');
    await pool.query('DELETE FROM words WHERE lemma IN ($1, $2, $3)', ['kykenevä', 'kyvytön', 'abaksiaalinen']);
    console.log('✅ Test data cleared');
    
    let importedCount = 0;
    
    for (const synset of sampleData) {
      try {
        const synsetId = synset[0];
        const pos = synset[1];
        const synonymString = synset[2];
        const definition = synset[3];
        const englishSynonyms = synset[4];
        const hypernyms = synset[5];
        const lexicographerFile = synset[6];
        
        // Map part of speech
        const mappedPos = posMapping[pos] || pos.toLowerCase();
        
        // Extract main lemma
        const mainLemma = extractMainLemma(synonymString);
        if (!mainLemma) {
          console.log(`⚠️  Skipping ${synsetId}: No main lemma found`);
          continue;
        }
        
        // Parse synonyms
        const synonyms = parseSynonyms(synonymString);
        
        // Create inflections
        const inflections = createInflections(synonymString);
        
        // Prepare translation
        const translation = englishSynonyms ? parseSynonyms(englishSynonyms).join(', ') : null;
        
        console.log(`📝 Processing: ${mainLemma} (${mappedPos})`);
        console.log(`   Synonyms: ${synonyms.join(', ')}`);
        console.log(`   Translation: ${translation || 'None'}`);
        console.log(`   Inflections: ${Object.keys(inflections).length > 0 ? JSON.stringify(inflections) : 'None'}`);
        
        // Insert into database
        const insertQuery = `
          INSERT INTO words (
            lemma, pos, translation, definition, synonyms, inflections, 
            lexical_category, example_sentences
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `;
        
        await pool.query(insertQuery, [
          mainLemma,
          mappedPos,
          translation,
          definition || null,
          JSON.stringify(synonyms),
          JSON.stringify(inflections),
          lexicographerFile || null,
          JSON.stringify([]) // Empty example sentences for now
        ]);
        
        importedCount++;
        console.log(`✅ Imported: ${mainLemma}\n`);
        
      } catch (error) {
        console.error(`❌ Error importing synset ${synset[0]}:`, error.message);
      }
    }
    
    console.log(`\n✅ Test import completed!`);
    console.log(`📊 Statistics:`);
    console.log(`   - Imported: ${importedCount} words`);
    
    // Verify import
    const result = await pool.query('SELECT COUNT(*) as count FROM words');
    console.log(`📋 Total words in database: ${result.rows[0].count}`);
    
    // Show imported test data
    const sampleResult = await pool.query(`
      SELECT lemma, pos, translation, definition, synonyms, inflections
      FROM words 
      WHERE lemma IN ($1, $2, $3)
      ORDER BY lemma
    `, ['kykenevä', 'kyvytön', 'abaksiaalinen']);
    
    console.log('\n📝 Imported test words:');
    sampleResult.rows.forEach(row => {
      console.log(`\n   Word: ${row.lemma} (${row.pos})`);
      console.log(`   Translation: ${row.translation || 'None'}`);
      console.log(`   Synonyms: ${JSON.parse(row.synonyms).join(', ')}`);
      console.log(`   Inflections: ${Object.keys(JSON.parse(row.inflections)).length > 0 ? JSON.stringify(JSON.parse(row.inflections)) : 'None'}`);
      console.log(`   Definition: ${row.definition ? row.definition.substring(0, 100) + '...' : 'None'}`);
    });
    
    await pool.end();
    console.log('\n🎉 Test import completed successfully!');
    console.log('\n💡 To run the full import, use: npm run import-finnwordnet');
    
  } catch (error) {
    console.error('❌ Test import failed:', error.message);
    console.error('Stack trace:', error.stack);
    await pool.end();
    process.exit(1);
  }
}

// Run test if this script is executed directly
if (require.main === module) {
  testImport();
}

module.exports = testImport;
