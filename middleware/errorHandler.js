const fs = require('fs');
const path = require('path');

// Classe para gerenciar logs de erro
class ErrorLogger {
  constructor() {
    this.logDir = path.join(__dirname, '../logs');
    this.errorLogFile = path.join(this.logDir, 'errors.log');
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  logError(error, req = null) {
    const timestamp = new Date().toISOString();
    const errorInfo = {
      timestamp,
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name,
        code: error.code || 'UNKNOWN'
      },
      request: req ? {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        body: req.body,
        params: req.params,
        query: req.query
      } : null
    };

    const logEntry = `[${timestamp}] ${JSON.stringify(errorInfo, null, 2)}\n---\n`;
    
    try {
      fs.appendFileSync(this.errorLogFile, logEntry);
    } catch (writeError) {
      console.error('Erro ao escrever log:', writeError.message);
    }
  }

  getRecentErrors(limit = 50) {
    try {
      if (!fs.existsSync(this.errorLogFile)) {
        return [];
      }

      const content = fs.readFileSync(this.errorLogFile, 'utf8');
      const entries = content.split('---\n').filter(entry => entry.trim());
      
      return entries.slice(-limit).map(entry => {
        try {
          return JSON.parse(entry.replace(/^\[.*?\] /, ''));
        } catch {
          return { raw: entry };
        }
      });
    } catch (error) {
      console.error('Erro ao ler logs:', error.message);
      return [];
    }
  }
}

// Instância global do logger
const errorLogger = new ErrorLogger();

// Função para criar erro padronizado
function createErrorResponse(error, req) {
  const errorId = `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Log do erro
  errorLogger.logError(error, req);

  // Determinar tipo de erro
  let statusCode = 500;
  let errorType = 'INTERNAL_SERVER_ERROR';
  let userMessage = 'Ocorreu um erro interno no servidor.';

  if (error.status) {
    statusCode = error.status;
  } else if (error.code) {
    switch (error.code) {
      case 'ENOTFOUND':
        statusCode = 404;
        errorType = 'NOT_FOUND';
        userMessage = 'Recurso não encontrado.';
        break;
      case 'ECONNREFUSED':
        statusCode = 503;
        errorType = 'SERVICE_UNAVAILABLE';
        userMessage = 'Serviço temporariamente indisponível.';
        break;
      case 'ETIMEDOUT':
        statusCode = 408;
        errorType = 'REQUEST_TIMEOUT';
        userMessage = 'A requisição expirou.';
        break;
      case 'VALIDATION_ERROR':
        statusCode = 400;
        errorType = 'BAD_REQUEST';
        userMessage = 'Dados inválidos fornecidos.';
        break;
      case 'UNAUTHORIZED':
        statusCode = 401;
        errorType = 'UNAUTHORIZED';
        userMessage = 'Acesso não autorizado.';
        break;
      case 'FORBIDDEN':
        statusCode = 403;
        errorType = 'FORBIDDEN';
        userMessage = 'Acesso negado.';
        break;
    }
  }

  // Mensagem personalizada baseada no tipo de erro
  if (error.message && error.message.includes('validation')) {
    statusCode = 400;
    errorType = 'VALIDATION_ERROR';
    userMessage = 'Dados fornecidos são inválidos.';
  }

  if (error.message && error.message.includes('not found')) {
    statusCode = 404;
    errorType = 'NOT_FOUND';
    userMessage = 'Recurso não encontrado.';
  }

  return {
    success: false,
    error: {
      id: errorId,
      type: errorType,
      message: userMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      timestamp: new Date().toISOString(),
      statusCode
    },
    recovery: {
      suggestions: getRecoverySuggestions(errorType),
      canRetry: statusCode >= 500 || statusCode === 408,
      retryAfter: statusCode >= 500 ? 30 : 5
    }
  };
}

// Funções de sugestão de recuperação
function getRecoverySuggestions(errorType) {
  const suggestions = {
    'INTERNAL_SERVER_ERROR': [
      'Tente novamente em alguns segundos',
      'Verifique sua conexão com a internet',
      'Se o problema persistir, entre em contato com o suporte'
    ],
    'BAD_REQUEST': [
      'Verifique os dados fornecidos',
      'Certifique-se de que todos os campos obrigatórios estão preenchidos',
      'Tente novamente com dados diferentes'
    ],
    'NOT_FOUND': [
      'Verifique se o endereço está correto',
      'O recurso pode ter sido removido ou movido',
      'Tente navegar para a página inicial'
    ],
    'UNAUTHORIZED': [
      'Faça login novamente',
      'Verifique suas credenciais',
      'Limpe os cookies do navegador'
    ],
    'FORBIDDEN': [
      'Verifique se você tem permissão para acessar este recurso',
      'Entre em contato com o administrador',
      'Tente fazer login com uma conta diferente'
    ],
    'SERVICE_UNAVAILABLE': [
      'O serviço está temporariamente indisponível',
      'Tente novamente em alguns minutos',
      'Verifique o status do sistema'
    ],
    'REQUEST_TIMEOUT': [
      'Sua conexão pode estar lenta',
      'Tente novamente',
      'Verifique sua conexão com a internet'
    ],
    'VALIDATION_ERROR': [
      'Verifique os dados fornecidos',
      'Certifique-se de que o formato está correto',
      'Tente novamente com dados válidos'
    ]
  };

  return suggestions[errorType] || suggestions['INTERNAL_SERVER_ERROR'];
}

// Middleware principal de tratamento de erros
function errorHandler(err, req, res, next) {
  // Se a resposta já foi enviada, não faça nada
  if (res.headersSent) {
    return next(err);
  }

  // Criar resposta de erro padronizada
  const errorResponse = createErrorResponse(err, req);

  // Definir status code
  res.status(errorResponse.error.statusCode);

  // Se for uma requisição API, retornar JSON
  if (req.path.startsWith('/api/')) {
    return res.json(errorResponse);
  }

  // Se for uma requisição de página, renderizar página de erro
  return renderErrorPage(res, errorResponse);
}

// Função para renderizar página de erro
function renderErrorPage(res, errorResponse) {
  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Erro ${errorResponse.error.statusCode} - WRTmind</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #333;
        }
        
        .error-container {
            background: white;
            border-radius: 20px;
            padding: 40px;
            max-width: 600px;
            width: 90%;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            text-align: center;
        }
        
        .error-icon {
            font-size: 80px;
            margin-bottom: 20px;
            color: #e74c3c;
        }
        
        .error-code {
            font-size: 48px;
            font-weight: bold;
            color: #e74c3c;
            margin-bottom: 10px;
        }
        
        .error-title {
            font-size: 24px;
            color: #2c3e50;
            margin-bottom: 20px;
        }
        
        .error-message {
            font-size: 16px;
            color: #7f8c8d;
            margin-bottom: 30px;
            line-height: 1.6;
        }
        
        .error-id {
            background: #f8f9fa;
            padding: 10px;
            border-radius: 8px;
            font-family: monospace;
            font-size: 12px;
            color: #6c757d;
            margin-bottom: 30px;
        }
        
        .suggestions {
            text-align: left;
            margin-bottom: 30px;
        }
        
        .suggestions h3 {
            color: #2c3e50;
            margin-bottom: 15px;
        }
        
        .suggestions ul {
            list-style: none;
            padding: 0;
        }
        
        .suggestions li {
            padding: 8px 0;
            color: #7f8c8d;
            position: relative;
            padding-left: 20px;
        }
        
        .suggestions li:before {
            content: "•";
            color: #3498db;
            font-weight: bold;
            position: absolute;
            left: 0;
        }
        
        .buttons {
            display: flex;
            gap: 15px;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .btn {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            transition: all 0.3s ease;
        }
        
        .btn-primary {
            background: #3498db;
            color: white;
        }
        
        .btn-primary:hover {
            background: #2980b9;
            transform: translateY(-2px);
        }
        
        .btn-secondary {
            background: #ecf0f1;
            color: #2c3e50;
        }
        
        .btn-secondary:hover {
            background: #bdc3c7;
            transform: translateY(-2px);
        }
        
        .retry-info {
            background: #e8f5e8;
            border: 1px solid #27ae60;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
            color: #27ae60;
        }
        
        @media (max-width: 480px) {
            .error-container {
                padding: 20px;
            }
            
            .buttons {
                flex-direction: column;
            }
            
            .btn {
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="error-container">
        <div class="error-icon">⚠️</div>
        <div class="error-code">${errorResponse.error.statusCode}</div>
        <div class="error-title">Ops! Algo deu errado</div>
        <div class="error-message">${errorResponse.error.message}</div>
        
        <div class="error-id">
            ID do Erro: ${errorResponse.error.id}
        </div>
        
        ${errorResponse.recovery.canRetry ? `
        <div class="retry-info">
            🔄 Você pode tentar novamente em ${errorResponse.recovery.retryAfter} segundos
        </div>
        ` : ''}
        
        <div class="suggestions">
            <h3>O que você pode fazer:</h3>
            <ul>
                ${errorResponse.recovery.suggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
            </ul>
        </div>
        
        <div class="buttons">
            <button class="btn btn-primary" onclick="window.history.back()">
                ← Voltar
            </button>
            <a href="/" class="btn btn-secondary">
                🏠 Página Inicial
            </a>
            ${errorResponse.recovery.canRetry ? `
            <button class="btn btn-primary" onclick="location.reload()">
                🔄 Tentar Novamente
            </button>
            ` : ''}
        </div>
    </div>
    
    <script>
        // Auto-retry para erros 5xx após 30 segundos
        ${errorResponse.recovery.canRetry ? `
        setTimeout(() => {
            if (confirm('Tentar novamente automaticamente?')) {
                location.reload();
            }
        }, ${errorResponse.recovery.retryAfter * 1000});
        ` : ''}
        
        // Log do erro para analytics
        console.error('Error ID:', '${errorResponse.error.id}');
        console.error('Error Type:', '${errorResponse.error.type}');
        console.error('Error Message:', '${errorResponse.error.message}');
    </script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
}

// Middleware para capturar erros não tratados
function catchUnhandledErrors() {
  process.on('uncaughtException', (error) => {
    console.error('❌ Erro não capturado:', error);
    errorLogger.logError(error);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Promise rejeitada não tratada:', reason);
    errorLogger.logError(new Error(`Unhandled Rejection: ${reason}`));
  });
}

// Função para criar erro customizado
function createCustomError(message, statusCode = 500, code = null) {
  const error = new Error(message);
  error.status = statusCode;
  if (code) error.code = code;
  return error;
}

// Função para validar dados
function validateData(data, schema) {
  try {
    // Implementar validação baseada no schema
    return { valid: true };
  } catch (error) {
    throw createCustomError('Dados inválidos', 400, 'VALIDATION_ERROR');
  }
}

module.exports = {
  errorHandler,
  catchUnhandledErrors,
  createCustomError,
  validateData,
  errorLogger,
  createErrorResponse
}; 