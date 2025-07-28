const { db } = require('../firebase-config');
const bcrypt = require('bcryptjs');

module.exports = async function handler(req, res) {
  // Permitir todas as origens
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, user-id');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }

  // Apenas POST permitido
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Método não permitido',
      allowedMethods: ['POST']
    });
  }

  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({
      success: false,
      error: 'Email e senha são obrigatórios'
    });
  }

  try {
    console.log('🔐 Tentativa de login:', { email, senha: senha ? '***' : 'não fornecida' });

    // Buscar usuário no Firebase
    const usuariosRef = db.collection('usuarios');
    const query = await usuariosRef.where('email', '==', email).limit(1).get();

    if (query.empty) {
      console.log('❌ Usuário não encontrado:', email);
      return res.status(401).json({
        success: false,
        error: 'Credenciais inválidas',
        message: 'Email ou senha incorretos'
      });
    }

    const userDoc = query.docs[0];
    const userData = userDoc.data();

    console.log('🔍 Usuário encontrado:', { email, id: userDoc.id });

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, userData.senha);
    
    if (!senhaValida) {
      console.log('❌ Senha inválida para:', email);
      return res.status(401).json({
        success: false,
        error: 'Credenciais inválidas',
        message: 'Email ou senha incorretos'
      });
    }

    console.log('✅ Login bem-sucedido para:', email);

    // Retornar dados do usuário (sem senha)
    const { senha: _, ...userInfo } = userData;
    
    res.json({
      success: true,
      user: {
        id: userDoc.id,
        ...userInfo
      },
      message: 'Login realizado com sucesso'
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
}; 