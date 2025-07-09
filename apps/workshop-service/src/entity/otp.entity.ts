import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export type OtpDocument = Otp & Document;

@Schema({ timestamps: true })
export class Otp {
  @Prop({ required: true, trim: true })
  identifier: string; // email or phone number

  @Prop({ required: true })
  code: string; // the actual OTP

  @Prop({
    required: true,
    enum: ['email', 'phone'],
    default: 'phone',
  })
  type: 'email' | 'phone';

  @Prop({ required: true, type: Date })
  expires_at: Date;

  @Prop({ type: Number, default: 0 })
  attempt_count: number;

  @Prop({ type: Boolean, default: false })
  is_used: boolean;

  @Prop({
    type: String,
    enum: ['register', 'login', 'reset_password'],
    required: true,
  })
  purpose: 'register' | 'login' | 'reset_password';
}

export const OtpSchema = SchemaFactory.createForClass(Otp);

// 🔥 Indexes
OtpSchema.index({ identifier: 1, purpose: 1, is_used: 1 });
OtpSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 }); // TTL auto-delete
