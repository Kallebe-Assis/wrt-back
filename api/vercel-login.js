const admin = require('firebase-admin');

// Inicializar Firebase
if (!admin.apps.length) {
  const serviceAccount = require('../wrtmin-service-account.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

module.exports = async function handler(req, res) {
  // CORS
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
    
    // Validação
    if (!email || !senha) {
      return res.status(400).json({
        success: false,
        error: 'Email e senha obrigatórios'
      });
    }
    
    // Buscar usuário
    const userQuery = await db.collection('users').where('email', '==', email).get();
    
    if (userQuery.empty) {
      return res.status(401).json({
        success: false,
        error: 'Email ou senha inválidos'
      });
    }
    
    const userDoc = userQuery.docs[0];
    const userData = userDoc.data();
    
    // Verificar senha
    if (userData.senha !== senha) {
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