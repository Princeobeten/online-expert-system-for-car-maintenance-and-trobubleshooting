import mongoose, { Document, Schema } from 'mongoose';

export interface ISolution extends Document {
  solution_id: string;
  fault_id: string;
  repair_action: string;
  estimated_cost?: number;
  difficulty_level?: 'Easy' | 'Medium' | 'Hard' | 'Professional';
  estimated_time?: string;
  tools_required?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const SolutionSchema: Schema = new Schema({
  solution_id: {
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
  repair_action: {
    type: String,
    required: true
  },
  estimated_cost: {
    type: Number,
    min: 0
  },
  difficulty_level: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard', 'Professional'],
    default: 'Medium'
  },
  estimated_time: {
    type: String
  },
  tools_required: [{
    type: String
  }]
}, {
  timestamps: true
});

export default mongoose.models.Solution || mongoose.model<ISolution>('Solution', SolutionSchema);