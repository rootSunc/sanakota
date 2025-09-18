# Sanakota Backend

A Node.js backend API built with Express.js and PostgreSQL for the Sanakota linguistic application.

## 🏗️ Project Structure

```
sanakota-backend/
├── src/                          # Source code
│   ├── controllers/              # Request handlers
│   │   └── wordsController.js    # Words API controller
│   ├── middleware/               # Custom middleware
│   │   ├── errorHandler.js       # Global error handling
│   │   ├── logger.js             # Request logging
│   │   └── validation.js         # Input validation
│   ├── models/                   # Data models
│   │   └── Word.js               # Word model with database operations
│   ├── routes/                   # API routes
│   │   └── words.js              # Words API routes
│   └── app.js                    # Express app configuration
├── config/                       # Configuration files
│   └── database.js               # Database configuration
├── database/                     # Database files
│   ├── migrations/               # Database migrations
│   ├── schema/                   # Database schema
│   └── seeds/                    # Sample data
├── scripts/                      # Utility scripts
│   └── setup-database.js         # Database setup script
├── tests/                        # Test files (future)
├── server.js                     # Application entry point
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn
- Windows Command Prompt (cmd) or PowerShell

### Installation

1. **Clone and navigate to the project**:
   ```bash
   cd sanakota-backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create PostgreSQL user and database**:
   ```cmd
   psql -h localhost -p 5432 -U postgres -c "CREATE USER sanakota WITH PASSWORD 'sanakota123' CREATEDB;"
   psql -h localhost -p 5432 -U postgres -c "CREATE DATABASE sanakota_db;"
   psql -h localhost -p 5432 -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE sanakota_db TO sanakota;"
   ```

4. **Configure environment variables**:
   ```bash
   cp config.env .env
   # Edit .env with these database credentials:
   # DB_USER=sanakota
   # DB_PASSWORD=sanakota123
   ```

5. **Setup database schema and data**:
   ```cmd
   psql -h localhost -p 5432 -U sanakota -d sanakota_db -f database\schema\01_create_words_table.sql
   psql -h localhost -p 5432 -U sanakota -d sanakota_db -f database\seeds\01_sample_words.sql
   ```

6. **Start the server**:
   ```bash
   npm run dev
   ```

### Alternative: Automated Setup

```bash
npm run setup-db
```

## 🔧 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run setup-db` - Setup database with schema and sample data
- `npm run reset-db` - Reset database (future)

## 🗄️ Database Schema

### Words Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `lemma` | VARCHAR(255) | Base form of the word |
| `pos` | VARCHAR(50) | Part of speech |
| `translation` | TEXT | Translation in target language |
| `definition` | TEXT | Detailed definition |
| `synonyms` | JSONB | Array of synonyms |
| `inflections` | JSONB | Object with inflected forms |
| `lexical_category` | VARCHAR(100) | Semantic category |
| `example_sentences` | JSONB | Array of example sentences |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

## 🌐 API Endpoints

### Words API

- `GET /api/words` - Get all words (with filtering)
- `GET /api/words/search?q=term` - Search words using full-text search
- `GET /api/words/stats` - Get database statistics
- `GET /api/words/pos/:pos` - Get words by part of speech
- `GET /api/words/category/:category` - Get words by lexical category
- `GET /api/words/:id` - Get specific word by ID
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

# Create a new word
curl -X POST http://localhost:5000/api/words \
  -H "Content-Type: application/json" \
  -d '{
    "lemma": "example",
    "pos": "noun",
    "translation": "ejemplo",
    "definition": "A thing characteristic of its kind",
    "synonyms": ["instance", "case"],
    "lexical_category": "general"
  }'
```

## 🏛️ Architecture

### MVC Pattern

- **Models** (`src/models/`): Data access layer with database operations
- **Views** (`src/controllers/`): Request handling and response formatting
- **Controllers** (`src/routes/`): Route definitions and middleware

### Middleware

- **Logger**: Request/response logging with timing
- **Error Handler**: Global error handling and formatting
- **Validation**: Input validation for API endpoints

### Database Layer

- **Connection Pooling**: Efficient database connections
- **Query Builder**: Raw SQL with parameterized queries
- **Migrations**: Version-controlled database schema changes

## 🔒 Environment Variables

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sanakota_db
DB_USER=your_username
DB_PASSWORD=your_password

# JWT Configuration (for future use)
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
```

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run tests with coverage
npm run test:coverage
```

## 📦 Dependencies

### Production
- **express**: Web framework
- **pg**: PostgreSQL client
- **dotenv**: Environment variables
- **cors**: Cross-origin resource sharing

### Development
- **nodemon**: Development auto-restart

## 🚀 Deployment

### Production Setup

1. **Environment Configuration**:
   ```bash
   NODE_ENV=production
   PORT=5000
   ```

2. **Database Setup**:
   ```bash
   npm run setup-db
   ```

3. **Start Server**:
   ```bash
   npm start
   ```

### Docker (Future)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🔧 Development

### Code Style

- Use ES6+ features
- Follow RESTful API conventions
- Implement proper error handling
- Add comprehensive logging

### Adding New Features

1. Create model in `src/models/`
2. Add controller in `src/controllers/`
3. Define routes in `src/routes/`
4. Add middleware if needed
5. Update database schema if required

## 📝 API Documentation

### Response Format

All API responses follow this format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message",
  "count": 10
}
```

### Error Format

```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error description"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🔮 Roadmap

- [ ] Authentication and authorization
- [ ] User management
- [ ] Advanced search features
- [ ] API rate limiting
- [ ] Comprehensive test suite
- [ ] API documentation with Swagger
- [ ] Docker containerization
- [ ] CI/CD pipeline