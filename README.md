# Sanakota

A full-stack web application built with modern technologies for responsive design and robust backend functionality.

## 🏗️ Project Structure

```
Sanakota/
├── sanakota-backend/          # Node.js + Express.js API
├── sanakota-frontend/         # React + Vite + TailwindCSS
├── .gitignore                 # Git ignore rules
└── README.md                  # This file
```

## 🚀 Tech Stack

### Backend (`sanakota-backend/`)
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **PostgreSQL** - Database (via `pg` client)
- **dotenv** - Environment variables
- **CORS** - Cross-origin resource sharing
- **nodemon** - Development auto-restart

### Frontend (`sanakota-frontend/`)
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS v4** - Utility-first CSS framework
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📦 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL (for backend)

### Backend Setup
```bash
cd sanakota-backend
npm install
cp config.env .env
# Edit .env with your database credentials
npm run dev
```
Backend runs on: http://localhost:5000

### Frontend Setup
```bash
cd sanakota-frontend
npm install
npm run dev
```
Frontend runs on: http://localhost:5173

## 🔧 Development

### Backend Development
```bash
cd sanakota-backend
npm run dev    # Start with nodemon
npm start      # Start production server
```

### Frontend Development
```bash
cd sanakota-frontend
npm run dev    # Start Vite dev server
npm run build  # Build for production
npm run preview # Preview production build
```

## 📁 Project Details

### Backend Features
- ✅ Express.js server setup
- ✅ CORS middleware configured
- ✅ Environment variables support
- ✅ PostgreSQL database integration ready
- ✅ Error handling middleware
- ✅ Health check endpoint
- ✅ RESTful API structure

### Frontend Features
- ✅ React 18 with modern hooks
- ✅ Vite for fast development
- ✅ TailwindCSS v4 for styling
- ✅ Responsive design (mobile-first)
- ✅ Custom color scheme
- ✅ Component-based architecture
- ✅ Hot module replacement

## 🌐 API Endpoints

### Backend API (http://localhost:5000)
- `GET /` - Welcome message and server status
- `GET /health` - Health check endpoint

## 🎨 Design System

### Colors
- **Primary**: Blue color palette (#3b82f6 to #1e3a8a)
- **Secondary**: Gray color palette (#64748b to #0f172a)

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Components
- `.btn-primary` - Primary button styling
- `.btn-secondary` - Secondary button styling
- `.card` - Card component styling

## 🔗 Integration

The frontend and backend are designed to work together:
- Frontend makes API calls to backend
- CORS is configured for cross-origin requests
- Environment variables for configuration
- Consistent error handling

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sanakota_db
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
```

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Build and start the server
3. Configure reverse proxy (nginx)
4. Set up SSL certificates

### Frontend Deployment
1. Build the production bundle: `npm run build`
2. Deploy the `dist/` folder to a static hosting service
3. Configure environment variables for API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🔮 Roadmap

### Phase 1 (Current)
- ✅ Basic project setup
- ✅ Backend API structure
- ✅ Frontend UI framework

### Phase 2 (Next)
- [ ] Database models and migrations
- [ ] Authentication system
- [ ] User management
- [ ] API documentation

### Phase 3 (Future)
- [ ] Advanced features
- [ ] Testing suite
- [ ] CI/CD pipeline
- [ ] Performance optimization

## 📞 Support

For support and questions, please open an issue in the repository.

---

**Built with ❤️ using modern web technologies**
