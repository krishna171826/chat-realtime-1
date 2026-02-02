import React, { useState } from 'react';
import '../styles/GitResources.css';

const GitResources = () => {
  const [copyStatus, setCopyStatus] = useState('');

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(label);
    setTimeout(() => setCopyStatus(''), 2000);
  };

  const copyFullSequence = () => {
    const sequence = "git add .\ngit commit -m 'Mise à jour'\ngit push origin main";
    copyToClipboard(sequence, 'Séquence complète');
  };

  const sections = [
    {
      title: "⚡ Séquence Rapide (Le Quotidien)",
      isSpecial: true,
      commands: [
        { cmd: "git add .", desc: "Préparer tous les fichiers." },
        { cmd: "git commit -m 'Message'", desc: "Enregistrer localement." },
        { cmd: "git push origin main", desc: "Envoyer sur GitHub." }
      ]
    },
    {
      title: "🌿 Branches & Navigation",
      commands: [
        { cmd: "git branch", desc: "Lister les branches." },
        { cmd: "git checkout <nom>", desc: "Changer de branche." },
        { cmd: "git checkout -b <nom>", desc: "Créer et changer de branche." }
      ]
    },
    {
      title: "🌐 Configuration & URL",
      commands: [
        { cmd: "git remote -v", desc: "Voir l'URL actuelle." },
        { cmd: "git remote set-url origin <url>", desc: "Changer l'URL du dépôt." }
      ]
    },
    {
      title: "🔄 Fusion (Merge)",
      commands: [
        { cmd: "git merge <source>", desc: "Fusionner une branche." },
        { cmd: "git merge --abort", desc: "Annuler un merge qui se passe mal." }
      ]
    }
  ];

  return (
    <div className="resources-container">
      <div className="resources-header">
        <h1>Guide de Survie <span className="text-gradient">Git</span></h1>
        <p>Cliquez sur n'importe quelle commande pour la copier.</p>
        {copyStatus && <div className="copy-toast">Copié : {copyStatus}</div>}
      </div>

      <div className="resources-grid">
        {sections.map((section, idx) => (
          <div key={idx} className={`resource-card ${section.isSpecial ? 'special-card' : ''}`}>
            <div className="card-header">
              <h3>{section.title}</h3>
              {section.isSpecial && (
                <button className="copy-all-btn" onClick={copyFullSequence}>
                  Tout copier (Add + Commit + Push)
                </button>
              )}
            </div>
            <div className="command-list">
              {section.commands.map((c, i) => (
                <div key={i} className="command-item" onClick={() => copyToClipboard(c.cmd, c.cmd)}>
                  <div className="cmd-row">
                    <code>{c.cmd}</code>
                    <span className="copy-icon">📋</span>
                  </div>
                  <p>{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GitResources;