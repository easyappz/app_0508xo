import React, { useEffect, useState } from 'react';

import { fetchMessages, sendMessage } from '../../api/chat';
import { useAuth } from '../Auth/AuthContext';

const formatTime = (value) => {
  if (!value) {
    return '';
  }

  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    return value;
  }
};

export const Home = () => {
  const { currentMember } = useAuth();

  const [messages, setMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadMessages = async () => {
      if (!isMounted) {
        return;
      }

      try {
        if (isMounted) {
          setError('');
        }

        const data = await fetchMessages({ limit: 50 });

        if (isMounted && Array.isArray(data)) {
          setMessages(data);
        }
      } catch (loadError) {
        if (isMounted) {
          setError('Не удалось загрузить сообщения.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadMessages();

    const intervalId = window.setInterval(() => {
      if (!isMounted) {
        return;
      }

      fetchMessages({ limit: 50 })
        .then((data) => {
          if (isMounted && Array.isArray(data)) {
            setMessages(data);
          }
        })
        .catch(() => {
          // Keep previous messages, do not override error from initial load unnecessarily
        });
    }, 5000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const text = newMessageText.trim();
    if (!text) {
      return;
    }

    try {
      setIsSending(true);
      const created = await sendMessage({ text });

      setNewMessageText('');

      if (created) {
        setMessages((prev) => [...prev, created]);
      }
    } catch (submitError) {
      setError('Не удалось отправить сообщение. Попробуйте ещё раз.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div data-easytag="id5-src/components/Home/index.jsx" className="chat-page">
      <div className="chat-header-bar">
        <h1 className="chat-title">Групповой чат</h1>
        {currentMember && (
          <div className="chat-user-info">Вы вошли как: {currentMember.username}</div>
        )}
      </div>

      <div className="chat-layout">
        <div className="chat-messages-wrapper">
          {isLoading && <div className="chat-status">Загрузка сообщений...</div>}
          {error && !isLoading && <div className="chat-error">{error}</div>}

          {!isLoading && !error && messages.length === 0 && (
            <div className="chat-empty">Сообщений пока нет. Напишите первое сообщение!</div>
          )}

          <div className="chat-messages">
            {messages.map((message) => (
              <div key={message.id} className="chat-message">
                <div className="chat-message-meta">
                  <span className="chat-message-user">{message.member_username}</span>
                  <span className="chat-message-time">{formatTime(message.created_at)}</span>
                </div>
                <div className="chat-message-text">{message.text}</div>
              </div>
            ))}
          </div>
        </div>

        <form className="chat-input-area" onSubmit={handleSubmit}>
          <textarea
            className="chat-input"
            value={newMessageText}
            onChange={(event) => setNewMessageText(event.target.value)}
            placeholder="Введите сообщение..."
          />
          <button
            type="submit"
            className="chat-send-button"
            disabled={isSending || !newMessageText.trim()}
          >
            {isSending ? 'Отправка...' : 'Отправить'}
          </button>
        </form>
      </div>
    </div>
  );
};
