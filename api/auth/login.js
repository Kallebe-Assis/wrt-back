const { initializeFirebase, getFirestore } = require('../../config/firebase');
const bcrypt = require('bcryptjs');

export default function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, user-id, X-Requested-With');

  // Responder a requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
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

    // Logs de debug
    console.log('🔍 Login - Headers:', req.headers);
    console.log('🔍 Login - Body:', req.body);
    console.log('🔍 Login - Body type:', typeof req.body);

    const { email, password, senha } = req.body;

    // Logs de debug dos campos
    console.log('🔍 Login - Email:', email);
    console.log('🔍 Login - Password:', password);
    console.log('🔍 Login - Senha:', senha);

    // Validação básica - aceitar tanto 'password' quanto 'senha'
    const userPassword = password || senha;
    
    if (!email || !userPassword) {
      console.log('❌ Login - Validação falhou:', { email, userPassword });
      return res.status(400).json({
        success: false,
        error: 'Email e senha são obrigatórios',
        received: { email, hasPassword: !!userPassword }
      });
    }

    // Tentar usar Firebase real primeiro
    try {
      console.log('🔍 Tentando autenticar com Firebase real...');
      const db = initializeFirebase();
      
      // Buscar usuário no banco real
      const userQuery = await db.collection('users')
        .where('email', '==', email)
        .limit(1)
        .get();

      if (!userQuery.empty) {
        const userDoc = userQuery.docs[0];
        const userData = userDoc.data();
        
        console.log('✅ Usuário encontrado no banco real:', userData.email);
        console.log('🔍 Debug - ID do usuário:', userDoc.id);
        console.log('🔍 Debug - Nome:', userData.nome);
        console.log('🔍 Debug - Email:', userData.email);
        console.log('🔍 Debug - Senha hasheada:', userData.senha ? 'Sim' : 'Não');
        
        // Verificar senha hasheada
        let passwordValid = false;
        
        if (userData.senha) {
          try {
            console.log('🔍 Verificando senha hasheada...');
            passwordValid = await bcrypt.compare(userPassword, userData.senha);
            console.log('🔍 Resultado da verificação:', passwordValid);
          } catch (bcryptError) {
            console.log('⚠️ Erro ao verificar hash:', bcryptError.message);
            passwordValid = false;
          }
        } else {
          console.log('❌ Senha não encontrada no banco');
        }
        
        if (passwordValid) {
          console.log('✅ Senha válida para usuário real');
          
          // Gerar token JWT mock (em produção seria um token real)
          const token = `mock-jwt-token-${userDoc.id}-${Date.now()}`;

          // Retornar dados do usuário (sem a senha)
          const { senha: _, ...userDataClean } = userData;
          
          res.status(200).json({
            success: true,
            usuario: {
              id: userDoc.id,
              ...userDataClean
            },
            token: token,
            message: 'Login realizado com sucesso (banco real)'
          });
          return;
        } else {
          console.log('❌ Senha inválida para usuário real');
        }
      } else {
        console.log('❌ Usuário não encontrado no banco real');
      }
    } catch (firebaseError) {
      console.log('⚠️ Erro ao conectar com Firebase, usando dados mock:', firebaseError.message);
    }

    // Fallback para dados mock se Firebase falhar
    console.log('🔄 Usando dados mock como fallback...');
    
    // Dados mock de usuários para teste
    const mockUsers = {
      'user1@test.com': {
        id: 'user1',
        name: 'Usuário Teste 1',
        email: 'user1@test.com',
        password: '123456'
      },
      'user2@test.com': {
        id: 'user2',
        name: 'Usuário Teste 2',
        email: 'user2@test.com',
        password: '123456'
      },
      'teste@wrtmind.com': {
        id: 'user1',
        name: 'Usuário Teste 1',
        email: 'teste@wrtmind.com',
        password: '123456'
      },
      'kallebe@g2telecom.com.br': {
        id: 'kallebe',
        name: 'Kallebe',
        email: 'kallebe@g2telecom.com.br',
        password: '123456'
      }
    };

    const user = mockUsers[email];

    // Verificar se o usuário existe e a senha está correta
    if (!user || user.password !== userPassword) {
      console.log('❌ Login - Credenciais inválidas:', { email, userPassword, userExists: !!user });
      return res.status(401).json({
        success: false,
        error: 'Email ou senha inválidos'
      });
    }

    // Gerar token JWT mock (em produção seria um token real)
    const token = `mock-jwt-token-${user.id}-${Date.now()}`;

    // Retornar dados do usuário (sem a senha) e token
    const { password: _, ...userData } = user;

    console.log('✅ Login - Sucesso (mock):', { email, userId: user.id });

    res.status(200).json({
      success: true,
      usuario: userData, // Mudança: 'user' -> 'usuario' para compatibilidade com frontend
      token: token,
      message: 'Login realizado com sucesso (mock)'
    });

  } catch (error) {
    console.error('❌ Erro no endpoint /auth/login:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
} 