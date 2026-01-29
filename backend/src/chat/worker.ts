import { parentPort, threadId } from 'worker_threads';

// Écoute les messages venant du thread principal
parentPort?.on('message', (task: { user: string; text: string }) => {
  // --- DÉBUT TRAITEMENT LOURD (SIMULATION) ---
  const processedText = task.text;

  // On simule une petite pause (50ms) pour forcer Node.js
  // à utiliser d'autres workers si plusieurs messages arrivent vite.
  const start = Date.now();
  while (Date.now() - start < 50) {}
  // --- FIN TRAITEMENT ---

  // On renvoie le résultat + l'ID du worker
  parentPort?.postMessage({
    user: task.user,
    text: processedText,
    workerId: threadId, // <--- L'info importante pour tes logs
  });
});
