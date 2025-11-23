import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { loginMember } from '../../../api/auth';
import { useAuth } from '../AuthContext';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const trimmedUsername = username.trim();

    if (!trimmedUsername || !password) {
      setError('Пожалуйста, заполните все поля.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await loginMember({ username: trimmedUsername, password });
      login(response);
      navigate('/');
    } catch (submitError) {
      let message = 'Ошибка при входе. Проверьте логин и пароль.';

      if (submitError.response && submitError.response.data) {
        const data = submitError.response.data;

        if (typeof data === 'string') {
          message = data;
        } else if (data.non_field_errors && data.non_field_errors.length > 0) {
          message = data.non_field_errors[0];
        } else if (data.detail) {
          message = data.detail;
        }
      }

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div data-easytag="id3-src/components/Auth/Login/index.jsx" className="auth-page">
      <h1 className="auth-title">Вход</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-field">
          <label className="auth-label" htmlFor="login-username">
            Имя пользователя
          </label>
          <input
            id="login-username"
            type="text"
            className="auth-input"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Введите имя пользователя"
          />
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="login-password">
            Пароль
          </label>
          <input
            id="login-password"
            type="password"
            className="auth-input"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Введите пароль"
          />
        </div>

        {error && <div className="auth-error">{error}</div>}

        <button className="auth-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Вход...' : 'Войти'}
        </button>
      </form>
    </div>
  );
};
