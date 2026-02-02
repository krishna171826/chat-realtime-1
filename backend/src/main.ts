import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 1. CORS complet pour éviter les erreurs de navigateur
  app.enableCors({
    origin: true, // "true" reflète automatiquement l'origine de la requête (très efficace)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const port = process.env.PORT || 5000;

  // 2. On retire '0.0.0.0' pour laisser NestJS utiliser 'localhost' par défaut
  // C'est ce que le tunnel Cloudflare attend.
  await app.listen(port); 
  
  console.log(`🚀 Serveur lancé sur : http://localhost:${port}`);
}
bootstrap();