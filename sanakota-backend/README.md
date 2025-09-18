# Sanakota Backend

A Node.js backend API built with Express.js for the Sanakota application.

## Prerequisites

Before running this project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [PostgreSQL](https://www.postgresql.org/) (for database)

## Installation

1. **Install Node.js** (if not already installed):
   - Download from [nodejs.org](https://nodejs.org/)
   - Or use a package manager like Chocolatey: `choco install nodejs`
   - Or use a version manager like nvm

2. **Clone or navigate to the project directory**:
   ```bash
   cd sanakota-backend
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Set up environment variables**:
   - Copy `config.env` to `.env`
   - Update the database credentials and other configuration values

## Running the Application

### Development Mode
```bash
npm run dev
```
This will start the server with nodemon for automatic restarts on file changes.

### Production Mode
```bash
npm start
```

The server will start on port 5000 by default. You can access:
- Main API: http://localhost:5000/
- Health check: http://localhost:5000/health

## API Endpoints

- `GET /` - Welcome message and server status
- `GET /health` - Health check endpoint

## Project Structure

```
sanakota-backend/
├── server.js          # Main server file
├── package.json       # Dependencies and scripts
├── config.env         # Environment variables template
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

## Dependencies

- **express**: Web framework for Node.js
- **pg**: PostgreSQL client for Node.js
- **dotenv**: Loads environment variables from .env file
- **cors**: Cross-Origin Resource Sharing middleware
- **nodemon**: Development dependency for auto-restarting server

## Next Steps

1. Set up PostgreSQL database
2. Create database models and migrations
3. Implement authentication middleware
4. Add API routes for your application
5. Set up proper error handling and logging
6. Add unit tests

## Environment Variables

Create a `.env` file based on `config.env` and configure:

- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`: Database configuration
- `JWT_SECRET`: Secret key for JWT tokens
- `JWT_EXPIRES_IN`: JWT token expiration time
