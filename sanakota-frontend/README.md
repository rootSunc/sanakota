# Sanakota Frontend

A modern React application built with Vite and styled with TailwindCSS for responsive design.

## 🚀 Features

- ⚡ **Vite** - Lightning-fast build tool and dev server
- ⚛️ **React 18** - Latest React with modern hooks and functional components
- 🎨 **TailwindCSS** - Utility-first CSS framework for rapid UI development
- 📱 **Responsive Design** - Mobile-first approach with beautiful layouts
- 🔥 **Hot Module Replacement** - Instant updates during development
- 🎯 **Modern Stack** - Latest tools and best practices

## 🛠️ Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS** - CSS framework
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📦 Installation

1. **Navigate to the project directory**:
   ```bash
   cd sanakota-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## 🚀 Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Build

Build the application for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## 📁 Project Structure

```
sanakota-frontend/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, icons, etc.
│   ├── App.jsx            # Main application component
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles with TailwindCSS
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # TailwindCSS configuration
├── postcss.config.js      # PostCSS configuration
└── vite.config.js         # Vite configuration
```

## 🎨 TailwindCSS Configuration

The project includes a custom TailwindCSS configuration with:

- **Custom Color Palette**: Primary and secondary color schemes
- **Custom Fonts**: Inter font family
- **Component Classes**: Pre-built button and card components
- **Responsive Design**: Mobile-first approach

### Custom Components

- `.btn-primary` - Primary button styling
- `.btn-secondary` - Secondary button styling
- `.card` - Card component styling

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📱 Responsive Design

The application is built with a mobile-first approach:

- **Mobile**: Single column layout
- **Tablet**: Two column grid
- **Desktop**: Three column grid with full navigation

## 🎯 Key Features

1. **Modern Header** - Clean navigation with logo and menu
2. **Feature Cards** - Responsive grid showcasing key features
3. **Interactive Demo** - Counter component demonstrating React state
4. **Responsive Footer** - Clean footer with branding
5. **Gradient Background** - Beautiful gradient background
6. **Hover Effects** - Smooth transitions and hover states

## 🔗 Integration

This frontend is designed to work with the Sanakota backend API:

- Backend runs on `http://localhost:5000`
- Frontend runs on `http://localhost:5173`
- CORS is configured for cross-origin requests

## 📝 Next Steps

1. Set up API integration with the backend
2. Add routing with React Router
3. Implement state management (Redux/Zustand)
4. Add authentication components
5. Create additional pages and components
6. Add unit tests with Vitest
7. Set up CI/CD pipeline

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.