import React, { useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import './App.css';

import { Home } from './components/Home';
import { Register } from './components/Register';
import { Login } from './components/Login';
import { Profile } from './components/Profile';

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
      <div data-easytag="id1-src/App.jsx" className="app-root">
        <header className="app-header">
          <div className="app-header-inner">
            <div className="app-logo">Групповой чат</div>
            <nav className="app-nav">
              <Link className="app-nav-link" to="/">Главная</Link>
              <Link className="app-nav-link" to="/register">Регистрация</Link>
              <Link className="app-nav-link" to="/login">Вход</Link>
              <Link className="app-nav-link" to="/profile">Профиль</Link>
            </nav>
          </div>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
