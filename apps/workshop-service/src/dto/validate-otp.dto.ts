import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNotEmpty, IsString, Length } from "class-validator";

export class ValidateOtpDto {
  @ApiProperty({
    example: '+2348012345678',
    description: 'Phone number or email used to receive OTP',
  })
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({ example: '1234', description: 'OTP code sent to user' })
  @IsString()
  @Length(4, 6) // Adjust if you're using 6-digit OTPs
  code: string;

  @ApiProperty({ enum: ['email', 'phone'], example: 'phone' })
  @IsString()
  @IsIn(['email', 'phone'])
  type: 'email' | 'phone';

  @ApiProperty({
    enum: ['login', 'register', 'reset_password'],
    example: 'register',
  })
  @IsString()
  @IsIn(['login', 'register', 'reset_password'])
  purpose: 'login' | 'register' | 'reset_password';
}
