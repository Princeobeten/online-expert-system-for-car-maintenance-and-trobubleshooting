import mongoose, { Document, Schema } from 'mongoose';

export interface ISymptom extends Document {
  symptom_id: string;
  description: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SymptomSchema: Schema = new Schema({
  symptom_id: {
    type: String,
    required: true,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  description: {
    type: String,
    required: true,
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

export default mongoose.models.Symptom || mongoose.model<ISymptom>('Symptom', SymptomSchema);