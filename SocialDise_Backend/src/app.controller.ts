import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  // Ini adalah endpoint standar. Kami hanya memanggil service, BUKAN onModuleInit.
  getHello(): string {
    return this.appService.getHello();
  }
}