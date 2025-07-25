const { initializeFirebase, getFirestore } = require('../../config/firebase');
const bcrypt = require('bcryptjs');

export default function handler(req, res) {
  // Configurar CORS de forma mais robusta
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
  const origin = req.headers.origin;
  
  console.log('🌐 CORS - Origin recebido:', origin);
  console.log('🌐 CORS - Origins permitidos:', allowedOrigins);
  console.log('🌐 CORS - ALLOWED_ORIGINS env:', process.env.ALLOWED_ORIGINS);
  
  // Sempre permitir localhost:3000 para desenvolvimento
  if (origin === 'http://localhost:3000' || allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    console.log('✅ CORS - Origin permitido:', origin);
  } else {
    console.log('❌ CORS - Origin não permitido:', origin);
  }
  
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', process.env.CORS_ALLOWED_HEADERS || 'Content-Type,Authorization,user-id,X-Requested-With');

  // Responder a requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    console.log('🔄 CORS - Respondendo OPTIONS');
    res.status(200).end();
    return;
  }

  const { method } = req;

  try {
    if (method !== 'POST') {
      return res.status(405).json({
        success: false,
        error: 'Método não permitido',
        allowedMethods: ['POST']
      });
    }

    const { email, password, senha } = req.body;
    const userPassword = password || senha;
    
    if (!email || !userPassword) {
      return res.status(400).json({
        success: false,
        error: 'Email e senha são obrigatórios'
      });
    }

    // Conectar ao Firebase
    const db = initializeFirebase();
    
    // Buscar usuário no banco
    const userQuery = await db.collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (userQuery.empty) {
      return res.status(401).json({
        success: false,
        error: 'Email ou senha inválidos'
      });
    }

    const userDoc = userQuery.docs[0];
    const userData = userDoc.data();
    
    // Verificar senha hasheada
    let passwordValid = false;
    
    if (userData.senha) {
      try {
        passwordValid = await bcrypt.compare(userPassword, userData.senha);
      } catch (bcryptError) {
        console.error('Erro ao verificar senha:', bcryptError.message);
        passwordValid = false;
      }
    }
    
    if (!passwordValid) {
      return res.status(401).json({
        success: false,
        error: 'Email ou senha inválidos'
      });
    }

    // Gerar token
    const token = `jwt-token-${userDoc.id}-${Date.now()}`;

    // Retornar dados do usuário (sem a senha)
    const { senha: _, ...userDataClean } = userData;
    
    res.status(200).json({
      success: true,
      usuario: {
        id: userDoc.id,
        ...userDataClean
      },
      token: token,
      message: 'Login realizado com sucesso'
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
} 