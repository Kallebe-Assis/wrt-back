require('dotenv').config();
const { initializeFirebase, getFirestore } = require('../WRT-Back/config/firebase');

async function testFirebase() {
  try {
    console.log('🧪 Testando conexão com Firebase...');
    
    // Inicializar Firebase
    initializeFirebase();
    
    // Obter instância do Firestore
    const db = getFirestore();
    console.log('✅ Firestore obtido com sucesso');
    
    // Testar uma operação simples
    const collectionRef = db.collection('test');
    console.log('✅ Referência da coleção criada');
    
    // Tentar listar documentos (pode estar vazio)
    const snapshot = await collectionRef.limit(1).get();
    console.log('✅ Consulta executada com sucesso');
    console.log(`📊 Documentos encontrados: ${snapshot.size}`);
    
    console.log('🎉 Firebase está funcionando corretamente!');
    
  } catch (error) {
    console.error('❌ Erro ao testar Firebase:', error.message);
    console.error('Stack:', error.stack);
  }
}

testFirebase(); 