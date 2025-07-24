require('dotenv').config();

console.log('🔍 Testando configuração do servidor...');

// Testar configuração do ambiente
const { config, validateConfig } = require('./src/config/environment.js');
console.log('📋 Configuração:', {
  PORT: config.PORT,
  NODE_ENV: config.NODE_ENV,
  ALLOWED_ORIGINS: config.ALLOWED_ORIGINS,
  FIREBASE_PROJECT_ID: config.FIREBASE_PROJECT_ID ? '✅ Definido' : '❌ Não definido',
  FIREBASE_PRIVATE_KEY: config.FIREBASE_PRIVATE_KEY ? '✅ Definido' : '❌ Não definido',
  FIREBASE_CLIENT_EMAIL: config.FIREBASE_CLIENT_EMAIL ? '✅ Definido' : '❌ Não definido'
});

// Testar Firebase
const { connectToFirebase } = require('./src/config/database.js');
const firebaseDB = connectToFirebase();
console.log('🔥 Firebase:', firebaseDB ? '✅ Conectado' : '❌ Não conectado');

// Testar importação de rotas
try {
  const adminRoutes = require('./routes/admin');
  console.log('🛣️ Rotas admin:', '✅ Carregadas');
} catch (error) {
  console.log('🛣️ Rotas admin:', '❌ Erro ao carregar:', error.message);
}

// Testar middleware
try {
  const { errorHandler, catchUnhandledErrors } = require('./middleware/errorHandler');
  const { asyncHandler } = require('./middleware/asyncHandler');
  console.log('🛡️ Middleware:', '✅ Carregado');
} catch (error) {
  console.log('🛡️ Middleware:', '❌ Erro ao carregar:', error.message);
}

console.log('✅ Teste de configuração concluído!'); 