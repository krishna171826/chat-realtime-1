const { io } = require("socket.io-client");

// --- CONFIGURATION ---
const SERVER_URL = "http://localhost:3000"; 
const CLIENTS_COUNT = 500;    
const MSGS_PER_CLIENT = 200; 

const TOTAL_MESSAGES = CLIENTS_COUNT * MSGS_PER_CLIENT;

console.log(`
=============================================
🚀 INITIALISATION DU BENCHMARK
=============================================
🎯 Objectif : ${TOTAL_MESSAGES} messages
👥 Clients  : ${CLIENTS_COUNT}
📨 Envois   : ${MSGS_PER_CLIENT} / client
=============================================
Connexion des clients en cours...
`);

let connectedClients = 0;
let messagesReceived = 0;
let startTime;
const sockets = [];

// Fonction lancée quand tout le monde est prêt
function startBenchmark() {
  console.log("⚡ Tous les clients sont connectés. TIR GROUPÉ ! 🔥");
  startTime = Date.now();

  sockets.forEach((socket, index) => {
    // Envoi en rafale
    for (let i = 0; i < MSGS_PER_CLIENT; i++) {
      socket.emit("msg_to_server", {
        user: `Bot-${index}`,
        text: `BenchMessage-${i}`,
      });
    }
  });
}

// Fonction de vérification de fin
function checkFinished() {
  if (messagesReceived === TOTAL_MESSAGES) {
    const durationMs = Date.now() - startTime;
    const durationSec = durationMs / 1000;
    const throughput = Math.round(TOTAL_MESSAGES / durationSec);

    console.log(`
=============================================
✅ TERMINÉ ! RÉSULTATS :
=============================================
⏱️  Temps écoulé      : ${durationSec} secondes
🚀  VITESSE (DÉBIT)   : ${throughput} messages/seconde
=============================================
    `);

    // Fermeture propre
    sockets.forEach((s) => s.close());
    process.exit(0);
  }
}

// Boucle de création des clients
for (let i = 0; i < CLIENTS_COUNT; i++) {
  // transports: ['websocket'] est CRUCIAL pour la vitesse
  const socket = io(SERVER_URL, {
    transports: ["websocket"],
    forceNew: true,
  });

  socket.on("connect", () => {
    connectedClients++;
    // Barre de chargement des connexions
    if (connectedClients % 10 === 0) {
      process.stdout.write(`Clients connectés: ${connectedClients}/${CLIENTS_COUNT}\r`);
    }
    
    // Si tout le monde est là, on lance l'attaque
    if (connectedClients === CLIENTS_COUNT) {
      console.log("\n"); // Saut de ligne
      startBenchmark();
    }
  });

  socket.on("msg_to_client", () => {
    messagesReceived++;
    
    // Affichage progression tous les 1000 messages reçus pour ne pas spammer la console
    if (messagesReceived % 1000 === 0) {
      const percent = Math.round((messagesReceived / TOTAL_MESSAGES) * 100);
      process.stdout.write(`\r🔄 Progression : ${percent}% (${messagesReceived}/${TOTAL_MESSAGES})`);
    }
    
    checkFinished();
  });

  sockets.push(socket);
}