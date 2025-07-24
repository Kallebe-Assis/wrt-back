require('dotenv').config({ path: './config.env' });
const { initializeFirebase, getFirestore } = require('../config/firebase');

async function testFirebaseConnection() {
  try {
    console.log('🔍 Testando conexão com Firebase...\n');
    
    // Mostrar configurações
    console.log('📋 Configurações do Firebase:');
    console.log(`   Project ID: ${process.env.FIREBASE_PROJECT_ID}`);
    console.log(`   Auth Domain: ${process.env.FIREBASE_AUTH_DOMAIN}`);
    console.log(`   Storage Bucket: ${process.env.FIREBASE_STORAGE_BUCKET}`);
    console.log(`   Database URL: ${process.env.FIREBASE_DATABASE_URL}`);
    console.log('');
    
    // Inicializar Firebase
    console.log('🚀 Inicializando Firebase...');
    const db = initializeFirebase();
    
    // Testar conexão
    console.log('🔗 Testando conexão com Firestore...');
    
    // Tentar criar um documento de teste
    const testDoc = {
      test: true,
      timestamp: new Date().toISOString(),
      message: 'Teste de conexão com Firebase'
    };
    
    const testRef = db.collection('test-connection');
    await testRef.add(testDoc);
    console.log('✅ Documento de teste criado com sucesso!');
    
    // Buscar o documento criado
    const snapshot = await testRef.where('test', '==', true).get();
    console.log(`✅ ${snapshot.size} documento(s) de teste encontrado(s)`);
    
    // Limpar documento de teste
    snapshot.forEach(doc => {
      doc.ref.delete();
    });
    console.log('🧹 Documento de teste removido');
    
    // Testar coleção de links
    console.log('\n📊 Testando coleção de links...');
    const linksSnapshot = await db.collection('links').get();
    console.log(`✅ ${linksSnapshot.size} link(s) encontrado(s) na coleção 'links'`);
    
    if (linksSnapshot.size > 0) {
      console.log('\n📋 Links existentes:');
      linksSnapshot.forEach(doc => {
        const data = doc.data();
        console.log(`   - ${data.titulo || 'Sem título'} (ID: ${doc.id})`);
      });
    }
    
    console.log('\n🎉 Conexão com Firebase testada com sucesso!');
    console.log(`📁 Projeto conectado: ${process.env.FIREBASE_PROJECT_ID}`);
    
  } catch (error) {
    console.error('❌ Erro ao testar conexão com Firebase:', error.message);
    console.error('Stack:', error.stack);
    
    if (error.code === 'app/no-app') {
      console.log('\n💡 Dica: Verifique se as variáveis de ambiente estão corretas');
    } else if (error.code === 'permission-denied') {
      console.log('\n💡 Dica: Verifique as regras de segurança do Firestore');
    }
    
    process.exit(1);
  }
}

if (require.main === module) {
  testFirebaseConnection();
}

module.exports = testFirebaseConnection; 