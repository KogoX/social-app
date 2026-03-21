import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // Optional because third-party auth might not use it, or if stripped on return
  avatar: string;
  bio?: string;
  title?: string;
  location?: string;
  work?: string;
  school?: string;
  followers: number;
  friends: mongoose.Types.ObjectId[];
  isOnline: boolean;
  isAdmin: boolean;
  isBanned: boolean;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCw_8YzpQdaC7LK3Pb9BK16eg2zaYnF5UcUe72PIs2eViXaWKdo2bUPO8Uz_B5pVMdr7X0bq-oaQjR-Lrq2jv5CPk9hxj0zTkeE3PpcRm3YfGcE5qBlNJYjQsNDZoSP6bHoVjAsDxmVDTvaN2x3t9fTX5-zv6X8NaE7hSP2xBUDugS0PwJpycFfnzyMTjXg9npsvi48qTbuAuZDOndaWZ8KlMKpTR0WOz_cwXQhCnhmIm_vqIwmpGZeqVb2oEbj66qnE837WM9JhiM' }, // Default avatar
    bio: { type: String, default: '' },
    title: { type: String, default: 'Digital Creator' },
    location: { type: String, default: '' },
    work: { type: String, default: '' },
    school: { type: String, default: '' },
    followers: { type: Number, default: 0 },
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    isOnline: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;
