// Wrapper para funções assíncronas que captura erros automaticamente
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Wrapper para funções de rota que retornam promises
function routeHandler(fn) {
  return asyncHandler(async (req, res, next) => {
    try {
      const result = await fn(req, res, next);
      
      // Se a função retornou algo, enviar como resposta
      if (result !== undefined) {
        if (typeof result === 'object') {
          return res.json({
            success: true,
            data: result,
            timestamp: new Date().toISOString()
          });
        } else {
          return res.json({
            success: true,
            data: { result },
            timestamp: new Date().toISOString()
          });
        }
      }
    } catch (error) {
      // O erro será capturado pelo errorHandler
      next(error);
    }
  });
}

// Função para validar parâmetros obrigatórios
function validateRequiredParams(params, requiredFields) {
  const missing = [];
  
  for (const field of requiredFields) {
    if (!params[field] || (typeof params[field] === 'string' && params[field].trim() === '')) {
      missing.push(field);
    }
  }
  
  if (missing.length > 0) {
    const error = new Error(`Campos obrigatórios faltando: ${missing.join(', ')}`);
    error.code = 'VALIDATION_ERROR';
    error.status = 400;
    throw error;
  }
}

// Função para validar tipos de dados
function validateDataTypes(data, schema) {
  const errors = [];
  
  for (const [field, expectedType] of Object.entries(schema)) {
    if (data[field] !== undefined) {
      const actualType = typeof data[field];
      
      if (actualType !== expectedType) {
        errors.push(`Campo '${field}' deve ser do tipo ${expectedType}, recebido ${actualType}`);
      }
    }
  }
  
  if (errors.length > 0) {
    const error = new Error(`Erros de validação: ${errors.join('; ')}`);
    error.code = 'VALIDATION_ERROR';
    error.status = 400;
    throw error;
  }
}

// Função para sanitizar dados
function sanitizeData(data, allowedFields) {
  const sanitized = {};
  
  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      if (typeof data[field] === 'string') {
        sanitized[field] = data[field].trim();
      } else {
        sanitized[field] = data[field];
      }
    }
  }
  
  return sanitized;
}

// Função para retry automático
async function retryOperation(operation, maxRetries = 3, delay = 1000) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Aguardar antes de tentar novamente
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
}

// Função para timeout de operações
function withTimeout(promise, timeoutMs = 5000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Operação expirou')), timeoutMs)
    )
  ]);
}

// Função para circuit breaker simples
function createCircuitBreaker(fn, failureThreshold = 5, timeout = 60000) {
  let failures = 0;
  let lastFailureTime = 0;
  let state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
  
  return async (...args) => {
    const now = Date.now();
    
    if (state === 'OPEN') {
      if (now - lastFailureTime > timeout) {
        state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker está aberto');
      }
    }
    
    try {
      const result = await fn(...args);
      failures = 0;
      state = 'CLOSED';
      return result;
    } catch (error) {
      failures++;
      lastFailureTime = now;
      
      if (failures >= failureThreshold) {
        state = 'OPEN';
      }
      
      throw error;
    }
  };
}

module.exports = {
  asyncHandler,
  routeHandler,
  validateRequiredParams,
  validateDataTypes,
  sanitizeData,
  retryOperation,
  withTimeout,
  createCircuitBreaker
}; 