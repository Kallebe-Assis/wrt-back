import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';

dotenv.config();

export function connectToFirebase() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  if (!projectId || !privateKey || !clientEmail) {
    console.log('⚠️ Credenciais do Firebase não encontradas, usando configuração básica...');
    return null;
  }

  try {
    // Verificar se já foi inicializado
    if (getApps().length === 0) {
      initializeApp({
        credential: cert({
          projectId,
          privateKey: privateKey.replace(/\\n/g, '\n'),
          clientEmail,
        }),
      });
    }

    const db = getFirestore();
    console.log('✅ Firebase Admin SDK inicializado com credenciais de serviço');
    console.log(`📁 Projeto: ${projectId}`);
    return db;
  } catch (error) {
    console.error('❌ Erro ao inicializar Firebase:', error);
    return null;
  }
}

export function getFirebaseDB() {
  return getFirestore();
} 