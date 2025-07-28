const admin = require('firebase-admin');

module.exports = async function handler(req, res) {
  console.log('🧪 Testando configuração do Firebase...');
  
  try {
    // Verificar se o Firebase já está inicializado
    if (admin.apps.length > 0) {
      console.log('✅ Firebase já está inicializado');
      
      // Tentar usar a configuração existente
      const db = admin.firestore();
      
      // Teste simples de conexão
      const testCollection = db.collection('test');
      const testDoc = await testCollection.add({
        timestamp: new Date().toISOString(),
        message: 'Teste de configuração Firebase'
      });

      console.log('✅ Documento de teste criado:', testDoc.id);
      await testDoc.delete();
      console.log('✅ Documento de teste deletado');

      res.json({
        success: true,
        message: 'Firebase configurado e funcionando!',
        appsCount: admin.apps.length,
        timestamp: new Date().toISOString()
      });
    } else {
      console.log('❌ Firebase não está inicializado');
      
      // Tentar inicializar
      const serviceAccount = {
        type: 'service_account',
        project_id: process.env.FIREBASE_PROJECT_ID || 'wrtmind',
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

      console.log('🔧 Tentando inicializar Firebase...');
      console.log('🔧 Project ID:', serviceAccount.project_id);
      console.log('🔧 Client Email:', serviceAccount.client_email);
      console.log('🔧 Private Key exists:', !!serviceAccount.private_key);
      console.log('🔧 Private Key length:', serviceAccount.private_key.length);

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://wrtmind-default-rtdb.firebaseio.com',
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'wrtmind.appspot.com'
      });

      console.log('✅ Firebase inicializado com sucesso');

      res.json({
        success: true,
        message: 'Firebase inicializado com sucesso!',
        projectId: serviceAccount.project_id,
        clientEmail: serviceAccount.client_email,
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error('❌ Erro na configuração do Firebase:', error);
    res.status(500).json({
      success: false,
      error: 'Erro na configuração do Firebase',
      message: error.message,
      stack: error.stack,
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY
    });
  }
}; 