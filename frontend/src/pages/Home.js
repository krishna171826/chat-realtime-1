import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
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
      <div style={{
        background: '#23272a',
        color: '#fff',
        borderRadius: 18,
        boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
        padding: '3rem 2.5rem',
        minWidth: 340,
        textAlign: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '2.5rem', marginBottom: 18, letterSpacing: 1, textShadow: '0 2px 8px rgba(0,0,0,0.18)' }}>Bienvenue sur le Chat 🚀</h1>
        <p style={{ color: '#b9bbbe', marginBottom: 32, fontSize: 18 }}>Messagerie instantanée moderne et rapide.</p>
        <Link to="/chat" style={{
          display: 'inline-block',
          background: '#5865f2',
          color: '#fff',
          borderRadius: 8,
          padding: '0.95rem 2.2rem',
          fontWeight: 700,
          fontSize: 18,
          textDecoration: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
          transition: 'background 0.2s'
        }}>Démarrer une discussion</Link>
      </div>
    </div>
  );
}
export default Home;