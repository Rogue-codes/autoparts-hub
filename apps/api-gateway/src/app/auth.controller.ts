import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from '../../../../apps/auth-service/src/dto/auth.dto';
import { ClientProxy } from '@nestjs/microservices';
import { MICROSERVICES_CLIENTS } from '../../../../utils/index';
import { Inject } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(MICROSERVICES_CLIENTS.AUTH_SERVICE)
    private readonly workshopClient: ClientProxy
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const result = await lastValueFrom(
        this.workshopClient.send('login', loginDto)
      );

      return {
        success: true,
        message: 'login successful',
        data: result.user,
        access_token: result.access_token,
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
