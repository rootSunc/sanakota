# Sanakota Database Setup Guide

This guide provides step-by-step instructions for setting up the PostgreSQL database for the Sanakota application.

## Prerequisites

- PostgreSQL installed and running
- Node.js and npm installed
- Windows Command Prompt (cmd) or PowerShell

## Step-by-Step Setup

### 1. Create PostgreSQL User and Database

Open **Command Prompt (cmd)** and run these commands:

```cmd
# Create the database user
psql -h localhost -p 5432 -U postgres -c "CREATE USER sanakota WITH PASSWORD 'sanakota123' CREATEDB;"

# Create the database
psql -h localhost -p 5432 -U postgres -c "CREATE DATABASE sanakota_db;"

# Grant privileges
psql -h localhost -p 5432 -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE sanakota_db TO sanakota;"
```

### 2. Configure Environment Variables

Update your `.env` file with the following database configuration:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sanakota_db
DB_USER=sanakota
DB_PASSWORD=sanakota123
```

### 3. Create Database Schema and Tables

Run the schema creation script:

```cmd
psql -h localhost -p 5432 -U sanakota -d sanakota_db -f database\schema\01_create_words_table.sql
```

### 4. Insert Sample Data

Run the seed data script:

```cmd
psql -h localhost -p 5432 -U sanakota -d sanakota_db -f database\seeds\01_sample_words.sql
```

### 5. Verify Setup

Check that the data was inserted correctly:

```cmd
psql -h localhost -p 5432 -U sanakota -d sanakota_db -c "SELECT COUNT(*) as total_words FROM words;"
```

### 6. Test Node.js Connection

Test the database connection from your Node.js application:

```cmd
node -e "const { testConnection } = require('./config/database'); testConnection();"
```

### 7. Start the Server

If the connection test is successful, start your development server:

```cmd
npm run dev
```

## Alternative: Automated Setup

You can also use the automated setup script:

```cmd
npm run setup-db
```

This will:
- Test the database connection
- Create tables and indexes
- Insert sample data
- Verify the setup

## Troubleshooting

### Common Issues

1. **Password authentication failed**
   - Ensure the `sanakota` user exists with the correct password
   - Verify your `.env` file has the correct credentials

2. **Database does not exist**
   - Run the database creation commands from Step 1
   - Check that PostgreSQL is running

3. **Permission denied**
   - Ensure the `sanakota` user has proper privileges on the database
   - Run the privilege grant command from Step 1

4. **psql command not found**
   - Add PostgreSQL's bin directory to your Windows PATH
   - Or navigate to PostgreSQL installation directory first

### Verification Commands

```cmd
# Check if user exists
psql -h localhost -p 5432 -U postgres -c "\du"

# Check if database exists
psql -h localhost -p 5432 -U postgres -c "\l"

# Check tables in database
psql -h localhost -p 5432 -U sanakota -d sanakota_db -c "\dt"
```

## Database Schema

The database includes:

- **words table**: Main table for storing linguistic data
- **Indexes**: Optimized for search performance
- **JSONB columns**: For synonyms, inflections, and example sentences
- **Full-text search**: PostgreSQL's built-in search capabilities
- **Triggers**: Automatic timestamp updates

## Sample Data

The database comes with 10 sample words including:
- Various parts of speech (noun, verb, adjective, adverb)
- Complete linguistic data (synonyms, inflections, examples)
- Different lexical categories

## API Endpoints

Once set up, you can use these API endpoints:

- `GET /api/words` - Get all words
- `GET /api/words/search?q=term` - Search words
- `GET /api/words/stats` - Get statistics
- `POST /api/words` - Create new word
- `PUT /api/words/:id` - Update word
- `DELETE /api/words/:id` - Delete word

## Next Steps

1. Start developing your application
2. Add more words to the database
3. Implement additional features
4. Set up production database
5. Add authentication and user management
