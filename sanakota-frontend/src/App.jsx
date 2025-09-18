import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <img src={viteLogo} className="h-8 w-8" alt="Vite logo" />
              <img src={reactLogo} className="h-8 w-8 animate-spin" alt="React logo" />
              <h1 className="text-2xl font-bold text-gray-900">Sanakota</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">Home</a>
              <a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">Features</a>
              <a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">About</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Sanakota Frontend
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A modern React application built with Vite and styled with TailwindCSS for responsive design.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="card hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Development</h3>
            <p className="text-gray-600">Built with Vite for lightning-fast development and hot module replacement.</p>
          </div>

          <div className="card hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Responsive Design</h3>
            <p className="text-gray-600">Mobile-first design with TailwindCSS for beautiful, responsive layouts.</p>
          </div>

          <div className="card hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Modern Stack</h3>
            <p className="text-gray-600">React 18 with modern hooks and functional components.</p>
          </div>
        </div>

        {/* Interactive Demo */}
        <div className="card max-w-md mx-auto text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Interactive Demo</h3>
          <button 
            onClick={() => setCount((count) => count + 1)}
            className="btn-primary mb-4"
          >
            Count is {count}
          </button>
          <p className="text-gray-600 text-sm">
            Edit <code className="bg-gray-100 px-2 py-1 rounded text-sm">src/App.jsx</code> and save to test HMR
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>Built with ❤️ using React, Vite, and TailwindCSS</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
