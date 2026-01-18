// src/main.ts (Versi yang Diperbarui)

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Tambahkan Konfigurasi CORS
  app.enableCors({
    // Ganti dengan port lokal frontend Anda yang sebenarnya!
    origin: [
      'http://localhost:3001', // Ganti 3001 ke port lokal Anda yang benar
      'straightforward-jane-socialdise-726976fd.koyeb.app/'
    ],
    //Testing
    // Atau, untuk mengizinkan SEMUA origin (HANYA UNTUK DEVELOPMENT LOKAL!):
    // origin: '*', 
    
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Penting jika Anda menggunakan cookies/session/authorization headers
  }); 
  //Hanya testing
  // Mengaktifkan ValidationPipe
  app.useGlobalPipes(new ValidationPipe({ 
    transform: true, 
    whitelist: true,
     
  })); 
  
  // Jika Anda memiliki prefix global, aktifkan di sini:
  // app.setGlobalPrefix('api/v1'); 
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is listening on port ${port}`);
}
bootstrap();
