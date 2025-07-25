const { initializeFirebase } = require('../../config/firebase');

module.exports = async function handler(req, res) {
  // CORS EXPLÍCITO
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email e senha obrigatórios' });
    }
    const db = initializeFirebase();
    const userQuery = await db.collection('users').where('email', '==', email).limit(1).get();
    if (userQuery.empty) {
      return res.status(401).json({ success: false, error: 'Usuário não encontrado' });
    }
    const userDoc = userQuery.docs[0];
    const userData = userDoc.data();
    if (userData.senha !== password) {
      return res.status(401).json({ success: false, error: 'Senha incorreta' });
    }
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