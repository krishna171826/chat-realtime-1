import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*', // CHANGÉ : Autorise Ngrok et ton iPhone
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  async handleConnection(client: Socket) {
    console.log(`✅ Client connecté : ${client.id}`);
    try {
      const messages = await this.chatService.getAllMessages();
      client.emit('message_history', messages);
    } catch (error) {
      console.error("Erreur historique:", error);
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`❌ Client déconnecté : ${client.id}`);
  }

  @SubscribeMessage('msg_to_server')
  async handleMessage(
    @MessageBody() data: { user: string; text: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('📩 Message reçu, envoi au Worker Thread...');

    // 1. APPEL AU WORKER THREAD
    // Le serveur ne "bloque" pas ici, il attend que l'assistant finisse
    const processedText = await this.chatService.processWithWorker(data.text);

    // 2. SAUVEGARDE EN BASE (avec le texte modifié par le worker)
    const savedMessage = await this.chatService.createMessage(
      data.user,
      processedText,
    );

    // 3. ENVOI À TOUT LE MONDE
    this.server.emit('msg_to_client', {
      _id: savedMessage._id,
      user: savedMessage.user,
      text: savedMessage.text,
      createdAt: savedMessage.createdAt,
    });
    
    console.log('✅ Message traité et diffusé');
  }
}