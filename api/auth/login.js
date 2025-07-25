const { initializeFirebase } = require('../../config/firebase');

module.exports = async function handler(req, res) {
  console.log('🚀 === LOGIN ENDPOINT INICIADO ===');
  console.log('📅 Timestamp:', new Date().toISOString());
  console.log('🌐 Origin:', req.headers.origin);
  console.log('🔗 Method:', req.method);
  console.log('📋 Headers:', JSON.stringify(req.headers, null, 2));

  try {
    console.log('📦 === ANALISANDO BODY ===');
    console.log('📦 Body raw:', req.body);
    console.log('📦 Body type:', typeof req.body);
    console.log('📦 Body keys:', req.body ? Object.keys(req.body) : 'null');
    console.log('📦 Body stringified:', JSON.stringify(req.body, null, 2));
    
    // Vercel já faz parse automático do JSON
    const { email, senha } = req.body || {};
    console.log('📧 Email extraído:', email);
    console.log('🔑 Senha extraída:', senha ? '***' : 'undefined');
    console.log('📧 Email type:', typeof email);
    console.log('🔑 Senha type:', typeof senha);
    
    if (!email || !senha) {
      console.log('❌ ERRO: Email ou senha faltando');
      console.log('❌ Email presente:', !!email);
      console.log('❌ Senha presente:', !!senha);
      return res.status(400).json({ success: false, error: 'Email e senha obrigatórios' });
    }
    
    console.log('✅ Validação de campos OK');
    console.log('🔥 === CONECTANDO AO FIREBASE ===');
    
    const db = initializeFirebase();
    console.log('✅ Firebase inicializado');
    
    console.log('🔍 Buscando usuário com email:', email);
    const userQuery = await db.collection('users').where('email', '==', email).limit(1).get();
    console.log('📊 Query executada');
    console.log('📊 Resultados encontrados:', userQuery.size);
    console.log('📊 Query empty:', userQuery.empty);
    
    if (userQuery.empty) {
      console.log('❌ Usuário não encontrado no Firebase');
      return res.status(401).json({ success: false, error: 'Usuário não encontrado' });
    }
    
    const userDoc = userQuery.docs[0];
    const userData = userDoc.data();
    console.log('✅ Usuário encontrado no Firebase');
    console.log('🆔 User ID:', userDoc.id);
    console.log('📧 User Email:', userData.email);
    console.log('👤 User Nome:', userData.nome);
    console.log('🔑 User Senha (hash):', userData.senha ? '***' : 'undefined');
    
    console.log('🔐 === VERIFICANDO SENHA ===');
    console.log('🔐 Senha fornecida:', senha);
    console.log('🔐 Senha no banco:', userData.senha);
    console.log('🔐 Senhas iguais:', userData.senha === senha);
    
    if (userData.senha !== senha) {
      console.log('❌ Senha incorreta');
      return res.status(401).json({ success: false, error: 'Senha incorreta' });
    }
    
    console.log('✅ Senha correta!');
    console.log('🎉 === LOGIN SUCESSO ===');
    
    const responseData = {
      success: true,
      usuario: { id: userDoc.id, nome: userData.nome, email: userData.email },
      token: 'token-simples',
      message: 'Login OK'
    };
    
    console.log('📤 Resposta sendo enviada:', JSON.stringify(responseData, null, 2));
    res.status(200).json(responseData);
    console.log('✅ Resposta enviada com sucesso');
    
  } catch (error) {
    console.error('💥 === ERRO NO LOGIN ===');
    console.error('💥 Error message:', error.message);
    console.error('💥 Error stack:', error.stack);
    console.error('💥 Error name:', error.name);
    res.status(500).json({ success: false, error: 'Erro interno' });
  }
  
  console.log('🏁 === LOGIN ENDPOINT FINALIZADO ===');
} 