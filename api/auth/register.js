const { initializeFirebase } = require('../../config/firebase');

module.exports = async function handler(req, res) {
  console.log('=== REGISTER SIMPLES ===');
  
  try {
    // 1. Pegar dados do body
    const { nome, email, senha } = req.body;
    console.log('Nome recebido:', nome);
    console.log('Email recebido:', email);
    console.log('Senha recebida:', senha ? '***' : 'undefined');
    
    // 2. Validar se tem todos os campos
    if (!nome || !email || !senha) {
      console.log('ERRO: Campos obrigatórios faltando');
      return res.status(400).json({ 
        success: false, 
        error: 'Nome, email e senha são obrigatórios' 
      });
    }
    
    // 3. Conectar ao Firebase
    console.log('Conectando ao Firebase...');
    const db = initializeFirebase();
    console.log('Firebase conectado');
    
    // 4. Verificar se email já existe
    console.log('Verificando se email já existe:', email);
    const existingUser = await db.collection('users').where('email', '==', email).get();
    console.log('Usuários com este email:', existingUser.size);
    
    if (!existingUser.empty) {
      console.log('Email já cadastrado');
      return res.status(409).json({ 
        success: false, 
        error: 'Email já cadastrado' 
      });
    }
    
    // 5. Criar novo usuário (senha sem hash por simplicidade)
    console.log('Criando novo usuário...');
    const newUser = {
      nome: nome,
      email: email,
      senha: senha, // Senha sem hash por simplicidade
      ativo: true,
      dataCriacao: new Date().toISOString()
    };
    
    // 6. Salvar no banco
    const userRef = await db.collection('users').add(newUser);
    console.log('Usuário criado com ID:', userRef.id);
    
    // 7. SUCESSO!
    console.log('REGISTER SUCESSO!');
    res.status(201).json({
      success: true,
      usuario: {
        id: userRef.id,
        nome: newUser.nome,
        email: newUser.email
      },
      message: 'Usuário registrado com sucesso'
    });
    
  } catch (error) {
    console.error('ERRO NO REGISTER:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    });
  }
}; 