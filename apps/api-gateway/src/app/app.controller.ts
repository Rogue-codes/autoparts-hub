import { Controller, Get } from '@nestjs/common';

@Controller('api-gateway')
export class AppController {
  constructor() {}

  @Get('')
  async get() {
    return "Welcome to ladipo market!!!"
  }
}
