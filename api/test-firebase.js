const { initializeFirebase } = require('../config/firebase');

module.exports = async function handler(req, res) {
  console.log('🚀 === TEST FIREBASE ENDPOINT ===');
  console.log('📅 Timestamp:', new Date().toISOString());

  try {
    console.log('🔥 === INICIALIZANDO FIREBASE ===');
    const db = initializeFirebase();
    console.log('✅ Firebase inicializado');

    console.log('🔍 === TESTANDO CONEXÃO ===');
    console.log('🔍 Tentando buscar usuários...');
    
    const usersQuery = await db.collection('users').limit(5).get();
    console.log('✅ Query executada com sucesso');
    console.log('📊 Total de usuários encontrados:', usersQuery.size);

    const users = [];
    usersQuery.forEach(doc => {
      const userData = doc.data();
      users.push({
        id: doc.id,
        nome: userData.nome,
        email: userData.email,
        ativo: userData.ativo
      });
    });

    console.log('👥 Usuários encontrados:', users);

    const responseData = {
      success: true,
      message: 'Conexão com Firebase OK!',
      timestamp: new Date().toISOString(),
      totalUsers: usersQuery.size,
      users: users,
      firebaseStatus: 'connected'
    };

    console.log('📤 Resposta sendo enviada:', JSON.stringify(responseData, null, 2));
    res.status(200).json(responseData);
    console.log('✅ Resposta enviada com sucesso');

  } catch (error) {
    console.error('💥 === ERRO NO TEST FIREBASE ===');
    console.error('💥 Error message:', error.message);
    console.error('💥 Error stack:', error.stack);
    console.error('💥 Error name:', error.name);
    
    res.status(500).json({
      success: false,
      error: 'Erro ao conectar com Firebase',
      details: error.message,
      firebaseStatus: 'error'
    });
  }

  console.log('🏁 === TEST FIREBASE ENDPOINT FINALIZADO ===');
} 