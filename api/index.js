const express = require('express');
const cors = require('cors');

const app = express();

// Configuração CORS básica
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'user-id', 'X-Requested-With']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'WRTmind Backend API funcionando!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rota de debug
app.get('/api/debug', (req, res) => {
  res.json({ 
    message: 'Debug das variáveis de ambiente',
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID ? '✅ Definido' : '❌ Não definido',
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY ? '✅ Definido' : '❌ Não definido',
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL ? '✅ Definido' : '❌ Não definido',
    JWT_SECRET: process.env.JWT_SECRET ? '✅ Definido' : '❌ Não definido',
    SESSION_SECRET: process.env.SESSION_SECRET ? '✅ Definido' : '❌ Não definido',
    NODE_ENV: process.env.NODE_ENV || 'development'
  });
});

// Rota de teste
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Rota para links/pendencias (mock)
app.get('/api/links/pendencias', (req, res) => {
  res.json({ 
    message: 'Endpoint de pendências funcionando',
    data: [],
    timestamp: new Date().toISOString()
  });
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({ 
    message: 'WRTmind Backend API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
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
app.use((err, req, res, next) => {
  console.error('Erro no servidor:', err);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// Para desenvolvimento local
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  });
}

module.exports = app; 