import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../Auth/AuthContext';

export const Profile = () => {
  const navigate = useNavigate();
  const { currentMember, refreshProfile, logout } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      setIsLoading(true);
      setError('');

      try {
        const result = await refreshProfile();

        if (!result && !currentMember) {
          setError('Не удалось загрузить профиль.');
        }
      } catch (loadError) {
        setError('Не удалось загрузить профиль.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderCreatedAt = () => {
    if (!currentMember || !currentMember.created_at) {
      return '—';
    }

    try {
      const date = new Date(currentMember.created_at);
      return date.toLocaleString('ru-RU');
    } catch (parseError) {
      return currentMember.created_at;
    }
  };

  return (
    <div data-easytag="id4-src/components/Profile/index.jsx" className="profile-page">
      <h1 className="profile-title">Профиль</h1>

      {isLoading && <p className="profile-info">Загрузка профиля...</p>}
      {error && !isLoading && <p className="profile-error">{error}</p>}

      {currentMember && !isLoading && (
        <div className="profile-card">
          <div className="profile-row">
            <span className="profile-label">Имя пользователя:</span>
            <span className="profile-value">{currentMember.username}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">Дата регистрации:</span>
            <span className="profile-value">{renderCreatedAt()}</span>
          </div>
        </div>
      )}

      <button type="button" className="profile-logout" onClick={handleLogout}>
        Выйти
      </button>
    </div>
  );
};
