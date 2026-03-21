import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User';

dotenv.config();

const checkAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    const user = await User.findOne({ email: 'deondd402@gmail.com' });
    console.log('User from DB:', user);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

checkAdmin();
