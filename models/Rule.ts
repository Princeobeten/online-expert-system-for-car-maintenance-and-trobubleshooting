import mongoose, { Document, Schema } from 'mongoose';

export interface IRule extends Document {
  rule_id: string;
  fault_id: string;
  symptoms: string[];
  condition: string;
  confidence_level: number;
  createdAt: Date;
  updatedAt: Date;
}

const RuleSchema: Schema = new Schema({
  rule_id: {
    type: String,
    required: true,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  fault_id: {
    type: String,
    required: true,
    ref: 'Fault'
  },
  symptoms: [{
    type: String,
    ref: 'Symptom'
  }],
  condition: {
    type: String,
    required: true
  },
  confidence_level: {
    type: Number,
    min: 0,
    max: 100,
    default: 80
  }
}, {
  timestamps: true
});

export default mongoose.models.Rule || mongoose.model<IRule>('Rule', RuleSchema);