import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

const connectDB = async () => {
  await mongoose.connect(MONGODB_URI);
};

export default connectDB;
