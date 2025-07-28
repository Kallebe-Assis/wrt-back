const { db } = require('./firebase-config');

module.exports = async function handler(req, res) {
  // Permitir todas as origens
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, user-id');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }

  try {
    console.log('🧪 Testando conexão com Firebase...');

    // Testar conexão com Firestore
    const testCollection = db.collection('test');
    const testDoc = await testCollection.add({
      timestamp: new Date().toISOString(),
      message: 'Teste de conexão'
    });

    console.log('✅ Documento de teste criado:', testDoc.id);

    // Deletar documento de teste
    await testDoc.delete();
    console.log('✅ Documento de teste deletado');

    // Testar busca na coleção de usuários
    const usuariosRef = db.collection('usuarios');
    const usuariosSnapshot = await usuariosRef.limit(5).get();
    
    const usuarios = [];
    usuariosSnapshot.forEach(doc => {
      usuarios.push({
        id: doc.id,
        email: doc.data().email,
        nome: doc.data().nome
      });
    });

    console.log('📊 Usuários encontrados:', usuarios.length);

    res.json({
      success: true,
      message: 'Conexão com Firebase funcionando!',
      firestore: 'OK',
      usuariosEncontrados: usuarios.length,
      usuarios: usuarios,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Erro na conexão com Firebase:', error);
    res.status(500).json({
      success: false,
      error: 'Erro na conexão com Firebase',
      message: error.message,
      stack: error.stack
    });
  }
}; 