const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
require('dotenv').config();

function connectToFirebase() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  console.log('🔍 Debug Firebase - Variáveis recebidas:');
  console.log('Project ID:', projectId);
  console.log('Client Email:', clientEmail);
  console.log('Private Key exists:', !!privateKey);

  if (!projectId || !privateKey || !clientEmail) {
    console.log('⚠️ Credenciais do Firebase não encontradas, usando configuração básica...');
    console.log('Missing:', { projectId: !projectId, privateKey: !privateKey, clientEmail: !clientEmail });
    return null;
  }

  try {
    console.log('📡 Tentando inicializar Firebase Admin SDK...');
    
    // Verificar se já foi inicializado
    if (getApps().length === 0) {
      console.log('🔄 Inicializando nova instância do Firebase...');
      initializeApp({
        credential: cert({
          projectId,
          privateKey: privateKey.replace(/\\n/g, '\n'),
          clientEmail,
        }),
      });
      console.log('✅ Firebase Admin SDK inicializado com sucesso!');
    } else {
      console.log('✅ Firebase Admin SDK já estava inicializado');
    }

    const db = getFirestore();
    console.log('✅ Firestore conectado com sucesso!');
    console.log(`📁 Projeto: ${projectId}`);
    return db;
  } catch (error) {
    console.error('❌ Erro ao inicializar Firebase:', error);
    console.error('Stack trace:', error.stack);
    return null;
  }
}

function getFirebaseDB() {
  return getFirestore();
}

module.exports = {
  connectToFirebase,
  getFirebaseDB
}; 