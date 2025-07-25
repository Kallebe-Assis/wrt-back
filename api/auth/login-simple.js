module.exports = async function handler(req, res) {
  console.log('🚀 === LOGIN SIMPLE ENDPOINT ===');
  console.log('📅 Timestamp:', new Date().toISOString());
  console.log('🌐 Origin:', req.headers.origin);
  console.log('🔗 Method:', req.method);
  console.log('📋 Headers:', JSON.stringify(req.headers, null, 2));
  
  // CORS EXPLÍCITO
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  console.log('✅ CORS Headers configurados');
  
  if (req.method === 'OPTIONS') {
    console.log('🔄 Preflight OPTIONS - Respondendo 200');
    res.status(200).end();
    return;
  }

  try {
    console.log('📦 === ANALISANDO BODY ===');
    console.log('📦 Body raw:', req.body);
    console.log('📦 Body type:', typeof req.body);
    console.log('📦 Body keys:', req.body ? Object.keys(req.body) : 'null');
    console.log('📦 Body stringified:', JSON.stringify(req.body, null, 2));
    
    const { email, senha } = req.body || {};
    console.log('📧 Email extraído:', email);
    console.log('🔑 Senha extraída:', senha ? '***' : 'undefined');
    
    if (!email || !senha) {
      console.log('❌ ERRO: Email ou senha faltando');
      return res.status(400).json({ success: false, error: 'Email e senha obrigatórios' });
    }
    
    console.log('✅ Validação de campos OK');
    
    // SIMULAÇÃO SIMPLES - SEM FIREBASE
    if (email === 'kallebe@g2telecom.com.br' && senha === 'Amsterda309061') {
      console.log('✅ Login simulado com sucesso');
      
      const responseData = {
        success: true,
        usuario: { 
          id: 'test-id-123', 
          nome: 'Kallebe', 
          email: email 
        },
        token: 'token-simples',
        message: 'Login OK (simulado)'
      };
      
      console.log('📤 Resposta sendo enviada:', JSON.stringify(responseData, null, 2));
      res.status(200).json(responseData);
      console.log('✅ Resposta enviada com sucesso');
    } else {
      console.log('❌ Credenciais inválidas');
      res.status(401).json({ success: false, error: 'Credenciais inválidas' });
    }
    
  } catch (error) {
    console.error('💥 === ERRO NO LOGIN SIMPLE ===');
    console.error('💥 Error message:', error.message);
    console.error('💥 Error stack:', error.stack);
    res.status(500).json({ success: false, error: 'Erro interno' });
  }
  
  console.log('🏁 === LOGIN SIMPLE ENDPOINT FINALIZADO ===');
} 