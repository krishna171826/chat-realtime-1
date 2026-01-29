import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // 1. On crée d'abord l'application (important !)
  const app = await NestFactory.create(AppModule);

  // 2. On active le CORS juste après la création
  app.enableCors({
    origin: '*', // Accepte les connexions de n'importe quelle URLnpx localtunnel --port 3000
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
// Dans main.ts
await app.listen(5000, '0.0.0.0'); 
console.log("Le serveur tourne sur http://localhost:5000");
}
bootstrap();