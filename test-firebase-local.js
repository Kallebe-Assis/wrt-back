const { initializeFirebase } = require('./config/firebase');

async function testFirebase() {
  console.log('🧪 Testando Firebase localmente...');
  
  try {
    console.log('1. Inicializando Firebase...');
    const db = initializeFirebase();
    console.log('2. Firebase inicializado com sucesso');
    
    console.log('3. Testando conexão com Firestore...');
    const testCollection = db.collection('test');
    console.log('4. Coleção test criada');
    
    console.log('5. Testando leitura de dados...');
    const snapshot = await testCollection.limit(1).get();
    console.log('6. Leitura realizada com sucesso');
    
    console.log('7. Testando busca de usuários...');
    const usersCollection = db.collection('users');
    const usersSnapshot = await usersCollection.limit(5).get();
    console.log(`8. Encontrados ${usersSnapshot.size} usuários`);
    
    console.log('✅ Firebase funcionando corretamente!');
    
  } catch (error) {
    console.error('❌ Erro no teste Firebase:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

testFirebase(); 