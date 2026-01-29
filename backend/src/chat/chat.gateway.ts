import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { WorkerPoolService } from './worker-pool.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly workerPool: WorkerPoolService,
  ) {}

  async handleConnection(client: Socket) {
    console.log(`✅ Client connecté : ${client.id}`);
    try {
      const messages = await this.chatService.getAllMessages();
      client.emit('message_history', messages);
    } catch (error) {
      console.error('Erreur historique:', error);
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`❌ Client déconnecté : ${client.id}`);
  }

  @SubscribeMessage('msg_to_server')
  async handleMessage(@MessageBody() data: { user: string; text: string }) {
    console.log('📩 Message brut reçu:', data);

    try {
      // 1. Traitement via Worker Threads
      const processedData = await this.workerPool.processTask({
        user: data.user,
        text: data.text,
      });

      // 2. Log pour vérifier le multithreading
      console.log(
        `⚙️  Message traité par le Worker #${processedData.workerId} :`,
        processedData,
      );

      // 3. Sauvegarde en BDD
      const savedMessage = await this.chatService.createMessage(
        processedData.user,
        processedData.text,
      );

      // 4. Envoi à tout le monde
      this.server.emit('msg_to_client', {
        _id: savedMessage._id,
        user: savedMessage.user,
        text: savedMessage.text,
        createdAt: savedMessage.createdAt,
      });
    } catch (error) {
      console.error('Erreur traitement worker:', error);
    }
  }
}
