import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { registerMember } from '../../../api/auth';
import { useAuth } from '../AuthContext';

export const Register = () => {
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

    if (password.length < 4) {
      setError('Пароль должен содержать не менее 4 символов.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await registerMember({ username: trimmedUsername, password });
      login(response);
      navigate('/');
    } catch (submitError) {
      let message = 'Ошибка при регистрации. Попробуйте ещё раз.';

      if (submitError.response && submitError.response.data) {
        const data = submitError.response.data;

        if (typeof data === 'string') {
          message = data;
        } else if (data.non_field_errors && data.non_field_errors.length > 0) {
          message = data.non_field_errors[0];
        } else if (data.username && data.username.length > 0) {
          message = data.username[0];
        }
      }

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div data-easytag="id2-src/components/Auth/Register/index.jsx" className="auth-page">
      <h1 className="auth-title">Регистрация</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-field">
          <label className="auth-label" htmlFor="register-username">
            Имя пользователя
          </label>
          <input
            id="register-username"
            type="text"
            className="auth-input"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Введите имя пользователя"
          />
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="register-password">
            Пароль
          </label>
          <input
            id="register-password"
            type="password"
            className="auth-input"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Введите пароль"
          />
        </div>

        {error && <div className="auth-error">{error}</div>}

        <button className="auth-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
      </form>
    </div>
  );
};
