import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import '../styles/ChatPage.css';

// Il va chercher la variable Vercel, et si elle n'existe pas, il prend localhost par défaut
const socket = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000', { 
  transports: ['websocket'] 
});

function ChatPage() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [userName, setUserName] = useState('');
  const [isLogged, setIsLogged] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on('message_history', (history) => setChat(history));
    socket.on('msg_to_client', (payload) => setChat(prev => [...prev, payload]));
    return () => { socket.off('message_history'); socket.off('msg_to_client'); };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('msg_to_server', { user: userName, text: message });
      setMessage('');
    }
  };

  if (!isLogged) {
    return (
      <div className="home-container">
        <form onSubmit={(e) => { e.preventDefault(); if(userName) setIsLogged(true); }}>
          <input 
            style={{padding: '10px', borderRadius: '5px', border: '1px solid #ccc'}}
            placeholder="Ton pseudo..." 
            onChange={e => setUserName(e.target.value)} 
          />
          <button className="start-button" style={{marginLeft: '10px', border: 'none', cursor: 'pointer'}}>Entrer</button>
        </form>
      </div>
    );
  }

  return (
    <div className="chat-app">
      <header className="chat-header">
        <span>Salon de discussion</span>
        <strong>{userName}</strong>
      </header>
      <div className="chat-box">
        {chat.map((m, i) => (
          <div key={i} className={`msg ${m.user === userName ? 'my-msg' : 'other-msg'}`}>
            <small><b>{m.user}</b></small><br/>{m.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="chat-input-area">
        <input value={message} onChange={e => setMessage(e.target.value)} placeholder="Ecrivez ici..." />
        <button type="submit" className="send-btn">➤</button>
      </form>
    </div>
  );
}
export default ChatPage;