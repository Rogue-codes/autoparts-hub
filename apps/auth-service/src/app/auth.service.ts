import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RpcException } from '@nestjs/microservices';
import { Workshop } from '../../../workshop-service/src/entity/workshop.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Workshop.name)
    private workshopModel: Model<Workshop>,
    private jwtService: JwtService
  ) {}

  async login(credentials: LoginDto): Promise<{ access_token: string; user: any }> {
    const { identifier, password: password__ } = credentials;

    const workshop = await this.workshopModel
      .findOne({
        $or: [{ contact_email: identifier }, { contact_phone: identifier }],
      })
      .select('+password')
      .lean();

    if (!workshop) {
      throw new RpcException({
        status: 401,
        message: 'Invalid credentials',
        error: 'Unauthorized',
      });
    }

    const isPasswordMatch = await bcrypt.compare(password__, workshop.password);
    if (!isPasswordMatch) {
      throw new RpcException({
        status: 401,
        message: 'Invalid credentials',
      });
    }

    if (!workshop.is_verified || !workshop.is_active) {
      throw new RpcException({
        status: 403,
        message: 'Account not verified or inactive',
      });
    }

    const payload = {
      sub: workshop._id,
      contact_phone: workshop.contact_phone,
    };
    const accessToken = await this.jwtService.signAsync(payload);

    const { password, ...safeWorkshop } = workshop;

    return {
      access_token: accessToken,
      user: safeWorkshop,
    };
  }
}
