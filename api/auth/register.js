const { initializeFirebase } = require('../../config/firebase');
const bcrypt = require('bcryptjs');

module.exports = async function handler(req, res) {
  console.log('🚀 === REGISTER ENDPOINT INICIADO ===');
  console.log('📅 Timestamp:', new Date().toISOString());
  console.log('🌐 Origin:', req.headers.origin);
  console.log('🔗 Method:', req.method);
  console.log('📋 Headers:', JSON.stringify(req.headers, null, 2));
  
  // CORS EXPLÍCITO - igual ao login
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
    
    const { nome, email, senha } = req.body || {};
    console.log('👤 Nome extraído:', nome);
    console.log('📧 Email extraído:', email);
    console.log('🔑 Senha extraída:', senha ? '***' : 'undefined');
    console.log('👤 Nome type:', typeof nome);
    console.log('📧 Email type:', typeof email);
    console.log('🔑 Senha type:', typeof senha);

    if (!nome || !email || !senha) {
      console.log('❌ ERRO: Campos obrigatórios faltando');
      console.log('❌ Nome presente:', !!nome);
      console.log('❌ Email presente:', !!email);
      console.log('❌ Senha presente:', !!senha);
      return res.status(400).json({
        success: false,
        error: 'Nome, email e senha são obrigatórios'
      });
    }

    console.log('✅ Validação de campos obrigatórios OK');
    
    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailValido = emailRegex.test(email);
    console.log('📧 Email válido:', emailValido);
    console.log('📧 Email testado:', email);
    
    if (!emailValido) {
      console.log('❌ Formato de email inválido');
      return res.status(400).json({
        success: false,
        error: 'Formato de email inválido'
      });
    }

    // Validar senha (mínimo 6 caracteres)
    const senhaValida = senha.length >= 6;
    console.log('🔑 Senha válida (>=6 chars):', senhaValida);
    console.log('🔑 Tamanho da senha:', senha.length);
    
    if (!senhaValida) {
      console.log('❌ Senha muito curta');
      return res.status(400).json({
        success: false,
        error: 'Senha deve ter pelo menos 6 caracteres'
      });
    }

    console.log('✅ Validações de formato OK');
    console.log('🔥 === CONECTANDO AO FIREBASE ===');

    // Conectar ao Firebase
    const db = initializeFirebase();
    console.log('✅ Firebase inicializado');
    
    // Verificar se o email já existe
    console.log('🔍 Verificando se email já existe:', email);
    const existingUserQuery = await db.collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();
    
    console.log('📊 Query de verificação executada');
    console.log('📊 Usuários encontrados com este email:', existingUserQuery.size);
    console.log('📊 Email já existe:', !existingUserQuery.empty);

    if (!existingUserQuery.empty) {
      console.log('❌ Email já cadastrado');
      return res.status(409).json({
        success: false,
        error: 'Email já cadastrado'
      });
    }

    console.log('✅ Email disponível para cadastro');
    console.log('🔐 === HASHANDO SENHA ===');

    // Hash da senha
    console.log('🔐 Iniciando hash da senha...');
    const hashedPassword = await bcrypt.hash(senha, 12);
    console.log('🔐 Senha hasheada com sucesso');
    console.log('🔐 Hash gerado:', hashedPassword ? '***' : 'undefined');

    // Criar novo usuário
    const newUser = {
      nome: nome,
      email: email,
      senha: hashedPassword,
      ativo: true,
      dataCriacao: new Date().toISOString(),
      dataModificacao: new Date().toISOString()
    };
    
    console.log('👤 Dados do novo usuário:', {
      nome: newUser.nome,
      email: newUser.email,
      senha: '***',
      ativo: newUser.ativo,
      dataCriacao: newUser.dataCriacao
    });

    console.log('💾 === SALVANDO NO FIREBASE ===');
    
    // Salvar no banco
    const userRef = await db.collection('users').add(newUser);
    console.log('✅ Usuário salvo no Firebase');
    console.log('🆔 ID do usuário criado:', userRef.id);

    const responseData = {
      success: true,
      usuario: {
        id: userRef.id,
        nome: newUser.nome,
        email: newUser.email
      },
      message: 'Usuário registrado com sucesso'
    };
    
    console.log('🎉 === REGISTER SUCESSO ===');
    console.log('📤 Resposta sendo enviada:', JSON.stringify(responseData, null, 2));
    res.status(201).json(responseData);
    console.log('✅ Resposta enviada com sucesso');

  } catch (error) {
    console.error('💥 === ERRO NO REGISTER ===');
    console.error('💥 Error message:', error.message);
    console.error('💥 Error stack:', error.stack);
    console.error('💥 Error name:', error.name);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
  
  console.log('🏁 === REGISTER ENDPOINT FINALIZADO ===');
} 