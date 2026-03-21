import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  user: mongoose.Types.ObjectId; // recipient
  relatedUser: mongoose.Types.ObjectId; // actor
  type: 'like' | 'comment' | 'mention' | 'friend_request' | 'share';
  content: string;
  quote?: string;
  isRead: boolean;
  actionIcon: string;
  actionColor: string;
}

const notificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    relatedUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['like', 'comment', 'mention', 'friend_request', 'share'],
      required: true,
    },
    content: { type: String, required: true },
    quote: { type: String },
    isRead: { type: Boolean, default: false },
    actionIcon: { type: String, required: true },
    actionColor: { type: String, required: true },
  },
  {
    timestamps: true, // provides timestamp automatically
  }
);

const Notification = mongoose.model<INotification>('Notification', notificationSchema);
export default Notification;
