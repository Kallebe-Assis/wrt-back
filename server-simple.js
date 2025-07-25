require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Importar apenas o que é necessário para o login
const { initializeFirebase } = require('./config/firebase');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Rota de teste simples
app.get('/api/test-simple', (req, res) => {
  res.json({
    success: true,
    message: 'Teste simples funcionando',
    timestamp: new Date().toISOString()
  });
});

// Rota de teste do Firebase
app.get('/api/test-firebase', async (req, res) => {
  try {
    console.log('1. Inicializando Firebase...');
    const db = initializeFirebase();
    console.log('2. Firebase inicializado com sucesso');
    
    console.log('3. Testando conexão com Firestore...');
    const testCollection = db.collection('test');
    console.log('4. Coleção test criada');
    
    console.log('5. Testando leitura de dados...');
    const snapshot = await testCollection.limit(1).get();
    console.log('6. Leitura realizada com sucesso');
    
    res.json({
      success: true,
      message: 'Firebase funcionando corretamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('ERRO NO TESTE FIREBASE:', error.message);
    res.status(500).json({
      success: false,
      error: 'Erro no teste Firebase: ' + error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Rota de login simplificada
app.post('/api/auth/login', async (req, res) => {
  console.log('=== LOGIN SIMPLES ===');
  console.log('Método da requisição:', req.method);
  console.log('Headers:', req.headers);
  
  try {
    // 1. Pegar dados do body
    const { email, senha } = req.body;
    console.log('Email recebido:', email);
    console.log('Senha recebida:', senha ? '***' : 'undefined');
    
    // 2. Validar se tem email e senha
    if (!email || !senha) {
      console.log('ERRO: Email ou senha faltando');
      return res.status(400).json({ 
        success: false, 
        error: 'Email e senha obrigatórios' 
      });
    }
    
    // 3. TESTE SIMPLES SEM FIREBASE
    console.log('Testando login simples...');
    if (email === 'kallebe@g2telecom.com.br' && senha === 'Amsterda309061') {
      console.log('LOGIN SUCESSO (simulado)!');
      res.status(200).json({
        success: true,
        usuario: {
          id: 'test-id-123',
          nome: 'Kallebe',
          email: email
        },
        message: 'Login realizado com sucesso (simulado)'
      });
      return;
    }
    
    // 4. Se não for o usuário de teste, tentar Firebase
    console.log('Tentando conectar ao Firebase...');
    try {
      console.log('Inicializando Firebase...');
      const db = initializeFirebase();
      console.log('Firebase conectado com sucesso');
      
      // 5. Buscar usuário
      console.log('Buscando usuário:', email);
      const userQuery = await db.collection('users').where('email', '==', email).get();
      console.log('Usuários encontrados:', userQuery.size);
      
      // 6. Verificar se encontrou
      if (userQuery.empty) {
        console.log('Usuário não encontrado');
        return res.status(401).json({ 
          success: false, 
          error: 'Usuário não encontrado' 
        });
      }
      
      // 7. Pegar dados do usuário
      const userDoc = userQuery.docs[0];
      const userData = userDoc.data();
      console.log('Usuário encontrado:', userData.email);
      
      // 8. Verificar senha (comparação direta)
      console.log('Verificando senha...');
      if (userData.senha !== senha) {
        console.log('Senha incorreta');
        return res.status(401).json({ 
          success: false, 
          error: 'Senha incorreta' 
        });
      }
      
      // 9. SUCESSO!
      console.log('LOGIN SUCESSO!');
      res.status(200).json({
        success: true,
        usuario: {
          id: userDoc.id,
          nome: userData.nome,
          email: userData.email
        },
        message: 'Login realizado com sucesso'
      });
      
    } catch (firebaseError) {
      console.error('ERRO NO FIREBASE:', firebaseError.message);
      console.error('Stack trace:', firebaseError.stack);
      return res.status(500).json({ 
        success: false, 
        error: 'Erro ao conectar com o banco de dados: ' + firebaseError.message 
      });
    }
    
  } catch (error) {
    console.error('ERRO NO LOGIN:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor: ' + error.message 
    });
  }
});

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'WRTmind Backend API funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🧪 Teste simples: http://localhost:${PORT}/api/test-simple`);
  console.log(`🔥 Teste Firebase: http://localhost:${PORT}/api/test-firebase`);
  console.log(`🔐 Login: http://localhost:${PORT}/api/auth/login`);
}); 