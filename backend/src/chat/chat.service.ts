import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './schemas/message.schema';

import { Worker } from 'worker_threads';
import { join } from 'path'; // <--- Ajoute cet import pour trouver le fichier

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  // --- LA NOUVELLE MÉTHODE POUR LE WORKER ---
  async processWithWorker(text: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // On pointe vers le fichier JS qui sera dans le dossier dist après compilation
      const worker = new Worker(join(__dirname, 'chat.worker.js'), {
        workerData: text,
      });

      worker.on('message', (result) => {
        resolve(result);
      });

      worker.on('error', (err) => {
        console.error("Erreur Worker:", err);
        reject(err);
      });

      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker arrêté avec le code : ${code}`));
        }
      });
    });
  }

  // --- TES MÉTHODES EXISTANTES ---
  async createMessage(user: string, text: string): Promise<Message> {
    const newMessage = new this.messageModel({ user, text });
    return await newMessage.save();
  }

  async getAllMessages(): Promise<Message[]> {
    return await this.messageModel.find().sort({ createdAt: 1 }).exec();
  }
}