import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  // Quand un client se connecte
  async handleConnection(client: Socket) {
    console.log(`Client connecté : ${client.id}`);

    // Envoyer l'historique des messages au nouveau client
    const messages = await this.chatService.getAllMessages();
    client.emit('message_history', messages);
  }

  // Quand un client se déconnecte
  handleDisconnect(client: Socket) {
    console.log(`Client déconnecté : ${client.id}`);
  }

  // Recevoir un message du client
  @SubscribeMessage('msg_to_server')
  async handleMessage(@MessageBody() data: { user: string; text: string }) {
    console.log('Message reçu:', data);

    // Sauvegarder dans MongoDB
    const savedMessage = await this.chatService.createMessage(
      data.user,
      data.text,
    );

    // Envoyer à TOUS les clients connectés (broadcast)
    this.server.emit('msg_to_client', {
      _id: savedMessage._id,
      user: savedMessage.user,
      text: savedMessage.text,
      createdAt: savedMessage.createdAt,
    });
  }
}
