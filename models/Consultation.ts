import mongoose, { Document, Schema } from 'mongoose';

export interface IConsultation extends Document {
  consultation_id: string;
  user_id: string;
  vehicle_id: string;
  fault_id?: string;
  symptoms: string[];
  consult_date: Date;
  status: 'In Progress' | 'Completed' | 'Cancelled';
  diagnosis_confidence?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ConsultationSchema: Schema = new Schema({
  consultation_id: {
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
  vehicle_id: {
    type: String,
    required: true,
    ref: 'Vehicle'
  },
  fault_id: {
    type: String,
    ref: 'Fault'
  },
  symptoms: [{
    type: String,
    ref: 'Symptom'
  }],
  consult_date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['In Progress', 'Completed', 'Cancelled'],
    default: 'In Progress'
  },
  diagnosis_confidence: {
    type: Number,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

export default mongoose.models.Consultation || mongoose.model<IConsultation>('Consultation', ConsultationSchema);