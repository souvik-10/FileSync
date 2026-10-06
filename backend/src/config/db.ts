import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/filesync';

  try {
    const conn = await mongoose.connect(uri);
    console.log(`[MongoDB] Connected to Host: ${conn.connection.host}`);
  } catch (error) {
    console.error('[MongoDB] Connection error:', error);
    // Don't crash process completely to allow offline mode / mock mode if MongoDB is down, but log warning
  }
};
