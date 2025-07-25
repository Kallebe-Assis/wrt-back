const admin = require('firebase-admin');
const path = require('path');

// Inicializar Firebase se não estiver inicializado
if (!admin.apps.length) {
  try {
    const serviceAccount = require(path.join(process.cwd(), 'wrtmin-service-account.json'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('✅ Firebase inicializado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao inicializar Firebase:', error.message);
    throw error;
  }
}

const db = admin.firestore();

module.exports = { admin, db }; 