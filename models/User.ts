import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  user_id: string;
  fullname: string;
  email: string;
  password: string;
  role: 'Admin' | 'User';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  user_id: {
    type: String,
    required: true,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  fullname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['Admin', 'User'],
    default: 'User'
  }
}, {
  timestamps: true
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);