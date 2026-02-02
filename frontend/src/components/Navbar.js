import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;
  
  let username = '';
  if (isLoggedIn) {
    try {
      const payload = token.split('.')[1];
      username = JSON.parse(atob(payload)).username;
    } catch {
      username = 'Utilisateur';
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="glass-navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">💬</span>
          <span className="logo-text">LiveChat</span>
        </Link>

        <div className="nav-menu">
          <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
            Accueil
          </Link>
          <Link to="/chat" className={`nav-item ${location.pathname === '/chat' ? 'active' : ''}`}>
            Chat
          </Link>
          
          <div className="nav-separator"></div>

          {!isLoggedIn ? (
            <>
              <Link to="/login" className="nav-link">Connexion</Link>
              <Link to="/register" className="nav-btn-primary">Inscription</Link>
            </>
          ) : (
            <div className="user-section">
              <div className="user-pill">
                <div className="user-avatar-sm">
                  {username.charAt(0).toUpperCase()}
                </div>
                <span className="username-display">{username}</span>
              </div>
              <button onClick={handleLogout} className="logout-icon-btn" title="Déconnexion">
                ✕
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;