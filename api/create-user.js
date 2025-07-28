const { db } = require('./firebase-config-vercel');
const bcrypt = require('bcryptjs');

module.exports = async function handler(req, res) {
  // Tratar preflight OPTIONS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Apenas POST permitido
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Método não permitido',
      allowedMethods: ['POST']
    });
  }

  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({
      success: false,
      error: 'Nome, email e senha são obrigatórios'
    });
  }

  try {
    console.log('👤 Criando usuário:', { nome, email, senha: senha ? '***' : 'não fornecida' });

    // Verificar se usuário já existe
    const usuariosRef = db.collection('users');
    const query = await usuariosRef.where('email', '==', email).limit(1).get();

    if (!query.empty) {
      console.log('❌ Usuário já existe:', email);
      return res.status(409).json({
        success: false,
        error: 'Usuário já existe',
        message: `Usuário com email ${email} já está cadastrado`
      });
    }

    // Hash da senha
    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(senha, saltRounds);

    // Criar usuário
    const novoUsuario = {
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      senha: senhaHash,
      dataCriacao: new Date(),
      ativo: true
    };

    const docRef = await usuariosRef.add(novoUsuario);

    console.log('✅ Usuário criado com sucesso:', { 
      id: docRef.id,
      nome: novoUsuario.nome,
      email: novoUsuario.email
    });

    // Retornar dados do usuário (sem senha)
    const { senha: _, ...userInfo } = novoUsuario;
    
    res.status(201).json({
      success: true,
      user: {
        id: docRef.id,
        ...userInfo
      },
      message: 'Usuário criado com sucesso'
    });

  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
}; 