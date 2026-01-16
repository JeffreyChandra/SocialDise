// src/app.service.ts
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);

  constructor(@InjectConnection() private readonly connection: Connection) {}

  async onModuleInit() {
    console.log('menjalankan onModuleInit di AppService');
    this.logger.log('Menjalankan pengujian koneksi dan pembuatan tabel Aiven...');
    try {
      // Perintah SQL mentah untuk membuat tabel uji jika belum ada
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS user (
          id SERIAL PRIMARY KEY,
          test_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;
      
      // Jalankan kueri pembuatan tabel
      await this.connection.query(createTableQuery);
      
      // Jalankan kueri penyisipan data
      await this.connection.query("INSERT INTO user DEFAULT VALUES;");
      
      // Ambil dan hitung baris
      const countResult = await this.connection.query("SELECT COUNT(*) FROM user;");
      console.log("AAAAAAAAAA")
      this.logger.log(`✅ Koneksi PostgreSQL Aiven BERHASIL!`);
      this.logger.log(`Tabel 'user' berhasil dibuat/dimodifikasi.`);
      this.logger.log(`Jumlah baris di tabel uji: ${countResult[0].count}`);

    } catch (error) {
      this.logger.error('❌ Koneksi PostgreSQL Aiven GAGAL atau GAGAL Membuat Tabel!', error.stack);
    }

  }
  getHello(): string {
    return 'Hello World!';
  }

  // ...
}