import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

export type WorkshopDocument = HydratedDocument<Workshop>;

@Schema({ timestamps: true })
export class Workshop {
  @Prop({
    required: true,
    type: String,
    unique: true,
    trim: true,
    index: true,
  })
  workshop_name!: string;

  @Prop({ required: true, type: String, trim: true })
  state!: string;

  @Prop({ required: true, type: String, trim: true })
  local_government!: string;

  @Prop({ required: true, type: String, trim: true })
  address!: string;

  // GeoJSON Point for location-based queries
  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  })
  geo_location!: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };

  @Prop({
    type: [
      {
        service_name: { type: String, required: true },
        description: { type: String, default: '' },
      },
    ],
    default: [],
    _id: false,
  })
  services_offered!: {
    service_name: string;
    description: string;
  }[];

  @Prop({ type: Number, min: 0, max: 5, default: 0 })
  average_rating!: number;

  @Prop({ type: Number, default: 0 })
  total_reviews!: number;

  @Prop({ type: String, trim: true })
  owner_name!: string;

  @Prop({ type: String, trim: true })
  contact_phone!: string;

  @Prop({ type: String, trim: true, unique: true, sparse: true })
  contact_email?: string;

  @Prop({
    type: String,
    required: true,
    minlength: 6,
    select: false,
  })
  password!: string;

  @Prop({ type: Boolean, default: true })
  is_active!: boolean;

  @Prop({ type: Boolean, default: false })
  is_verified!: boolean;
}

export const WorkshopSchema = SchemaFactory.createForClass(Workshop);

WorkshopSchema.index({ geo_location: '2dsphere' });
