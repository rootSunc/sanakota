import { useState } from "react";
import { BrowserRouter, Routes, Route, Link, NavLink } from "react-router-dom";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import WordsListPage from "./pages/WordsListPage";
import WordDetailPage from "./pages/WordDetailPage";
import WordCreatePage from "./pages/WordCreatePage";
import FlashcardsPage from "./pages/FlashcardsPage";

function App() {
  const [count, setCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

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
                <NavLink
                  to="/flashcards"
                  className={({ isActive }) =>
                    `text-gray-600 hover:text-primary-600 transition-colors ${
                      isActive ? "font-semibold text-primary-700" : ""
                    }`
                  }
                >
                  Flashcards
                </NavLink>
              </nav>
              <button
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-primary-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-300"
                aria-label="Toggle menu"
                onClick={() => setMobileOpen((v) => !v)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-b border-gray-200">
            <div className="px-4 py-3 space-y-2">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `block px-2 py-2 rounded ${
                    isActive
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-700"
                  } `
                }
                onClick={() => setMobileOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/words"
                className={({ isActive }) =>
                  `block px-2 py-2 rounded ${
                    isActive
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-700"
                  } `
                }
                onClick={() => setMobileOpen(false)}
              >
                Words
              </NavLink>
              <NavLink
                to="/flashcards"
                className={({ isActive }) =>
                  `block px-2 py-2 rounded ${
                    isActive
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-700"
                  } `
                }
                onClick={() => setMobileOpen(false)}
              >
                Flashcards
              </NavLink>
            </div>
          </div>
        )}

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
            <Route path="/flashcards" element={<FlashcardsPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-600">
              <p>Built by ❤️ Chao</p>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
