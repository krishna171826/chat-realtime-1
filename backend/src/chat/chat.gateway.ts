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
    origin: '*', 
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
    console.log('📩 Message reçu : envoi instantané (sans Worker)');

    // 1. PLUS DE WORKER THREAD : On utilise directement le texte reçu
    const textToSave = data.text;

    // 2. SAUVEGARDE EN BASE
    const savedMessage = await this.chatService.createMessage(
      data.user,
      textToSave,
    );

    // 3. ENVOI À TOUT LE MONDE (Instantané)
    this.server.emit('msg_to_client', {
      _id: savedMessage._id,
      user: savedMessage.user,
      text: savedMessage.text,
      createdAt: savedMessage.createdAt,
    });
    
    console.log('✅ Message diffusé immédiatement');
  }

  // À ajouter dans ChatGateway

@SubscribeMessage('typing_start')
handleTypingStart(@MessageBody() data: { user: string }, @ConnectedSocket() client: any) {
  // On renvoie l'info à tout le monde sauf à celui qui écrit
  client.broadcast.emit('typing_to_client', { user: data.user, isTyping: true });
}

@SubscribeMessage('typing_stop')
handleTypingStop(@MessageBody() data: { user: string }, @ConnectedSocket() client: any) {
  client.broadcast.emit('typing_to_client', { user: data.user, isTyping: false });
}

}

