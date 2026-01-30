import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error('Identifiants invalides');
      const data = await res.json();
      localStorage.setItem('token', data.access_token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: `url('/chat-bg.jpg') center center / cover no-repeat fixed`,
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
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
      <div className="login-container" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.25)', borderRadius: 16, background: '#23272a', color: '#fff', padding: '2.5rem 2rem', minWidth: 340, position: 'relative', zIndex: 1 }}>
        <h2 style={{ color: '#fff', marginBottom: 24, fontWeight: 700, letterSpacing: 1, textShadow: '0 2px 8px rgba(0,0,0,0.18)' }}>Connexion</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <input type="text" placeholder="Nom d'utilisateur" value={username} onChange={e => setUsername(e.target.value)} required style={{ borderRadius: 8, border: '1px solid #444', padding: '0.9rem', fontSize: 16, background: '#36393f', color: '#fff' }} />
          <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} required style={{ borderRadius: 8, border: '1px solid #444', padding: '0.9rem', fontSize: 16, background: '#36393f', color: '#fff' }} />
          <button type="submit" style={{ background: '#5865f2', color: '#fff', border: 'none', borderRadius: 8, padding: '0.9rem', fontWeight: 700, fontSize: 17, marginTop: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.10)', cursor: 'pointer', transition: 'background 0.2s' }}>Se connecter</button>
        </form>
        {error && <div className="error" style={{ color: '#d32f2f', marginTop: 18, textAlign: 'center', fontWeight: 500 }}>{error}</div>}
      </div>
    </div>
  );
}
