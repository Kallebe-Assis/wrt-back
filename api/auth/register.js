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

    const { name, email, password, nome, senha } = req.body;

    // Validação básica - aceitar tanto 'name' quanto 'nome'
    const userName = name || nome;
    const userPassword = password || senha;

    if (!userName || !email || !userPassword) {
      return res.status(400).json({
        success: false,
        error: 'Nome, email e senha são obrigatórios'
      });
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Formato de email inválido'
      });
    }

    // Validar senha (mínimo 6 caracteres)
    if (userPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Senha deve ter pelo menos 6 caracteres'
      });
    }

    // Simular verificação se o email já existe
    const existingEmails = ['user1@test.com', 'user2@test.com', 'teste@wrtmind.com', 'kallebe@g2telecom.com.br'];
    if (existingEmails.includes(email)) {
      return res.status(409).json({
        success: false,
        error: 'Email já cadastrado'
      });
    }

    // Gerar ID único para o novo usuário
    const newUserId = `user${Date.now()}`;

    // Criar novo usuário
    const newUser = {
      id: newUserId,
      name: userName,
      email: email,
      password: userPassword, // Em produção seria hash da senha
      createdAt: new Date().toISOString()
    };

    // Gerar token JWT mock
    const token = `mock-jwt-token-${newUser.id}-${Date.now()}`;

    // Retornar dados do usuário (sem a senha) e token
    const { password: _, ...userData } = newUser;

    res.status(201).json({
      success: true,
      usuario: userData, // Mudança: 'user' -> 'usuario' para compatibilidade com frontend
      token: token,
      message: 'Usuário registrado com sucesso'
    });

  } catch (error) {
    console.error('Erro no endpoint /auth/register:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
} 