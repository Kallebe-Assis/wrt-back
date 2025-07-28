const { db } = require('../firebase-config-vercel');
const bcrypt = require('bcryptjs');

module.exports = async function handler(req, res) {

  // Apenas POST permitido
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Método não permitido',
      allowedMethods: ['POST']
    });
  }

  const { email, senha, nome } = req.body;

  if (!email || !senha || !nome) {
    return res.status(400).json({
      success: false,
      error: 'Email, senha e nome são obrigatórios'
    });
  }

  try {
    console.log('📝 Tentativa de registro:', { email, nome, senha: senha ? '***' : 'não fornecida' });

    // Verificar se usuário já existe
    const usuariosRef = db.collection('usuarios');
    const query = await usuariosRef.where('email', '==', email).limit(1).get();

    if (!query.empty) {
      console.log('❌ Email já cadastrado:', email);
      return res.status(409).json({
        success: false,
        error: 'Email já cadastrado',
        message: 'Este email já está sendo usado'
      });
    }

    // Hash da senha
    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(senha, saltRounds);

    // Criar usuário
    const novoUsuario = {
      email,
      nome,
      senha: senhaHash,
      dataCriacao: new Date().toISOString(),
      dataModificacao: new Date().toISOString()
    };

    const docRef = await usuariosRef.add(novoUsuario);

    console.log('✅ Usuário registrado com sucesso:', { email, id: docRef.id });

    // Retornar dados do usuário (sem senha)
    const { senha: _, ...userInfo } = novoUsuario;

    res.status(201).json({
      success: true,
      user: {
        id: docRef.id,
        ...userInfo
      },
      message: 'Usuário registrado com sucesso'
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
}; 