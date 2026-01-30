import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Worker } from 'worker_threads';
import * as path from 'path';

interface Task {
  user: string;
  text: string;
}

interface WorkerResult {
  user: string;
  text: string;
  workerId: number;
}

@Injectable()
export class WorkerPoolService implements OnModuleDestroy {
  private workers: Worker[] = [];
  private idleWorkers: Worker[] = [];
  private queue: { task: Task; resolve: (res: WorkerResult) => void }[] = [];
  private taskMap = new Map<Worker, (res: WorkerResult) => void>();

  constructor() {
    const poolSize = 5;

    const workerPath = path.resolve(__dirname, './worker.js');

    for (let i = 0; i < poolSize; i++) {
      const worker = new Worker(workerPath);

      worker.on('message', (result: WorkerResult) => {
        // 1. Le worker a fini, on le remet dans la liste des dispos
        this.idleWorkers.push(worker);

        // 2. On répond à la promesse en attente
        const resolve = this.taskMap.get(worker);
        if (resolve) {
          resolve(result);
          this.taskMap.delete(worker);
        }

        // 3. S'il y a du monde dans la file d'attente, on enchaîne
        if (this.queue.length > 0) {
          const next = this.queue.shift()!;
          this.runWorker(next.task, next.resolve);
        }
      });

      this.idleWorkers.push(worker);
      this.workers.push(worker);
    }
  }

  private runWorker(task: Task, resolve: (res: WorkerResult) => void) {
    const worker = this.idleWorkers.shift();
    if (worker) {
      this.taskMap.set(worker, resolve);
      worker.postMessage(task);
    } else {
      this.queue.push({ task, resolve });
    }
  }

  // C'est cette fonction que le Gateway appelle
  public async processTask(task: Task): Promise<WorkerResult> {
    return new Promise((resolve) => {
      this.runWorker(task, resolve);
    });
  }

  onModuleDestroy() {
    this.workers.forEach((w) => w.terminate());
  }
}
