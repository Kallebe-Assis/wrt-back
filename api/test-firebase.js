const { db } = require('./firebase-config');

module.exports = async function handler(req, res) {
  // Permitir CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  try {
    // Testar conexão com Firebase
    const testQuery = await db.collection('users').limit(1).get();
    
    res.json({
      success: true,
      message: 'Firebase conectado com sucesso!',
      timestamp: new Date().toISOString(),
      firebaseStatus: 'OK',
      collections: {
        users: testQuery.empty ? 'vazia' : 'tem dados'
      }
    });
    
  } catch (error) {
    console.error('❌ Erro no teste Firebase:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao conectar com Firebase',
      details: error.message
    });
  }
}; 