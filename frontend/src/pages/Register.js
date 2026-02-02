import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://46.224.42.239:5000';

    try {
      const res = await fetch(`${BACKEND_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erreur lors de l\'inscription');
      }

      // Si l'inscription réussit, on redirige vers la page de login
      navigate('/login');
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
      {/* Overlay sombre pour la lisibilité */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(30,32,34,0.82)',
        zIndex: 0
      }} />

      <div className="register-container" style={{ 
        boxShadow: '0 4px 24px rgba(0,0,0,0.25)', 
        borderRadius: 16, 
        background: '#23272a', 
        color: '#fff', 
        padding: '2.5rem 2rem', 
        minWidth: 340, 
        position: 'relative', 
        zIndex: 1 
      }}>
        <h2 style={{ 
          color: '#fff', 
          marginBottom: 24, 
          fontWeight: 700, 
          letterSpacing: 1, 
          textShadow: '0 2px 8px rgba(0,0,0,0.18)' 
        }}>Inscription</h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <input 
            type="text" 
            placeholder="Nom d'utilisateur" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            required 
            style={{ borderRadius: 8, border: '1px solid #444', padding: '0.9rem', fontSize: 16, background: '#36393f', color: '#fff' }} 
          />
          <input 
            type="password" 
            placeholder="Mot de passe" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            style={{ borderRadius: 8, border: '1px solid #444', padding: '0.9rem', fontSize: 16, background: '#36393f', color: '#fff' }} 
          />
          <button 
            type="submit" 
            style={{ 
              background: '#5865f2', 
              color: '#fff', 
              border: 'none', 
              borderRadius: 8, 
              padding: '0.9rem', 
              fontWeight: 700, 
              fontSize: 17, 
              marginTop: 8, 
              boxShadow: '0 2px 8px rgba(0,0,0,0.10)', 
              cursor: 'pointer' 
            }}
          >
            S'inscrire
          </button>
        </form>

        {error && (
          <div className="error" style={{ color: '#ff4d4d', marginTop: 18, textAlign: 'center', fontWeight: 500 }}>
            {error}
          </div>
        )}

        <div style={{ marginTop: 20, textAlign: 'center', fontSize: 14 }}>
          <span style={{ color: '#b9bbbe' }}>Déjà un compte ? </span>
          <button 
            onClick={() => navigate('/login')} 
            style={{ background: 'none', border: 'none', color: '#00a8fc', cursor: 'pointer', padding: 0 }}
          >
            Se connecter
          </button>
        </div>
      </div>
    </div>
  );
}