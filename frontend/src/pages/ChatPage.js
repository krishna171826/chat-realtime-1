import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import '../styles/ChatPage.css';

let socket;

function ChatPage() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [userName, setUserName] = useState('');
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    // Extraction du nom d'utilisateur depuis le token
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      setUserName(decoded.username);
    } catch (e) {
      setUserName('Utilisateur');
    }

    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
    if (!socket) {
      socket = io(backendUrl, { 
        transports: ['websocket'],
        extraHeaders: {
          "ngrok-skip-browser-warning": "true"
        }
      });
    }

    socket.on('message_history', (history) => setChat(history));
    socket.on('msg_to_client', (payload) => setChat(prev => [...prev, payload]));

    return () => { 
      socket.off('message_history'); 
      socket.off('msg_to_client');
    };
  }, [navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && socket) {
      socket.emit('msg_to_server', { user: userName, text: message });
      setMessage('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="chat-page-wrapper">
      <div className="chat-overlay" />
      <div className="chat-main-container">
        <header className="chat-header-custom">
          <div className="user-info">
            <div className="online-indicator" />
            <span>Connecté : <strong>{userName}</strong></span>
          </div>
          <button onClick={handleLogout} className="logout-button">Déconnexion</button>
        </header>

        <div className="chat-messages-area">
          {chat.map((m, i) => {
            const isMine = m.user === userName;
            return (
              <div key={i} className={`msg-group ${isMine ? 'mine' : 'theirs'}`}>
                {!isMine && (
                  <div className="user-avatar">
                    {m.user ? m.user.charAt(0).toUpperCase() : '?'}
                  </div>
                )}
                <div className="msg-details">
                  {!isMine && <span className="msg-author">{m.user}</span>}
                  <div className="bubble">{m.text}</div>
                </div>
                {isMine && (
                  <div className="user-avatar" style={{ backgroundColor: '#43b581' }}>
                    {userName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} className="chat-footer-form">
          <input 
            value={message} 
            onChange={e => setMessage(e.target.value)} 
            placeholder="Écrivez un message ici..." 
          />
          <button type="submit" className="send-icon-btn">➤</button>
        </form>
      </div>
    </div>
  );
}

export default ChatPage;