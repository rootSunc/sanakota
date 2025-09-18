# Sanakota Database Schema

This directory contains the PostgreSQL database schema and setup files for the Sanakota application.

## 📁 Directory Structure

```
database/
├── schema/
│   └── 01_create_words_table.sql    # Main table schema
├── migrations/
│   └── 001_initial_setup.sql        # Initial migration
├── seeds/
│   └── 01_sample_words.sql          # Sample data
├── config.js                        # Database configuration
└── README.md                        # This file
```

## 🗄️ Database Schema

### Words Table

The main `words` table stores linguistic data with the following structure:

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key, auto-generated |
| `lemma` | VARCHAR(255) | Base form of the word (required) |
| `pos` | VARCHAR(50) | Part of speech (required) |
| `translation` | TEXT | Translation in target language |
| `definition` | TEXT | Detailed definition |
| `synonyms` | JSONB | Array of synonyms |
| `inflections` | JSONB | Object with inflected forms |
| `lexical_category` | VARCHAR(100) | Semantic category |
| `example_sentences` | JSONB | Array of example sentences |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

### Indexes

- **Primary Index**: `id` (UUID)
- **Search Indexes**: `lemma`, `pos`, `lexical_category`
- **JSONB Indexes**: GIN indexes on `synonyms`, `inflections`, `example_sentences`
- **Full-text Search**: GIN index on `lemma` and `definition`

## 🚀 Setup Instructions

### Prerequisites

1. **PostgreSQL** installed and running
2. **Node.js** and npm installed
3. **Environment variables** configured

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sanakota_db
DB_USER=your_username
DB_PASSWORD=your_password

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Quick Setup

1. **Install dependencies**:
   ```bash
   cd sanakota-backend
   npm install
   ```

2. **Setup database**:
   ```bash
   npm run setup-db
   ```

3. **Start the server**:
   ```bash
   npm run dev
   ```

### Manual Setup

If you prefer to set up the database manually:

1. **Create database**:
   ```sql
   CREATE DATABASE sanakota_db;
   ```

2. **Run schema**:
   ```bash
   psql -d sanakota_db -f database/schema/01_create_words_table.sql
   ```

3. **Seed data**:
   ```bash
   psql -d sanakota_db -f database/seeds/01_sample_words.sql
   ```

## 📊 Sample Data

The seed file includes 10 sample words with:
- Various parts of speech (noun, verb, adjective, adverb)
- Complete linguistic data (synonyms, inflections, examples)
- Different lexical categories

## 🔍 API Endpoints

Once the database is set up, you can use these API endpoints:

### Words API

- `GET /api/words` - Get all words (with filtering)
- `GET /api/words/search?q=term` - Search words
- `GET /api/words/stats` - Get statistics
- `GET /api/words/pos/:pos` - Get words by part of speech
- `GET /api/words/category/:category` - Get words by category
- `GET /api/words/:id` - Get specific word
- `POST /api/words` - Create new word
- `PUT /api/words/:id` - Update word
- `DELETE /api/words/:id` - Delete word

### Example API Calls

```bash
# Get all words
curl http://localhost:5000/api/words

# Search for words
curl "http://localhost:5000/api/words/search?q=beautiful"

# Get words by part of speech
curl http://localhost:5000/api/words/pos/noun

# Get statistics
curl http://localhost:5000/api/words/stats
```

## 🛠️ Database Operations

### Adding New Words

```javascript
const wordData = {
  lemma: "example",
  pos: "noun",
  translation: "ejemplo",
  definition: "A thing characteristic of its kind or illustrating a general rule.",
  synonyms: ["instance", "case", "illustration"],
  inflections: {
    plural: "examples"
  },
  lexical_category: "general",
  example_sentences: ["This is an example sentence."]
};

const word = await Word.create(wordData);
```

### Searching Words

```javascript
// Full-text search
const results = await Word.search("beautiful");

// Filter by part of speech
const nouns = await Word.findByPos("noun");

// Filter by category
const emotions = await Word.findByLexicalCategory("emotion");
```

## 🔧 Maintenance

### Backup Database

```bash
pg_dump sanakota_db > backup.sql
```

### Restore Database

```bash
psql sanakota_db < backup.sql
```

### Reset Database

```bash
npm run reset-db
```

## 📈 Performance Considerations

- **Indexes**: All frequently queried columns are indexed
- **JSONB**: Efficient storage and querying of JSON data
- **Full-text Search**: Optimized for text search operations
- **Connection Pooling**: Configured for optimal performance

## 🐛 Troubleshooting

### Common Issues

1. **Connection refused**: Check if PostgreSQL is running
2. **Authentication failed**: Verify username/password in .env
3. **Database not found**: Run the setup script
4. **Permission denied**: Check database user permissions

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

## 📝 Schema Evolution

To add new tables or modify existing ones:

1. Create new migration file in `migrations/`
2. Update the schema documentation
3. Test with sample data
4. Update API endpoints if needed

## 🤝 Contributing

When modifying the database schema:

1. Create migration files for all changes
2. Update this documentation
3. Test with sample data
4. Ensure backward compatibility
