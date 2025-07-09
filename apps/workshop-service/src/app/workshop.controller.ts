import { Controller } from '@nestjs/common';
import { WorkshopService } from './workshop.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateWorkshopDto } from '../dto/create-workshop.dto';

@Controller()
export class WorkshopController {
  constructor(private readonly workshopService: WorkshopService) {}

  @MessagePattern('register_workshop')
  createWorkshop(@Payload() payload: CreateWorkshopDto) {
    return this.workshopService.createWorkshop(payload);
  }

  @MessagePattern('validate_otp')
  validateOtp(
    @Payload()
    payload: {
      identifier: string;
      code: string;
      type: 'email' | 'phone';
      purpose: 'login' | 'register' | 'reset_password';
    }
  ) {
    return this.workshopService.validateOtp(
      payload.identifier,
      payload.code,
      payload.type,
      payload.purpose
    );
  }
}
