import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User';

dotenv.config();

const makeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    const email = process.argv[2];
    
    if (!email) {
      console.error('Please provide an email');
      process.exit(1);
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      console.error('User not found');
      process.exit(1);
    }
    
    user.isAdmin = true;
    await user.save();
    console.log(`Successfully promoted ${email} to admin!`);
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

makeAdmin();
