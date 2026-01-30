import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;
  let username = '';
  if (isLoggedIn) {
    try {
      const payload = token.split('.')[1];
      username = JSON.parse(atob(payload)).username;
    } catch {
      username = '';
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar" style={{
      background: 'linear-gradient(90deg, #232526 0%, #414345 100%)',
      color: '#fff',
      padding: '13px 38px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
      borderRadius: 0,
      marginBottom: 0,
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      zIndex: 1000
    }}>
      <div style={{
        width: '100%',
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px'
      }}>
        <div className="nav-logo" style={{ fontWeight: 900, fontSize: '1.35rem', letterSpacing: 1, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.10)' }}>💬 Discutez en direct</div>
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link to="/" style={{
          color: '#fff',
          textDecoration: 'none',
          padding: '7px 18px',
          borderRadius: 7,
          fontWeight: 600,
          transition: 'background 0.2s',
          marginLeft: 0,
          background: 'transparent'
        }}>Accueil</Link>
        <Link to="/chat" style={{
          color: '#fff',
          textDecoration: 'none',
          padding: '7px 18px',
          borderRadius: 7,
          fontWeight: 600,
          transition: 'background 0.2s',
          background: 'transparent'
        }}>Chat</Link>
        {!isLoggedIn && <Link to="/register" style={{
          color: '#fff',
          textDecoration: 'none',
          padding: '7px 18px',
          borderRadius: 7,
          fontWeight: 600,
          transition: 'background 0.2s',
          background: 'transparent'
        }}>Inscription</Link>}
        {!isLoggedIn && <Link to="/login" style={{
          color: '#fff',
          textDecoration: 'none',
          padding: '7px 18px',
          borderRadius: 7,
          fontWeight: 600,
          transition: 'background 0.2s',
          background: 'transparent'
        }}>Connexion</Link>}
        {isLoggedIn && <span style={{marginLeft: '1.2rem', color: '#fff', fontWeight: 700, fontSize: 16, letterSpacing: 0.5, background: 'rgba(255,255,255,0.08)', borderRadius: 7, padding: '7px 14px'}}>{username}</span>}
        {isLoggedIn && <button onClick={handleLogout} style={{marginLeft: '1.2rem', background: '#5865f2', color: '#fff', border: 'none', borderRadius: 7, padding: '7px 18px', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.10)', transition: 'background 0.2s'}}>Déconnexion</button>}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;