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

    // Dados mock de usuários para teste (incluindo credenciais reais)
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

    // Verificar se o usuário existe e a senha está correta
    let user = null;
    
    // Primeiro tentar com o email exato
    if (mockUsers[email]) {
      user = mockUsers[email];
      console.log('🔍 Usuário encontrado por email exato:', user.id);
    }

    // Se não encontrou e é o email do Kallebe, verificar com senha real
    if (!user && email === 'kallebe@g2telecom.com.br' && userPassword === 'Amsterda309061') {
      user = {
        id: 'eUF9zbjEuU0G9f7ntD4R', // ID real do banco
        name: 'Kallebe',
        email: 'kallebe@g2telecom.com.br',
        password: 'Amsterda309061'
      };
      console.log('🔍 Usuário encontrado com credenciais reais do Kallebe');
    }

    console.log('🔍 Debug - Email recebido:', email);
    console.log('🔍 Debug - Senha recebida:', userPassword);
    console.log('🔍 Debug - Usuário encontrado:', user ? user.id : 'null');
    console.log('🔍 Debug - Senha do usuário:', user ? user.password : 'null');
    console.log('🔍 Debug - Senhas iguais?', user ? (user.password === userPassword) : 'N/A');
    console.log('🔍 Debug - Email é kallebe?', email === 'kallebe@g2telecom.com.br');
    console.log('🔍 Debug - Senha é Amsterda309061?', userPassword === 'Amsterda309061');
    console.log('🔍 Debug - Condição para credenciais reais:', !user && email === 'kallebe@g2telecom.com.br' && userPassword === 'Amsterda309061');

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

    console.log('✅ Login - Sucesso:', { email, userId: user.id });

    res.status(200).json({
      success: true,
      usuario: userData, // Mudança: 'user' -> 'usuario' para compatibilidade com frontend
      token: token,
      message: 'Login realizado com sucesso'
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