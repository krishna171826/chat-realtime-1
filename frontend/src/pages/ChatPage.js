import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import '../styles/ChatPage.css';

let socket;

function ChatPage() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [userName, setUserName] = useState('');
  const [typingUser, setTypingUser] = useState(null); // Pour l'indicateur d'écriture
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    // Extraction sécurisée du nom d'utilisateur depuis le JWT
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      setUserName(decoded.username);
    } catch (e) {
      setUserName('Utilisateur');
    }

    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://46.224.42.239:5000';
    
    if (!socket) {
      socket = io(backendUrl, { 
        transports: ['websocket'],
        extraHeaders: {
          "ngrok-skip-browser-warning": "true"
        }
      });
    }

    // Écoute des événements Socket
    socket.on('message_history', (history) => setChat(history));
    socket.on('msg_to_client', (payload) => {
      setChat(prev => [...prev, payload]);
      setTypingUser(null); // Arrêter l'indicateur quand un message arrive
    });

    // Écoute de l'indicateur d'écriture
    socket.on('typing_to_client', (data) => {
      if (data.isTyping && data.user !== userName) {
        setTypingUser(data.user);
      } else {
        setTypingUser(null);
      }
    });

    return () => { 
      socket.off('message_history'); 
      socket.off('msg_to_client');
      socket.off('typing_to_client');
    };
  }, [navigate, userName]);

  // Scroll automatique vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, typingUser]);

  // Gérer la saisie et l'événement "typing"
  const handleInputChange = (e) => {
    setMessage(e.target.value);

    if (socket) {
      // Envoyer l'événement "commence à écrire"
      socket.emit('typing_start', { user: userName });

      // Arrêter l'indicateur après 2 secondes d'inactivité
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing_stop', { user: userName });
      }, 2000);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && socket) {
      socket.emit('msg_to_server', { user: userName, text: message });
      socket.emit('typing_stop', { user: userName }); // Stop typing à l'envoi
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
                  <div className="user-avatar my-avatar">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            );
          })}
          
          {/* Indicateur visuel d'écriture */}
          {typingUser && (
            <div className="typing-indicator">
              <div className="dots">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
              <small>{typingUser} est en train d'écrire...</small>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} className="chat-footer-form">
          <input 
            value={message} 
            onChange={handleInputChange} 
            placeholder="Écrivez un message ici..." 
          />
          <button type="submit" className="send-icon-btn">➤</button>
        </form>
      </div>
    </div>
  );
}

export default ChatPage;