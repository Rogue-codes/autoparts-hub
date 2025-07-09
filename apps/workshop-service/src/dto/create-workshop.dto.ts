import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsDateString,
  Length,
  ArrayNotEmpty,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class GeoLocationDto {
  @ApiProperty({
    enum: ['Point'],
    default: 'Point',
    description: 'GeoJSON type',
  })
  @IsString()
  @IsNotEmpty()
  type!: 'Point';

  @ApiProperty({
    example: [3.3792, 6.5244],
    description: '[longitude, latitude]',
    minItems: 2,
    maxItems: 2,
    type: [Number],
  })
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Number)
  coordinates!: [number, number];
}

class ServiceOfferedDto {
  @ApiProperty({ example: 'Engine Repair' })
  @IsString()
  @IsNotEmpty()
  service_name!: string;

  @ApiPropertyOptional({ example: 'Fixes and overhauls engines' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateWorkshopDto {
  @ApiProperty({ example: 'Super Cars Workshop', minLength: 3, maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  workshop_name!: string;

  @ApiProperty({ example: 'Lagos' })
  @IsString()
  @IsNotEmpty()
  state!: string;

  @ApiProperty({ example: 'Ikeja' })
  @IsString()
  @IsNotEmpty()
  local_government!: string;

  @ApiProperty({ example: '12 Adeola Street, Ikeja' })
  @IsString()
  @IsNotEmpty()
  address!: string;

  @ApiPropertyOptional({ example: 'Near Computer Village' })
  @IsOptional()
  @IsString()
  landmark?: string;

  @ApiProperty({
    type: () => GeoLocationDto,
    description: 'GeoJSON location coordinates',
  })
  @ValidateNested()
  @Type(() => GeoLocationDto)
  geo_location!: GeoLocationDto;

  @ApiProperty({
    type: [ServiceOfferedDto],
    example: [
      { service_name: 'Painting', description: 'Body respray and detailing' },
      { service_name: 'AC Repair' },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceOfferedDto)
  services_offered!: ServiceOfferedDto[];

  @ApiProperty({ example: '+2348012345678', minLength: 7, maxLength: 20 })
  @IsString()
  @IsNotEmpty()
  @Length(7, 20)
  contact_phone!: string;

  @ApiPropertyOptional({ example: 'support@supercars.com' })
  @IsOptional()
  @IsEmail()
  contact_email?: string;

  @ApiPropertyOptional({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  owner_name?: string;

  @ApiProperty({ example: 'securePassword123', minLength: 6 })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;
}
