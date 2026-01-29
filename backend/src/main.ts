import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // 1. On crée d'abord l'application (important !)
  const app = await NestFactory.create(AppModule);

  // 2. On active le CORS juste après la création
  app.enableCors({
    origin: '*', // Accepte les connexions de n'importe quelle URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  // 3. On lance le serveur sur toutes les interfaces réseau
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();