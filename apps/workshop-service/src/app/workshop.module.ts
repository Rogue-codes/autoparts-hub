import { Module } from '@nestjs/common';
import { WorkshopController } from './workshop.controller';
import { WorkshopService } from './workshop.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Workshop, WorkshopSchema } from '../entity/workshop.entity';
import { Otp, OtpSchema } from '../entity/otp.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI as string),
    MongooseModule.forFeature([
      { name: Workshop.name, schema: WorkshopSchema },
      { name: Otp.name, schema: OtpSchema },
    ]),
  ],
  controllers: [WorkshopController],
  providers: [WorkshopService],
})
export class AppModule {}
