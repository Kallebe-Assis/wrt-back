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

    const { email, password } = req.body;

    // Validação básica
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email e senha são obrigatórios'
      });
    }

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
      }
    };

    const user = mockUsers[email];

    // Verificar se o usuário existe e a senha está correta
    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        error: 'Email ou senha inválidos'
      });
    }

    // Gerar token JWT mock (em produção seria um token real)
    const token = `mock-jwt-token-${user.id}-${Date.now()}`;

    // Retornar dados do usuário (sem a senha) e token
    const { password: _, ...userData } = user;

    res.status(200).json({
      success: true,
      data: {
        user: userData,
        token: token
      },
      message: 'Login realizado com sucesso'
    });

  } catch (error) {
    console.error('Erro no endpoint /auth/login:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
} 