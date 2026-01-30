import { parentPort, threadId } from 'worker_threads';

parentPort?.on('message', (task: { user: string; text: string }) => {
  const processedText = task.text;
  parentPort?.postMessage({
    user: task.user,
    text: processedText,
    workerId: threadId, // <--- L'info importante pour tes logs
  });
});
