const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: {
    error: 'Muitas requisições. Tente novamente em 15 minutos.'
  }
});

// Middleware de segurança
const securityMiddleware = (app) => {
  
  // Helmet para headers de segurança
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }));
  
  // Rate limiting
  app.use('/api/', limiter);
  
  // Sanitização de dados
  app.use((req, res, next) => {
    // Remover caracteres perigosos
    if (req.body) {
      Object.keys(req.body).forEach(key => {
        if (typeof req.body[key] === 'string') {
          req.body[key] = req.body[key].replace(/[<>]/g, '');
        }
      });
    }
    next();
  });
};

module.exports = securityMiddleware; 