require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Inicializar Firebase primeiro
const { initializeFirebase } = require('./config/firebase');
initializeFirebase();

// Importar rotas
const authRoutes = require('./routes/auth');
const linksRoutes = require('./routes/links');
const syncRoutes = require('./routes/sync');
const notasRoutes = require('./routes/notas');
const categoriasRoutes = require('./routes/categorias');
const logsRoutes = require('./routes/logs');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/links', linksRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/notas', notasRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/admin', adminRoutes);

// Rota de teste
app.get('/api/test', (req, res) => {
  res.json({ message: 'API funcionando!' });
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
}); 