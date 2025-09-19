# Finnish WordNet Import Guide

This guide explains how to import the Finnish WordNet dataset into the Sanakota database.

## Overview

The Finnish WordNet import script processes two main TSV files:
- `fiwn-synsets-extra.tsv` - Contains synsets (word groups) with definitions
- `fiwn-semrels-extra.tsv` - Contains semantic relations between synsets

## Prerequisites

1. **PostgreSQL Database**: Ensure PostgreSQL is running and the `sanakota_db` database exists
2. **Database Schema**: Create the `words` table manually using the SQL schema in `database/schema/01_create_words_table.sql`
3. **Database Permissions**: Ensure the `sanakota` user has the necessary permissions to insert data
4. **FinnWordNet Data**: Ensure the `FinnWordNet` folder is in the backend directory with the required TSV files

## Data Structure

### Words Table Schema
The import script maps FinnWordNet data to the following table structure:

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Unique identifier (auto-generated) |
| `lemma` | VARCHAR(255) | Main word form (first synonym from synset) |
| `pos` | VARCHAR(50) | Part of speech (noun, verb, adjective, adverb) |
| `translation` | TEXT | English translation (from PWN synonyms) |
| `definition` | TEXT | Word definition/gloss |
| `synonyms` | JSONB | Array of all synonyms in the synset |
| `inflections` | JSONB | Object containing inflected forms |
| `lexical_category` | VARCHAR(100) | Lexicographer file name |
| `example_sentences` | JSONB | Array of example sentences (empty for now) |

### Part of Speech Mapping
- `N` → `noun`
- `V` → `verb`
- `A` → `adjective`
- `Adv` → `adverb`

## Running the Import

### Step 1: Test Database Connection
```bash
npm run test-connection
```

### Step 2: Test Import with Sample Data
```bash
npm run test-import-finnwordnet
```

### Step 3: Full Import
```bash
npm run import-finnwordnet
```

### What the Script Does

1. **Connects to Database**: Tests connection using environment variables
2. **Reads TSV Files**: Parses both synsets and semantic relations files
3. **Processes Data**: 
   - Extracts main lemma from synonym lists
   - Parses synonyms and inflections
   - Maps part of speech codes
   - Processes semantic relations
4. **Clears Existing Data**: Removes all existing words (optional)
5. **Imports Words**: Inserts processed data into the words table
6. **Reports Statistics**: Shows import results and sample data

### Sample Output
```
🚀 Starting Finnish WordNet import...

🔄 Testing database connection...
✅ Database connection successful!
📖 Reading file: /path/to/fiwn-synsets-extra.tsv
📊 Found 12345 synsets
📖 Reading file: /path/to/fiwn-semrels-extra.tsv
🔗 Found 67890 semantic relations
🗑️  Clearing existing words data...
✅ Existing data cleared
📥 Importing synsets...
📈 Imported 1000 words...
📈 Imported 2000 words...
...

✅ Import completed!
📊 Statistics:
   - Imported: 12345 words
   - Skipped: 0 words
   - Total processed: 12345 synsets
📋 Total words in database: 12345

📝 Sample imported words:
   - kykenevä (adjective): able
   - kyvytön (adjective): unable
   - abaksiaalinen (adjective): abaxial, dorsal
   - adaksiaalinen (adjective): adaxial, ventral
   - akroskooppinen (adjective): acroscopic

🎉 Finnish WordNet import completed successfully!
```

## Data Processing Details

### Synonym Processing
- Splits synonym lists by `|` delimiter
- Removes XML tags (e.g., `<head>`, `<unconfirmed/>`)
- Uses first synonym as main lemma
- Stores all synonyms in JSONB array

### Inflection Processing
- Creates inflections object from additional synonyms
- Maps to `form_1`, `form_2`, etc. keys

### Semantic Relations
The script processes various semantic relations:
- `hypernym` - Broader terms
- `similar to` - Similar words
- `attribute` - Attributes
- `domain: topic` - Topic domains
- `domain: region` - Regional domains
- `domain: usage` - Usage domains
- `cause` - Causal relations
- `entailment` - Entailment relations
- `verb group` - Verb groups
- `member holonym` - Member relationships
- `part holonym` - Part relationships
- `substance holonym` - Substance relationships
- `instance hypernym` - Instance relationships
- `also see` - Cross-references

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check PostgreSQL is running
   - Verify database credentials in `.env` file
   - Ensure `sanakota_db` database exists

2. **File Not Found**
   - Verify `FinnWordNet` folder exists in backend directory
   - Check TSV files are present and readable

3. **Memory Issues**
   - Large datasets may require more memory
   - Consider processing in smaller batches

4. **Import Errors**
   - Check database schema is up to date
   - Verify TSV file format matches expected structure

### Environment Variables
Ensure these are set in your `.env` file:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sanakota_db
DB_USER=postgres
DB_PASSWORD=postgres
```

## Post-Import

After successful import, you can:

1. **Query the Data**:
   ```sql
   SELECT lemma, pos, translation FROM words WHERE pos = 'noun' LIMIT 10;
   ```

2. **Search Synonyms**:
   ```sql
   SELECT * FROM words WHERE synonyms @> '["kykenevä"]';
   ```

3. **Find by Part of Speech**:
   ```sql
   SELECT COUNT(*) FROM words WHERE pos = 'verb';
   ```

4. **Full-text Search**:
   ```sql
   SELECT * FROM words WHERE to_tsvector('english', lemma || ' ' || COALESCE(definition, '')) @@ plainto_tsquery('english', 'ability');
   ```

## Performance Considerations

- The import process may take several minutes for large datasets
- Consider running during off-peak hours
- Monitor database disk space during import
- The script includes progress indicators for large imports

## Customization

You can modify the import script to:
- Skip certain part of speech types
- Filter by specific lexical categories
- Add custom processing for specific word types
- Import only a subset of the data for testing
