import { useState } from "react";
import { BrowserRouter, Routes, Route, Link, NavLink } from "react-router-dom";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import WordsListPage from "./pages/WordsListPage";
import WordDetailPage from "./pages/WordDetailPage";
import WordCreatePage from "./pages/WordCreatePage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-4">
                <img src={viteLogo} className="h-8 w-8" alt="Vite logo" />
                <img
                  src={reactLogo}
                  className="h-8 w-8 animate-spin"
                  alt="React logo"
                />
                <h1 className="text-2xl font-bold text-gray-900">Sanakota</h1>
              </div>
              <nav className="hidden md:flex space-x-8">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `text-gray-600 hover:text-primary-600 transition-colors ${
                      isActive ? "font-semibold text-primary-700" : ""
                    }`
                  }
                >
                  Home
                </NavLink>
                <NavLink
                  to="/words"
                  className={({ isActive }) =>
                    `text-gray-600 hover:text-primary-600 transition-colors ${
                      isActive ? "font-semibold text-primary-700" : ""
                    }`
                  }
                >
                  Words
                </NavLink>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Routes>
            <Route
              path="/"
              element={
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    Welcome to Sanakota
                  </h2>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Browse the Finnish WordNet powered dictionary.
                  </p>
                  <div className="mt-8">
                    <NavLink to="/words" className="btn-primary">
                      Explore Words
                    </NavLink>
                  </div>
                </div>
              }
            />
            <Route path="/words" element={<WordsListPage />} />
            <Route path="/words/new" element={<WordCreatePage />} />
            <Route path="/words/:id" element={<WordDetailPage />} />
          </Routes>
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
    </BrowserRouter>
  );
}

export default App;
