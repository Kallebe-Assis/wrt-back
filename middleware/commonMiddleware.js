// Middleware centralizado para todas as APIs
const rateLimit = new Map();

// CORS otimizado e seguro
const setupCORS = (res, req) => {
  const allowedOrigins = [
    'http://localhost:3000',
    'https://wrt-front.vercel.app',
    'https://wrtmind.vercel.app'
  ];
  
  const origin = req.headers.origin;
  const allowedOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, user-id, admin-key');
  res.setHeader('Access-Control-Max-Age', '86400');
  
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
};

// Rate limiting simples mas efetivo
const checkRateLimit = (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 60000; // 1 minuto
  const maxRequests = 100;
  
  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  const userLimit = rateLimit.get(ip);
  
  if (now > userLimit.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (userLimit.count >= maxRequests) {
    res.status(429).json({
      success: false,
      error: 'Muitas requisições. Tente novamente em 1 minuto.',
      retryAfter: Math.ceil((userLimit.resetTime - now) / 1000)
    });
    return false;
  }
  
  userLimit.count++;
  return true;
};

// Validação de entrada padronizada
const validateInput = (data, rules) => {
  const errors = [];
  
  for (const [field, rule] of Object.entries(rules)) {
    const value = data[field];
    
    if (rule.required && (!value && value !== 0 && value !== false)) {
      errors.push(`${field} é obrigatório`);
      continue;
    }
    
    if (value && rule.type && typeof value !== rule.type) {
      errors.push(`${field} deve ser do tipo ${rule.type}`);
    }
    
    if (value && rule.minLength && value.length < rule.minLength) {
      errors.push(`${field} deve ter pelo menos ${rule.minLength} caracteres`);
    }
    
    if (value && rule.maxLength && value.length > rule.maxLength) {
      errors.push(`${field} deve ter no máximo ${rule.maxLength} caracteres`);
    }
    
    if (value && rule.pattern && !rule.pattern.test(value)) {
      errors.push(`${field} está em formato inválido`);
    }
  }
  
  return errors;
};

// Sanitização de entrada
const sanitizeInput = (obj) => {
  if (typeof obj !== 'object' || obj === null) return obj;
  
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      // Remove scripts maliciosos e sanitiza HTML básico
      sanitized[key] = value
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim();
    } else if (typeof value === 'object') {
      sanitized[key] = sanitizeInput(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

// Logger estruturado (sem dados sensíveis)
const logRequest = (req, operation, userId = null) => {
  const logData = {
    timestamp: new Date().toISOString(),
    method: req.method,
    operation,
    userId: userId || 'anonymous',
    ip: req.headers['x-forwarded-for'] || 'unknown',
    userAgent: req.headers['user-agent'] || 'unknown'
  };
  
  console.log(`🔍 [${operation}]`, JSON.stringify(logData));
};

// Resposta padronizada
const sendResponse = (res, statusCode, data) => {
  const response = {
    success: statusCode < 400,
    timestamp: new Date().toISOString(),
    ...data
  };
  
  // Comprimir resposta se for grande
  if (JSON.stringify(response).length > 1000) {
    res.setHeader('Content-Encoding', 'gzip');
  }
  
  res.status(statusCode).json(response);
};

// Middleware principal
const commonMiddleware = async (req, res, operation = 'unknown') => {
  // Setup CORS
  setupCORS(res, req);
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return { skip: true };
  }
  
  // Rate limiting
  if (!checkRateLimit(req, res)) {
    return { skip: true };
  }
  
  // Sanitize input
  if (req.body) {
    req.body = sanitizeInput(req.body);
  }
  
  // Validate user-id
  const userId = req.headers['user-id'];
  if (!userId && req.method !== 'OPTIONS') {
    sendResponse(res, 401, {
      error: 'Header user-id é obrigatório'
    });
    return { skip: true };
  }
  
  // Log request
  logRequest(req, operation, userId);
  
  return { 
    skip: false, 
    userId,
    validateInput: (data, rules) => validateInput(data, rules),
    sendResponse: (statusCode, data) => sendResponse(res, statusCode, data),
    logRequest: (op) => logRequest(req, op, userId)
  };
};

module.exports = {
  commonMiddleware,
  validateInput,
  sanitizeInput,
  sendResponse,
  logRequest
};
