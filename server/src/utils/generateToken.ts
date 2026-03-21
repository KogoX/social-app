import jwt from 'mongoose'; // Whoops, JWT from jsonwebtoken
import jwtLib from 'jsonwebtoken';
import mongoose from 'mongoose';

const generateToken = (id: mongoose.Types.ObjectId): string => {
  return jwtLib.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  });
};

export default generateToken;
