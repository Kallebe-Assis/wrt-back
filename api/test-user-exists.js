const { db } = require('./firebase-config-vercel');

module.exports = async function handler(req, res) {
  // Tratar preflight OPTIONS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
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

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      error: 'Email é obrigatório'
    });
  }

  try {
    console.log('🔍 Verificando se usuário existe:', email);

    // Buscar usuário no Firebase
    const usuariosRef = db.collection('users');
    const query = await usuariosRef.where('email', '==', email).limit(1).get();

    if (query.empty) {
      console.log('❌ Usuário não encontrado:', email);
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado',
        message: `Usuário com email ${email} não existe no banco de dados`
      });
    }

    const userDoc = query.docs[0];
    const userData = userDoc.data();

    console.log('✅ Usuário encontrado:', { 
      email, 
      id: userDoc.id,
      nome: userData.nome,
      temSenha: !!userData.senha,
      dataCriacao: userData.dataCriacao
    });

    // Retornar informações do usuário (sem senha)
    const { senha: _, ...userInfo } = userData;
    
    res.json({
      success: true,
      user: {
        id: userDoc.id,
        ...userInfo
      },
      message: 'Usuário encontrado'
    });

  } catch (error) {
    console.error('❌ Erro ao verificar usuário:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
}; 