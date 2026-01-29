// src/chat/chat.worker.js
const { parentPort, workerData } = require('worker_threads');

function heavyTask(data) {
    const start = Date.now();
    // ON PASSE À 10 SECONDES (10000 ms)
    while (Date.now() - start < 10000) { } 
    return data.toUpperCase() + " (TRAITÉ PAR WORKER)";
}

const result = heavyTask(workerData);
parentPort.postMessage(result);