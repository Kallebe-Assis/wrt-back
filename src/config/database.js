const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
require('dotenv').config();

function connectToFirebase() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const serviceAccountPath = './wrtmind-firebase-adminsdk-fbsvc-f96a42c84b.json';

  console.log('🔍 Debug Firebase - Variáveis recebidas:');
  console.log('Project ID:', projectId);
  console.log('Service Account Path:', serviceAccountPath);

  if (!projectId) {
    console.log('⚠️ Project ID não encontrado, usando configuração básica...');
    return null;
  }

  try {
    console.log('📡 Tentando inicializar Firebase Admin SDK...');
    
    // Verificar se já foi inicializado
    if (getApps().length === 0) {
      console.log('🔄 Inicializando nova instância do Firebase...');
      
      // Tentar usar arquivo de credenciais primeiro
      try {
        const serviceAccount = require('../../wrtmind-firebase-adminsdk-fbsvc-f96a42c84b.json');
        initializeApp({
          credential: cert(serviceAccount),
        });
        console.log('✅ Firebase Admin SDK inicializado com arquivo de credenciais!');
      } catch (fileError) {
        console.log('⚠️ Arquivo de credenciais não encontrado, tentando variáveis de ambiente...');
        
        const privateKey = process.env.FIREBASE_PRIVATE_KEY;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        
        if (!privateKey || !clientEmail) {
          console.log('❌ Credenciais não encontradas');
          return null;
        }
        
        initializeApp({
          credential: cert({
            projectId,
            privateKey: privateKey.replace(/\\n/g, '\n'),
            clientEmail,
          }),
        });
        console.log('✅ Firebase Admin SDK inicializado com variáveis de ambiente!');
      }
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