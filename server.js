const express = require('express');
const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');

// Inicializar Firebase
const serviceAccount = require('./wrtmin-service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();
const PORT = 5000;

// Middleware básico
app.use(express.json());

// Middleware CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, user-id');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Rota de teste
app.get('/api/test', (req, res) => {
  res.json({ message: 'API funcionando!' });
});

// Rota de login
app.post('/api/auth/login', async (req, res) => {
  console.log('🔐 Requisição de login recebida:', { 
    body: req.body,
    headers: req.headers,
    method: req.method,
    url: req.url
  });
  
  try {
    const { email, senha } = req.body;
    
    // Validar dados
    if (!email || !senha) {
      console.log('❌ Dados inválidos:', { email: !!email, senha: !!senha });
      return res.status(400).json({ 
        success: false, 
        error: 'Email e senha obrigatórios' 
      });
    }
    
    // Buscar usuário no Firebase
    const userQuery = await db.collection('users').where('email', '==', email).get();
    
    if (userQuery.empty) {
      return res.status(401).json({ 
        success: false, 
        error: 'Usuário não encontrado' 
      });
    }
    
    const userDoc = userQuery.docs[0];
    const userData = userDoc.data();
    
    // Verificar senha com bcrypt
    const senhaValida = await bcrypt.compare(senha, userData.senha);
    if (!senhaValida) {
      return res.status(401).json({ 
        success: false, 
        error: 'Senha incorreta' 
      });
    }
    
    // Sucesso
    res.json({
      success: true,
      usuario: {
        id: userDoc.id,
        nome: userData.nome,
        email: userData.email
      },
      message: 'Login realizado com sucesso'
    });
    
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    });
  }
});

// Rota de cadastro
app.post('/api/auth/register', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    
    // Validar dados
    if (!nome || !email || !senha) {
      return res.status(400).json({ 
        success: false, 
        error: 'Nome, email e senha obrigatórios' 
      });
    }
    
    // Verificar se email já existe
    const userQuery = await db.collection('users').where('email', '==', email).get();
    
    if (!userQuery.empty) {
      return res.status(409).json({ 
        success: false, 
        error: 'Email já cadastrado' 
      });
    }
    
    // Hash da senha
    const saltRounds = 12;
    const senhaHash = await bcrypt.hash(senha, saltRounds);
    
    // Criar usuário
    const docRef = await db.collection('users').add({
      nome,
      email,
      senha: senhaHash,
      dataCriacao: new Date().toISOString()
    });
    
    res.status(201).json({
      success: true,
      usuario: {
        id: docRef.id,
        nome,
        email
      },
      message: 'Usuário cadastrado com sucesso'
    });
    
  } catch (error) {
    console.error('Erro no cadastro:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    });
  }
});

// Rota para buscar notas
app.get('/api/notas', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        error: 'userId obrigatório' 
      });
    }
    
    const notasQuery = await db.collection('notas').where('userId', '==', userId).get();
    const notas = [];
    
    notasQuery.forEach(doc => {
      notas.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json({
      success: true,
      notas
    });
    
  } catch (error) {
    console.error('Erro ao buscar notas:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    });
  }
});

// Rota para criar nota
app.post('/api/notas', async (req, res) => {
  try {
    const { titulo, conteudo, userId } = req.body;
    
    if (!titulo || !conteudo || !userId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Título, conteúdo e userId obrigatórios' 
      });
    }
    
    const docRef = await db.collection('notas').add({
      titulo,
      conteudo,
      userId,
      dataCriacao: new Date().toISOString(),
      dataModificacao: new Date().toISOString()
    });
    
    res.status(201).json({
      success: true,
      nota: {
        id: docRef.id,
        titulo,
        conteudo,
        userId
      },
      message: 'Nota criada com sucesso'
    });
    
  } catch (error) {
    console.error('Erro ao criar nota:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    });
  }
});

// Rota para atualizar nota
app.put('/api/notas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, conteudo } = req.body;
    
    if (!titulo || !conteudo) {
      return res.status(400).json({ 
        success: false, 
        error: 'Título e conteúdo obrigatórios' 
      });
    }
    
    await db.collection('notas').doc(id).update({
      titulo,
      conteudo,
      dataModificacao: new Date().toISOString()
    });
    
    res.json({
      success: true,
      message: 'Nota atualizada com sucesso'
    });
    
  } catch (error) {
    console.error('Erro ao atualizar nota:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    });
  }
});

// Rota para deletar nota
app.delete('/api/notas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.collection('notas').doc(id).delete();
    
    res.json({
      success: true,
      message: 'Nota deletada com sucesso'
    });
    
  } catch (error) {
    console.error('Erro ao deletar nota:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Teste: http://localhost:${PORT}/api/test`);
}); 