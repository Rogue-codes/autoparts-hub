import { Module } from '@nestjs/common';
import { WorkshopController } from './workshop.controller';
import { MICROSERVICES_CLIENTS } from '../../../../utils';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MICROSERVICES_CLIENTS.WORKSHOP_SERVICE,
        transport: Transport.TCP,
        options: {
          port: 4000,
        },
      },
      {
        name: MICROSERVICES_CLIENTS.AUTH_SERVICE,
        transport: Transport.TCP,
        options: {
          port: 4001,
        },
      },
    ]),
  ],
  controllers: [WorkshopController,AuthController],
})
export class AppModule {}
