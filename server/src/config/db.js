import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

export const connectDB = async () => {
  if (admin.getApps().length > 0) {
    return;
  }

  // Log emulator info if active
  if (process.env.FIRESTORE_EMULATOR_HOST) {
    console.log(`Connecting to local Firestore Emulator at ${process.env.FIRESTORE_EMULATOR_HOST}`);
  }

  // 1. Try loading local service-account.json file if it exists
  const serviceAccountPath = path.join(process.cwd(), 'service-account.json');
  if (fs.existsSync(serviceAccountPath)) {
    try {
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      admin.initializeApp({
        credential: admin.cert(serviceAccount),
      });
      console.log(`Firebase connected successfully: Loaded credentials from service-account.json`);
      return;
    } catch (err) {
      console.error(`Error loading service-account.json: ${err.message}`);
    }
  }

  // 2. Try loading from individual environment variables
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (privateKey) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  if (projectId && clientEmail && privateKey) {
    admin.initializeApp({
      credential: admin.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
    console.log(`Firebase connected successfully: Project ID: ${projectId}`);
    return;
  }

  // 3. Try loading from stringified env variable
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.cert(serviceAccount),
      });
      console.log(`Firebase connected successfully: Certified via service account JSON string`);
      return;
    } catch (err) {
      throw new Error(`Failed to parse FIREBASE_SERVICE_ACCOUNT JSON: ${err.message}`);
    }
  }

  // 4. Local development fallback
  admin.initializeApp({
    projectId: projectId || 'surprise-venture-dev',
  });
  console.log(`Firebase connected (Local / Emulator Fallback). Project: ${projectId || 'surprise-venture-dev'}`);
};
