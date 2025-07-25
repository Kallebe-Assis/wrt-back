const { initializeFirebase } = require('../../config/firebase');

module.exports = async function handler(req, res) {
  // CORS EXPLÍCITO
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    console.log('=== LOGIN DEBUG ===');
    console.log('Method:', req.method);
    console.log('Headers:', req.headers);
    console.log('Body raw:', req.body);
    console.log('Body type:', typeof req.body);
    
    // Parse do JSON body para Vercel
    let body = {};
    if (req.body) {
      if (typeof req.body === 'string') {
        try {
          body = JSON.parse(req.body);
        } catch (e) {
          console.log('Erro ao fazer parse do JSON:', e);
          body = {};
        }
      } else {
        body = req.body;
      }
    }

    console.log('Body parsed:', body);
    const { email, password } = body;
    console.log('Email:', email);
    console.log('Password:', password ? '***' : 'undefined');
    
    if (!email || !password) {
      console.log('ERRO: Email ou senha faltando');
      return res.status(400).json({ success: false, error: 'Email e senha obrigatórios' });
    }
    
    console.log('Conectando ao Firebase...');
    const db = initializeFirebase();
    const userQuery = await db.collection('users').where('email', '==', email).limit(1).get();
    
    if (userQuery.empty) {
      console.log('Usuário não encontrado');
      return res.status(401).json({ success: false, error: 'Usuário não encontrado' });
    }
    
    const userDoc = userQuery.docs[0];
    const userData = userDoc.data();
    console.log('Usuário encontrado:', userData.email);
    
    if (userData.senha !== password) {
      console.log('Senha incorreta');
      return res.status(401).json({ success: false, error: 'Senha incorreta' });
    }
    
    console.log('Login OK!');
    res.status(200).json({
      success: true,
      usuario: { id: userDoc.id, nome: userData.nome, email: userData.email },
      token: 'token-simples',
      message: 'Login OK'
    });
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ success: false, error: 'Erro interno' });
  }
} 