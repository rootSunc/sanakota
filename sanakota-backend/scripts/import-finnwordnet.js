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

// Function to parse semantic relations and create a relations object
function parseSemanticRelations(relationsData) {
  const relations = {
    hypernyms: [],
    hyponyms: [],
    synonyms: [],
    antonyms: [],
    related: []
  };
  
  relationsData.forEach(rel => {
    const relationType = rel[2]; // Relation name
    const targetSynset = rel[4]; // Target synset id
    const targetSynonyms = parseSynonyms(rel[5]); // Target synonym list
    
    switch (relationType) {
      case 'hypernym':
        relations.hypernyms.push({
          synset_id: targetSynset,
          words: targetSynonyms
        });
        break;
      case 'similar to':
        relations.synonyms.push({
          synset_id: targetSynset,
          words: targetSynonyms
        });
        break;
      case 'attribute':
        relations.related.push({
          synset_id: targetSynset,
          words: targetSynonyms,
          relation: 'attribute'
        });
        break;
      case 'domain: topic':
        relations.related.push({
          synset_id: targetSynset,
          words: targetSynonyms,
          relation: 'domain_topic'
        });
        break;
      case 'domain: region':
        relations.related.push({
          synset_id: targetSynset,
          words: targetSynonyms,
          relation: 'domain_region'
        });
        break;
      case 'domain: usage':
        relations.related.push({
          synset_id: targetSynset,
          words: targetSynonyms,
          relation: 'domain_usage'
        });
        break;
      case 'cause':
        relations.related.push({
          synset_id: targetSynset,
          words: targetSynonyms,
          relation: 'cause'
        });
        break;
      case 'entailment':
        relations.related.push({
          synset_id: targetSynset,
          words: targetSynonyms,
          relation: 'entailment'
        });
        break;
      case 'verb group':
        relations.related.push({
          synset_id: targetSynset,
          words: targetSynonyms,
          relation: 'verb_group'
        });
        break;
      case 'member holonym':
        relations.related.push({
          synset_id: targetSynset,
          words: targetSynonyms,
          relation: 'member_holonym'
        });
        break;
      case 'part holonym':
        relations.related.push({
          synset_id: targetSynset,
          words: targetSynonyms,
          relation: 'part_holonym'
        });
        break;
      case 'substance holonym':
        relations.related.push({
          synset_id: targetSynset,
          words: targetSynonyms,
          relation: 'substance_holonym'
        });
        break;
      case 'instance hypernym':
        relations.related.push({
          synset_id: targetSynset,
          words: targetSynonyms,
          relation: 'instance_hypernym'
        });
        break;
      case 'also see':
        relations.related.push({
          synset_id: targetSynset,
          words: targetSynonyms,
          relation: 'also_see'
        });
        break;
    }
  });
  
  return relations;
}

// Function to read and parse TSV file
function readTSVFile(filePath) {
  console.log(`📖 Reading file: ${filePath}`);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n').filter(line => line.trim() !== '');
  
  return lines.map(line => {
    const parts = line.split('\t');
    return parts;
  });
}

// Main import function
async function importFinnWordNet() {
  console.log('🚀 Starting Finnish WordNet import...\n');
  
  const pool = new Pool(dbConfig);
  
  try {
    // Test database connection
    console.log('🔄 Testing database connection...');
    const client = await pool.connect();
    console.log('✅ Database connection successful!');
    client.release();
    
    // Read synsets data
    const synsetsPath = path.join(__dirname, '../FinnWordNet/fiwn-synsets-extra.tsv');
    const synsetsData = readTSVFile(synsetsPath);
    console.log(`📊 Found ${synsetsData.length} synsets`);
    
    // Read semantic relations data
    const relationsPath = path.join(__dirname, '../FinnWordNet/fiwn-semrels-extra.tsv');
    const relationsData = readTSVFile(relationsPath);
    console.log(`🔗 Found ${relationsData.length} semantic relations`);
    
    // Group relations by source synset ID for faster lookup
    const relationsBySynset = {};
    relationsData.forEach(rel => {
      const sourceId = rel[0];
      if (!relationsBySynset[sourceId]) {
        relationsBySynset[sourceId] = [];
      }
      relationsBySynset[sourceId].push(rel);
    });
    
    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing words data...');
    await pool.query('DELETE FROM words');
    console.log('✅ Existing data cleared');
    
    // Import synsets
    console.log('📥 Importing synsets...');
    let importedCount = 0;
    let skippedCount = 0;
    
    for (let i = 0; i < synsetsData.length; i++) {
      const synset = synsetsData[i];
      
      try {
        const synsetId = synset[0];
        const pos = synset[1];
        const synonymString = synset[2];
        const definition = synset[3];
        const englishSynonyms = synset[4];
        const hypernyms = synset[5];
        const lexicographerFile = synset[6];
        
        // Skip if essential data is missing
        if (!synsetId || !pos || !synonymString) {
          skippedCount++;
          continue;
        }
        
        // Map part of speech
        const mappedPos = posMapping[pos] || pos.toLowerCase();
        
        // Extract main lemma
        const mainLemma = extractMainLemma(synonymString);
        if (!mainLemma) {
          skippedCount++;
          continue;
        }
        
        // Parse synonyms
        const synonyms = parseSynonyms(synonymString);
        
        // Create inflections
        const inflections = createInflections(synonymString);
        
        // Get semantic relations for this synset
        const synsetRelations = relationsBySynset[synsetId] || [];
        const semanticRelations = parseSemanticRelations(synsetRelations);
        
        // Prepare translation (use English synonyms if available)
        const translation = englishSynonyms ? parseSynonyms(englishSynonyms).join(', ') : null;
        
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
        
        // Progress indicator
        if (importedCount % 1000 === 0) {
          console.log(`📈 Imported ${importedCount} words...`);
        }
        
      } catch (error) {
        console.error(`❌ Error importing synset ${synset[0]}:`, error.message);
        skippedCount++;
      }
    }
    
    console.log(`\n✅ Import completed!`);
    console.log(`📊 Statistics:`);
    console.log(`   - Imported: ${importedCount} words`);
    console.log(`   - Skipped: ${skippedCount} words`);
    console.log(`   - Total processed: ${importedCount + skippedCount} synsets`);
    
    // Verify import
    const result = await pool.query('SELECT COUNT(*) as count FROM words');
    console.log(`📋 Total words in database: ${result.rows[0].count}`);
    
    // Show some sample data
    const sampleResult = await pool.query(`
      SELECT lemma, pos, translation, definition 
      FROM words 
      ORDER BY created_at DESC 
      LIMIT 5
    `);
    
    console.log('\n📝 Sample imported words:');
    sampleResult.rows.forEach(row => {
      console.log(`   - ${row.lemma} (${row.pos}): ${row.translation || 'No translation'}`);
    });
    
    await pool.end();
    console.log('\n🎉 Finnish WordNet import completed successfully!');
    
  } catch (error) {
    console.error('❌ Import failed:', error.message);
    console.error('Stack trace:', error.stack);
    await pool.end();
    process.exit(1);
  }
}

// Run import if this script is executed directly
if (require.main === module) {
  importFinnWordNet();
}

module.exports = importFinnWordNet;
