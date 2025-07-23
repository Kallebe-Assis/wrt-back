require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Configuração centralizada
const { config, validateConfig } = require('./src/config/environment');

// Inicializar Firebase
const { connectToFirebase } = require('./src/config/database');
const firebaseDB = connectToFirebase();
const firebaseInitialized = !!firebaseDB;

// Importar rotas apenas se Firebase estiver disponível
let authRoutes, linksRoutes, syncRoutes, notasRoutes, categoriasRoutes, logsRoutes, adminRoutes;

if (firebaseInitialized) {
  try {
    authRoutes = require('./routes/auth');
    linksRoutes = require('./routes/links');
    syncRoutes = require('./routes/sync');
    notasRoutes = require('./routes/notas');
    categoriasRoutes = require('./routes/categorias');
    logsRoutes = require('./routes/logs');
    adminRoutes = require('./routes/admin');
  } catch (error) {
    console.log('⚠️ Algumas rotas não puderam ser carregadas:', error.message);
  }
}

const app = express();
const PORT = config.PORT;

// Validar configuração
validateConfig();

// Middleware
app.use(cors({
  origin: config.ALLOWED_ORIGINS,
  credentials: true
}));

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Rotas condicionais
if (firebaseInitialized && authRoutes) {
  app.use('/api/auth', authRoutes);
  app.use('/api/links', linksRoutes);
  app.use('/api/sync', syncRoutes);
  app.use('/api/notas', notasRoutes);
  app.use('/api/categorias', categoriasRoutes);
  app.use('/api/logs', logsRoutes);
  app.use('/api/admin', adminRoutes);
  console.log('✅ Rotas da API carregadas');
} else {
  console.log('⚠️ Rotas da API não carregadas - Firebase não disponível');
}

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'WRTmind Backend API funcionando!',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
    firebase: firebaseInitialized ? 'connected' : 'not_configured'
  });
});

// Rota de teste
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API funcionando!',
    firebase: firebaseInitialized ? 'connected' : 'not_configured'
  });
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({ 
    message: 'WRTmind Backend API',
    version: '1.0.0',
    firebase: firebaseInitialized ? 'connected' : 'not_configured',
    endpoints: {
      health: '/api/health',
      test: '/api/test',
      ...(firebaseInitialized && {
        auth: '/api/auth',
        notes: '/api/notas',
        links: '/api/links',
        categories: '/api/categorias'
      })
    },
    setup: firebaseInitialized ? 'ready' : 'needs_credentials'
  });
});

// Tratamento de erros global
process.on('uncaughtException', (error) => {
  console.error('Erro não capturado:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promise rejeitada não tratada:', reason);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📡 API disponível em: http://localhost:${PORT}/api`);
  console.log(`🔧 Firebase: ${firebaseInitialized ? 'Conectado' : 'Não configurado'}`);
}); 