const { initializeFirebase } = require('../config/firebase');

module.exports = async function handler(req, res) {
  console.log('=== TESTE FIREBASE ===');
  
  // TRATAR OPTIONS (PREFLIGHT)
  if (req.method === 'OPTIONS') {
    console.log('OPTIONS request - respondendo 200');
    res.status(200).end();
    return;
  }
  
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
    
    res.status(200).json({
      success: true,
      message: 'Firebase funcionando corretamente',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('ERRO NO TESTE FIREBASE:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({
      success: false,
      error: 'Erro no teste Firebase: ' + error.message,
      timestamp: new Date().toISOString()
    });
  }
}; 