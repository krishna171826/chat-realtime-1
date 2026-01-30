import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    // Ici, on remplace l'adresse '127.0.0.1' par la variable Render
    MongooseModule.forRoot("mongodb+srv://ziadsio:11@cluster0.am4wzyi.mongodb.net/?appName=Cluster0"),
    ChatModule,
  ],
})
export class AppModule {}