require('dotenv').config();

const config = {
  // Server
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Firebase
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
  
  // Security
  JWT_SECRET: process.env.JWT_SECRET || 'default-jwt-secret',
  SESSION_SECRET: process.env.SESSION_SECRET || 'default-session-secret',
  

  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  
  // Logs
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  LOG_FILE: process.env.LOG_FILE || 'logs/app.log'
};

function validateConfig() {
  const required = ['FIREBASE_PROJECT_ID', 'FIREBASE_PRIVATE_KEY', 'FIREBASE_CLIENT_EMAIL'];
  const missing = required.filter(key => !config[key]);
  
  if (missing.length > 0) {
    console.log('⚠️ Configurações do Firebase não encontradas:', missing.join(', '));
    console.log('📝 O sistema funcionará sem Firebase (apenas armazenamento local)');
    return false;
  }
  
  return true;
}

module.exports = {
  config,
  validateConfig
}; 