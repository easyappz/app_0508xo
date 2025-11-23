import React, { useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';

import ErrorBoundary from './ErrorBoundary';
import './App.css';

import { Home } from './components/Home';
import { Register } from './components/Auth/Register';
import { Login } from './components/Auth/Login';
import { Profile } from './components/Profile';
import { AuthProvider, useAuth } from './components/Auth/AuthContext';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';

function AppShell() {
  const navigate = useNavigate();
  const { authToken, logout } = useAuth();

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  return (
    <div data-easytag="id1-src/App.jsx" className="app-root">
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-logo">Групповой чат</div>
          <nav className="app-nav">
            {authToken ? (
              <>
                <Link className="app-nav-link" to="/">
                  Главная
                </Link>
                <Link className="app-nav-link" to="/profile">
                  Профиль
                </Link>
                <button
                  type="button"
                  className="app-nav-button"
                  onClick={handleLogoutClick}
                >
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link className="app-nav-link" to="/register">
                  Регистрация
                </Link>
                <Link className="app-nav-link" to="/login">
                  Вход
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="app-main">
        <Routes>
          <Route
            path="/"
            element={(
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            )}
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/profile"
            element={(
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            )}
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  /** Никогда не удаляй этот код */
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.handleRoutes === 'function') {
      /** Нужно передавать список существующих роутов */
      window.handleRoutes(['/', '/register', '/login', '/profile']);
    }
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
