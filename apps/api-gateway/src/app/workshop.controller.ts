import { Body, Controller, Post } from '@nestjs/common';
import { CreateWorkshopDto } from '../../../../apps/workshop-service/src/dto/create-workshop.dto';
import { ClientProxy } from '@nestjs/microservices';
import { MICROSERVICES_CLIENTS } from '../../../../utils/index';
import { Inject } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { ValidateOtpDto } from '../../../workshop-service/src/dto/validate-otp.dto';
@Controller('workshop')
export class WorkshopController {
  constructor(
    @Inject(MICROSERVICES_CLIENTS.WORKSHOP_SERVICE)
    private readonly workshopClient: ClientProxy
  ) {}

  @Post('register')
  async register(@Body() createWorkshopDto: CreateWorkshopDto) {
    try {
      const result = await lastValueFrom(
        this.workshopClient.send('register_workshop', createWorkshopDto)
      );

      return {
        success: true,
        message: 'Workshop created successfully',
        data: result.data,
        otp: result.otp,
      };
    } catch (error: any) {
      console.log('error:===>', error);
      return {
        success: false,
        status: error.status || 500,
        message: error.message,
      };
    }
  }

  @Post('validate-otp')
  async validateOtp(@Body() validateOtpDto: ValidateOtpDto) {
    try {
      const result = await lastValueFrom(
        this.workshopClient.send('validate_otp', validateOtpDto)
      );

      return {
        success: true,
        message: 'otp validated successfully, your account is now Live!!',
        data: result.data,
      };
    } catch (error: any) {
      console.log('error:===>', error);
      return {
        success: false,
        status: error.status || 500,
        message: error.message,
      };
    }
  }
}
