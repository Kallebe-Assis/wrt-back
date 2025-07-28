const admin = require('firebase-admin');

// Inicializar Firebase se não estiver inicializado
if (!admin.apps.length) {
  try {
    // Usar variáveis de ambiente do Vercel
    const serviceAccount = {
      type: 'service_account',
      project_id: process.env.FIREBASE_PROJECT_ID || 'wrtmind',
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || '',
      private_key: process.env.FIREBASE_PRIVATE_KEY ? 
        process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : '',
      client_email: process.env.FIREBASE_CLIENT_EMAIL || '',
      client_id: process.env.FIREBASE_CLIENT_ID || '',
      auth_uri: process.env.FIREBASE_AUTH_URI || 'https://accounts.google.com/o/oauth2/auth',
      token_uri: process.env.FIREBASE_TOKEN_URI || 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL || 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL || '',
      universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN || 'googleapis.com'
    };

    console.log('🔧 Configurando Firebase com variáveis de ambiente...');
    console.log('🔧 Project ID:', serviceAccount.project_id);
    console.log('🔧 Client Email:', serviceAccount.client_email);
    console.log('🔧 Private Key exists:', !!serviceAccount.private_key);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://wrtmind-default-rtdb.firebaseio.com',
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'wrtmind.appspot.com'
    });

    console.log('✅ Firebase inicializado com sucesso no Vercel');
  } catch (error) {
    console.error('❌ Erro ao inicializar Firebase no Vercel:', error.message);
    console.error('❌ Stack:', error.stack);
    throw error;
  }
}

const db = admin.firestore();

module.exports = { admin, db }; 