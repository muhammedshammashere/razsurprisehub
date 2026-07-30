import app from '../server/src/app.js';
import { connectDB } from '../server/src/config/db.js';

let cachedConnection = null;

export default async (req, res) => {
  // Lazily connect to MongoDB and cache the connection promise across invocations
  if (!cachedConnection) {
    cachedConnection = connectDB().catch((err) => {
      console.error('MongoDB connection failed in Vercel Serverless Function:', err.message);
      cachedConnection = null; // Reset cached promise on failure to retry on subsequent requests
      throw err;
    });
  }
  await cachedConnection;
  return app(req, res);
};
