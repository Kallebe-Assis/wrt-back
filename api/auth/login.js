const { db } = require('../firebase-config');

module.exports = async function handler(req, res) {
  // Permitir CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }
  
  try {
    const { email, senha } = req.body;
    
    console.log('🔍 Login - Dados recebidos:', { email, senha });
    
    // Validar dados
    if (!email || !senha) {
      console.log('❌ Login - Dados inválidos');
      return res.status(400).json({ 
        success: false, 
        error: 'Email e senha obrigatórios' 
      });
    }
    
    // Buscar usuário no Firebase
    console.log('🔍 Login - Buscando usuário:', email);
    const userQuery = await db.collection('users').where('email', '==', email).get();
    
    if (userQuery.empty) {
      console.log('❌ Login - Usuário não encontrado');
      return res.status(401).json({ 
        success: false, 
        error: 'Email ou senha inválidos' 
      });
    }
    
    const userDoc = userQuery.docs[0];
    const userData = userDoc.data();
    
    console.log('✅ Login - Usuário encontrado:', {
      id: userDoc.id,
      nome: userData.nome,
      email: userData.email,
      senhaBanco: userData.senha ? '***' + userData.senha.slice(-3) : 'N/A'
    });
    
    // Verificar senha
    console.log('🔍 Login - Comparando senhas:', {
      senhaRecebida: senha,
      senhaBanco: userData.senha
    });
    
    if (userData.senha !== senha) {
      console.log('❌ Login - Senha incorreta');
      return res.status(401).json({ 
        success: false, 
        error: 'Email ou senha inválidos' 
      });
    }
    
    // Sucesso
    res.json({
      success: true,
      usuario: {
        id: userDoc.id,
        nome: userData.nome,
        email: userData.email
      },
      message: 'Login realizado com sucesso'
    });
    
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    });
  }
}; 