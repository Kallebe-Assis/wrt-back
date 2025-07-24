require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Configuração CORS mais permissiva
app.use(cors({
  origin: ['http://localhost:3000', 'https://wrtmind.vercel.app', 'https://wrt-frontend.vercel.app', '*'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'user-id', 'X-Requested-With']
}));

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro no servidor:', err);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// Rota de health check
app.get('/api/health', (req, res) => {
  try {
    res.json({ 
      status: 'OK', 
      message: 'WRTmind Backend API funcionando!',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('Erro na rota health:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
});

// Rota de debug
app.get('/api/debug', (req, res) => {
  try {
    res.json({ 
      message: 'Debug das variáveis de ambiente',
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID ? '✅ Definido' : '❌ Não definido',
      FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY ? '✅ Definido' : '❌ Não definido',
      FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL ? '✅ Definido' : '❌ Não definido',
      JWT_SECRET: process.env.JWT_SECRET ? '✅ Definido' : '❌ Não definido',
      SESSION_SECRET: process.env.SESSION_SECRET ? '✅ Definido' : '❌ Não definido',
      ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS ? '✅ Definido' : '❌ Não definido',
      NODE_ENV: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('Erro na rota debug:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
});

// Rota de teste
app.get('/api/test', (req, res) => {
  try {
    res.json({ 
      message: 'API funcionando!',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro na rota test:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
});

// Rota para links/pendencias (mock)
app.get('/api/links/pendencias', (req, res) => {
  try {
    res.json({ 
      message: 'Endpoint de pendências funcionando',
      data: [],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro na rota pendencias:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
});

// Rota raiz
app.get('/', (req, res) => {
  try {
    res.json({ 
      message: 'WRTmind Backend API',
      version: '1.0.0',
      status: 'running',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro na rota raiz:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
});

// Middleware para capturar erros não tratados
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint não encontrado',
    path: req.path,
    method: req.method
  });
});

// Tratamento de erros global
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  });
}

module.exports = app; 