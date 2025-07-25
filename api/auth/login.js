const { initializeFirebase } = require('../../config/firebase');

module.exports = function handler(req, res) {
  // SEM CORS - ULTRA SIMPLES
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email e senha obrigatórios'
      });
    }

    // Conectar ao Firebase
    const db = initializeFirebase();
    
    // Buscar usuário
    const userQuery = await db.collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (userQuery.empty) {
      return res.status(401).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }

    const userDoc = userQuery.docs[0];
    const userData = userDoc.data();
    
    // Verificar senha simples
    if (userData.senha !== password) {
      return res.status(401).json({
        success: false,
        error: 'Senha incorreta'
      });
    }

    // Retornar sucesso
    res.status(200).json({
      success: true,
      usuario: {
        id: userDoc.id,
        nome: userData.nome,
        email: userData.email
      },
      token: 'token-simples',
      message: 'Login OK'
    });

  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno'
    });
  }
} 