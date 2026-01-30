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
    // Vérifier l'authentification
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    // Décoder le username du token (optionnel, sinon requête API)
    const payload = token.split('.')[1];
    try {
      const decoded = JSON.parse(atob(payload));
      setUserName(decoded.username);
    } catch {
      setUserName('Utilisateur');
    }
    // Connexion socket
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    if (!backendUrl) return;
    if (!socket) {
      socket = io(backendUrl, { 
        transports: ['websocket'],
        upgrade: false,
        extraHeaders: {
          "ngrok-skip-browser-warning": "true",
          "bypass-tunnel-reminder": "true"
        }
      });
    }
    socket.on('connect', () => {
      // ...
    });
    socket.on('connect_error', (err) => {
      // ...
    });
    socket.on('message_history', (history) => {
      setChat(history);
    });
    socket.on('msg_to_client', (payload) => {
      setChat(prev => [...prev, payload]);
    });
    return () => { 
      socket.off('message_history'); 
      socket.off('msg_to_client');
      socket.off('connect');
      socket.off('connect_error');
    };
  }, [navigate]);

  // Scroll automatique
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && socket) {
      socket.emit('msg_to_server', { user: userName, text: message });
      setMessage('');
    }
  };

  // --- RENDU UI ---
  return (
    <div className="chat-app" style={{
      minHeight: '100vh',
      width: '100vw',
      background: `url('/chat-bg.jpg') center center / cover no-repeat fixed`,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 0,
      overflow: 'hidden'
    }}>
      {/* Overlay sombre pour lisibilité */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(30,32,34,0.82)',
        zIndex: 0
      }} />
      <div style={{ width: '100%', maxWidth: 900, margin: '30px auto 0 auto', borderRadius: 18, boxShadow: '0 4px 24px rgba(0,0,0,0.25)', background: '#23272a', display: 'flex', flexDirection: 'column', minHeight: 600, position: 'relative', zIndex: 1 }}>
        <header className="chat-header" style={{
          background: 'linear-gradient(90deg, #232526 0%, #414345 100%)',
          color: '#fff',
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          padding: '18px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 18,
          fontWeight: 600,
          letterSpacing: 0.5,
          borderBottom: '1px solid #333'
        }}>
          <span>Utilisateur : <span style={{ fontWeight: 800 }}>{userName}</span></span>
          <button onClick={handleLogout} style={{ fontSize: 13, cursor: 'pointer', background: '#23272a', color: '#fff', border: '1px solid #444', borderRadius: 7, padding: '7px 18px', fontWeight: 700, boxShadow: '0 2px 8px rgba(0,0,0,0.10)', transition: 'background 0.2s' }}>Déconnexion</button>
        </header>
        <div className="chat-box" style={{ flex: 1, padding: '32px 22px 22px 22px', background: '#2c2f33', borderBottomLeftRadius: 18, borderBottomRightRadius: 18, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {chat.map((m, i) => {
            const isMine = m.user === userName;
            const avatar = m.user ? m.user.charAt(0).toUpperCase() : '?';
            let time = '';
            if (m.createdAt) {
              const d = new Date(m.createdAt);
              time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }
            return (
              <div key={i} className={`msg ${isMine ? 'my-msg' : 'other-msg'}`} style={{ marginBottom: 2 }}>
                {!isMine && <div className="msg-avatar" style={{ background: '#5865f2', color: '#fff', fontWeight: 700, fontSize: 18 }}>{avatar}</div>}
                <div>
                  <div className="msg-info" style={{ color: '#b9bbbe', fontWeight: 600, marginBottom: 2, marginLeft: 4 }}>
                    <b>{m.user}</b>
                    {time && <span style={{ marginLeft: 8, color: '#888', fontWeight: 400 }}>{time}</span>}
                  </div>
                  <div className="msg-bubble" style={{
                    background: isMine ? '#5865f2' : '#36393f',
                    color: '#fff',
                    borderRadius: 18,
                    borderBottomRightRadius: isMine ? 5 : 18,
                    borderBottomLeftRadius: !isMine ? 5 : 18,
                    padding: '13px 20px',
                    fontSize: 16,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                    marginTop: 2,
                    minWidth: 60,
                    maxWidth: 400
                  }}>{m.text}</div>
                </div>
                {isMine && <div className="msg-avatar" style={{ background: '#5865f2', color: '#fff', fontWeight: 700, fontSize: 18 }}>{avatar}</div>}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={sendMessage} className="chat-input-area" style={{
          background: '#23272a',
          borderBottomLeftRadius: 18,
          borderBottomRightRadius: 18,
          padding: '18px 22px',
          display: 'flex',
          gap: 10,
          position: 'sticky',
          bottom: 0,
          zIndex: 2,
          borderTop: '1px solid #333'
        }}>
          <input 
            value={message} 
            onChange={e => setMessage(e.target.value)} 
            placeholder="Ecrivez ici..." 
            style={{
              flex: 1,
              padding: '13px',
              borderRadius: 25,
              border: '1px solid #444',
              fontSize: 16,
              background: '#36393f',
              color: '#fff'
            }}
          />
          <button type="submit" className="send-btn" style={{
            background: '#5865f2',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: 45,
            height: 45,
            cursor: 'pointer',
            fontSize: 22,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s'
          }}>➤</button>
        </form>
      </div>
    </div>
  );
}

export default ChatPage;