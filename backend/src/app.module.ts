import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    // Correction de la faute de frappe ici
    MongooseModule.forRoot(process.env.MONGODB_URI!),
    ChatModule,
  ],
})
export class AppModule {}