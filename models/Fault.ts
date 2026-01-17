import mongoose, { Document, Schema } from 'mongoose';

export interface IFault extends Document {
  fault_id: string;
  fault_name: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description?: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FaultSchema: Schema = new Schema({
  fault_id: {
    type: String,
    required: true,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  fault_name: {
    type: String,
    required: true,
    trim: true
  },
  severity: {
    type: String,
    required: true,
    enum: ['Low', 'Medium', 'High', 'Critical']
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true,
    enum: ['Engine', 'Transmission', 'Brakes', 'Electrical', 'Cooling', 'Fuel', 'Suspension', 'Other']
  }
}, {
  timestamps: true
});

export default mongoose.models.Fault || mongoose.model<IFault>('Fault', FaultSchema);