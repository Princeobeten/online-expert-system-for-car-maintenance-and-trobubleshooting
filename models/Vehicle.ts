import mongoose, { Document, Schema } from 'mongoose';

export interface IVehicle extends Document {
  vehicle_id: string;
  user_id: string;
  brand: string;
  vehicleModel: string;
  year: number;
  engine_type?: string;
  createdAt: Date;
  updatedAt: Date;
}

const VehicleSchema: Schema = new Schema({
  vehicle_id: {
    type: String,
    required: true,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  user_id: {
    type: String,
    required: true,
    ref: 'User'
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  vehicleModel: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear() + 1
  },
  engine_type: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Vehicle || mongoose.model<IVehicle>('Vehicle', VehicleSchema);