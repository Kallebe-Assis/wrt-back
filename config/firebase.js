const admin = require('firebase-admin');
const path = require('path');

// Caminho do arquivo de credenciais de serviço
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || './wrtmin-service-account.json';

let initialized = false;

const initializeFirebase = () => {
  console.log('🔧 Inicializando Firebase...');
  console.log('📁 Caminho do arquivo de credenciais:', serviceAccountPath);
  console.log('🔍 Verificando se já foi inicializado:', initialized);
  console.log('🔍 Número de apps Firebase:', admin.apps.length);
  
  if (!initialized && admin.apps.length === 0) {
    try {
      console.log('📂 Carregando arquivo de credenciais...');
      const serviceAccount = require(path.resolve(serviceAccountPath));
      console.log('✅ Arquivo de credenciais carregado');
      console.log('🔧 Inicializando app Firebase...');
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      
      initialized = true;
      console.log('✅ Firebase Admin SDK inicializado com credenciais de serviço');
      console.log(`📁 Projeto: ${serviceAccount.project_id || 'N/A'}`);
    } catch (error) {
      console.error('❌ Erro ao inicializar Firebase Admin SDK:', error.message);
      console.error('💡 Verifique o caminho do arquivo de credenciais de serviço:', serviceAccountPath);
      console.error('🔍 Stack trace:', error.stack);
      throw error; // Não usar process.exit() em funções serverless
    }
  } else {
    console.log('✅ Firebase já inicializado, reutilizando conexão');
  }
  
  console.log('🔧 Retornando instância do Firestore...');
  return admin.firestore();
};

const getFirestore = () => {
  if (admin.apps.length === 0) {
    throw new Error('Firebase não foi inicializado. Chame initializeFirebase() primeiro.');
  }
  return admin.firestore();
};

module.exports = {
  initializeFirebase,
  getFirestore,
  admin
}; 