const { initializeFirebase, getFirestore } = require('../../config/firebase');
const bcrypt = require('bcryptjs');

module.exports = function handler(req, res) {
  // CORS FIXO E DIRETO - SEM CONDIÇÕES
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,user-id,X-Requested-With');

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

    // Conectar ao Firebase
    const db = initializeFirebase();
    
    // Verificar se o email já existe
    const existingUserQuery = await db.collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (!existingUserQuery.empty) {
      return res.status(409).json({
        success: false,
        error: 'Email já cadastrado'
      });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(userPassword, 12);

    // Criar novo usuário
    const newUser = {
      nome: userName,
      email: email,
      senha: hashedPassword,
      ativo: true,
      dataCriacao: new Date().toISOString(),
      dataModificacao: new Date().toISOString()
    };

    // Salvar no banco
    const userRef = await db.collection('users').add(newUser);

    // Gerar token
    const token = `jwt-token-${userRef.id}-${Date.now()}`;

    // Retornar dados do usuário (sem a senha)
    const { senha: _, ...userDataClean } = newUser;

    res.status(201).json({
      success: true,
      usuario: {
        id: userRef.id,
        ...userDataClean
      },
      token: token,
      message: 'Usuário registrado com sucesso'
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
} 