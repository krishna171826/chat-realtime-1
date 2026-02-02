import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // Import de la barre
import Home from './pages/Home';
import ChatPage from './pages/ChatPage';
import Register from './pages/Register';
import Login from './pages/Login';
import GitResources from './components/GitResources';

function App() {
  return (
    <Router>
      <Navbar /> {/* Elle est placée ici pour être visible partout */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/git" element={<GitResources />} />
      </Routes>
    </Router>
  );
}


export default App;