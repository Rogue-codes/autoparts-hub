import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Workshop } from '../entity/workshop.entity';
import { FilterQuery, Model } from 'mongoose';
import { CreateWorkshopDto } from '../dto/create-workshop.dto';
import { Otp } from '../entity/otp.entity';
import * as bcrypt from 'bcrypt';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class WorkshopService {
  constructor(
    @InjectModel(Workshop.name) private workshopModel: Model<Workshop>,
    @InjectModel(Otp.name) private otpModel: Model<Otp>
  ) {}

  async createWorkshop(
    dto: CreateWorkshopDto
  ): Promise<{ data: Workshop; otp: string }> {
    await this.checkUniqueFields(this.workshopModel, {
      workshop_name: dto.workshop_name,
      contact_phone: dto.contact_phone,
      contact_email: dto.contact_email,
    });

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const created = new this.workshopModel({
      ...dto,
      password: hashedPassword,
    });
    const saved = await created.save();

    const otp = await this.genOtp(dto.contact_phone, 'phone', 'register');

    return { data: saved, otp };
  }

  async genOtp(
    identifier: string,
    type: 'email' | 'phone',
    purpose: 'login' | 'register' | 'reset_password',
    expiryMinutes = 60
  ): Promise<string> {
    const plainOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const hashedOtp = await bcrypt.hash(plainOtp, 10);
    const expires_at = new Date(Date.now() + expiryMinutes * 60 * 1000);

    await this.otpModel.deleteMany({
      identifier,
      purpose,
      is_used: false,
      expires_at: { $gt: new Date() },
    });

    // Save new OTP
    await this.otpModel.create({
      identifier,
      code: hashedOtp,
      type,
      purpose,
      expires_at,
      is_used: false,
    });

    return plainOtp;
  }

  async validateOtp(
    identifier: string,
    code: string,
    type: 'email' | 'phone',
    purpose: 'login' | 'register' | 'reset_password'
  ): Promise<{ success: boolean; message: string }> {
    const now = new Date();

    const otpRecord = await this.otpModel.findOne({
      identifier,
      type,
      purpose,
      is_used: false,
      expires_at: { $gt: now },
    });

    if (!otpRecord) {
      throw new RpcException({
        status: 400,
        message: 'OTP is invalid or expired',
        error: 'InvalidOTP',
      });
    }

    const isValid = await bcrypt.compare(code, otpRecord.code);

    if (!isValid) {
      throw new RpcException({
        status: 400,
        message: 'Incorrect OTP',
        error: 'InvalidOTP',
      });
    }

    // Mark OTP as used
    otpRecord.is_used = true;
    await otpRecord.save();

    // Find and update workshop
    const workshop = await this.workshopModel.findOne({
      contact_phone: identifier,
    });

    if (!workshop) {
      throw new RpcException({
        status: 404,
        message: 'Workshop not found for this contact',
        error: 'WorkshopNotFound',
      });
    }

    workshop.is_verified = true;
    workshop.is_active = true;
    await workshop.save();

    return {
      success: true,
      message:
        'OTP validated successfully. Workshop is now verified and active.',
    };
  }

  private async checkUniqueFields<T extends { [key: string]: any }>(
    model: Model<T>,
    fields: Partial<Record<keyof T, any>>
  ): Promise<void> {
    const $or: FilterQuery<T>[] = Object.entries(fields)
      .filter(([, value]) => value !== undefined && value !== null) // skip undefined/null
      .map(([key, value]) => ({ [key]: value })) as FilterQuery<T>[];

    const existing = await model.findOne({ $or }).lean(); // use lean to get plain object

    if (existing) {
      const conflictKeys = Object.entries(fields)
        .filter(
          ([key, value]) => existing[key as keyof typeof existing] === value
        )
        .map(([key]) => key)
        .join(', ');

      throw new RpcException({
        status: 409,
        message: `Duplicate value found for: ${conflictKeys}`,
        error: 'Conflict',
      });
    }
  }
}
