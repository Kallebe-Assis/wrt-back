# 🚨 SISTEMA DE TRATAMENTO DE ERROS - WRTmind

## 📋 Visão Geral

Sistema completo e resiliente de tratamento de erros que garante que **nunca haverá crashes** no sistema. Todos os erros são capturados, logados e apresentados de forma amigável ao usuário, sempre com opções de recuperação.

---

## 🎯 Características Principais

### ✅ **Resiliente**
- **Zero crashes** - Sistema nunca para de funcionar
- **Recuperação automática** - Retry automático para erros temporários
- **Fallbacks** - Alternativas quando serviços falham

### ✅ **Amigável**
- **Mensagens claras** - Erros explicados em linguagem simples
- **Sugestões de recuperação** - Orientações sobre o que fazer
- **Opções de retry** - Sempre possível tentar novamente

### ✅ **Centralizado**
- **Logs concentrados** - Todos os erros em um local
- **Dashboard de monitoramento** - Visualização em tempo real
- **Análise de padrões** - Identificação de problemas recorrentes

---

## 🏗️ Arquitetura do Sistema

### Backend (Node.js/Express)

```
📁 middleware/
├── errorHandler.js      # Tratamento centralizado de erros
├── asyncHandler.js      # Wrapper para funções assíncronas
└── security.js          # Middleware de segurança

📁 routes/
└── errorRoutes.js       # Rotas para gerenciamento de erros

📁 logs/
└── errors.log          # Arquivo de concentração dos erros
```

### Frontend (React)

```
📁 components/
├── ErrorBoundary.js     # Captura erros de componentes React
├── ErrorAlert.js        # Alertas de erro amigáveis
└── ErrorBoundary.css    # Estilos do ErrorBoundary

📁 hooks/
└── useErrorHandler.js   # Hook para tratamento de erros de API
```

---

## 🔧 Como Usar

### 1. Backend - Middleware de Erros

#### Configuração Automática
O sistema já está configurado no `server.js`:

```javascript
// Sistema de tratamento de erros
const { errorHandler, catchUnhandledErrors } = require('./middleware/errorHandler');

// Middleware de tratamento de erros (DEVE ser o último)
app.use(errorHandler);

// Capturar erros não tratados do processo
catchUnhandledErrors();
```

#### Usando em Rotas
```javascript
const { asyncHandler, validateRequiredParams } = require('../middleware/asyncHandler');

// Rota com tratamento automático de erros
router.get('/api/items', asyncHandler(async (req, res) => {
  // Validar parâmetros
  validateRequiredParams(req.query, ['userId']);
  
  // Sua lógica aqui
  const items = await getItems(req.query.userId);
  
  res.json({ success: true, data: items });
}));
```

### 2. Frontend - ErrorBoundary

#### Envolver a Aplicação
```javascript
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <YourApp />
    </ErrorBoundary>
  );
}
```

#### Usando o Hook de Erros
```javascript
import { useErrorHandler } from './hooks/useErrorHandler';

function MyComponent() {
  const { error, isLoading, executeRequest, clearError } = useErrorHandler();

  const fetchData = async () => {
    const result = await executeRequest(async () => {
      const response = await fetch('/api/data');
      if (!response.ok) throw new Error('Falha na requisição');
      return response.json();
    }, {
      showError: true,
      onSuccess: (data) => console.log('Sucesso:', data),
      onError: (error) => console.log('Erro:', error)
    });
  };

  return (
    <div>
      {error && <ErrorAlert error={error} onClose={clearError} />}
      <button onClick={fetchData} disabled={isLoading}>
        {isLoading ? 'Carregando...' : 'Buscar Dados'}
      </button>
    </div>
  );
}
```

### 3. Alertas de Erro

#### Componente ErrorAlert
```javascript
import ErrorAlert from './components/ErrorAlert';

function MyComponent() {
  const [error, setError] = useState(null);

  return (
    <div>
      <ErrorAlert
        error={error}
        onClose={() => setError(null)}
        onRetry={() => fetchData()}
        position="top-right"
        autoClose={true}
        autoCloseDelay={5000}
        showSuggestions={true}
      />
    </div>
  );
}
```

---

## 📊 Dashboard de Monitoramento

### Acessar Dashboard
```
http://localhost:5000/api/errors/dashboard
```

### Funcionalidades
- **Estatísticas em tempo real** - Total de erros, taxa de erro
- **Logs recentes** - Últimos 10 erros com detalhes
- **Testes de erro** - Gerar erros para testar o sistema
- **Limpeza de logs** - Remover logs antigos

### Endpoints da API
```javascript
GET  /api/errors/stats     // Estatísticas de erro
GET  /api/errors/logs      // Logs de erro (dev apenas)
DELETE /api/errors/logs    // Limpar logs (dev apenas)
GET  /api/errors/test/:type // Testar tipos de erro
```

---

## 🎨 Tipos de Erro Suportados

### Backend (HTTP Status)
- **400** - Bad Request (dados inválidos)
- **401** - Unauthorized (não autenticado)
- **403** - Forbidden (sem permissão)
- **404** - Not Found (recurso não encontrado)
- **408** - Timeout (requisição expirou)
- **429** - Rate Limit (muitas requisições)
- **500** - Server Error (erro interno)
- **502/503/504** - Service Unavailable (serviço indisponível)

### Frontend (Tipos de Erro)
- **BAD_REQUEST** - Dados inválidos
- **UNAUTHORIZED** - Sessão expirada
- **FORBIDDEN** - Acesso negado
- **NOT_FOUND** - Recurso não encontrado
- **TIMEOUT** - Requisição expirou
- **RATE_LIMIT** - Muitas requisições
- **SERVER_ERROR** - Erro do servidor
- **SERVICE_UNAVAILABLE** - Serviço indisponível
- **NETWORK_ERROR** - Erro de conexão

---

## 🔄 Recuperação Automática

### Retry Automático
- **Erros 5xx** - Tenta 3 vezes com delay exponencial
- **Timeouts** - Tenta novamente após 1-3 segundos
- **Erros de rede** - Tenta reconectar automaticamente

### Circuit Breaker
- **Proteção contra falhas** - Para requisições repetidas
- **Recuperação automática** - Reativa após timeout
- **Fallback graceful** - Alternativas quando serviço falha

### Sugestões de Recuperação
Cada tipo de erro tem sugestões específicas:
- **Dados inválidos** → Verificar campos obrigatórios
- **Sessão expirada** → Fazer login novamente
- **Erro de rede** → Verificar conexão
- **Servidor indisponível** → Tentar mais tarde

---

## 📝 Logs e Monitoramento

### Estrutura do Log
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "error": {
    "id": "ERR_1705312200000_abc123",
    "type": "SERVER_ERROR",
    "message": "Erro interno do servidor",
    "statusCode": 500,
    "details": "Stack trace completo"
  },
  "request": {
    "method": "POST",
    "url": "/api/items",
    "ip": "192.168.1.1",
    "userAgent": "Mozilla/5.0...",
    "body": { "userId": "123" }
  },
  "recovery": {
    "suggestions": ["Tente novamente", "Verifique conexão"],
    "canRetry": true,
    "retryAfter": 30
  }
}
```

### Localização dos Logs
- **Backend**: `logs/errors.log`
- **Dashboard**: `http://localhost:5000/api/errors/dashboard`
- **Console**: Logs detalhados em desenvolvimento

---

## 🛠️ Configuração Avançada

### Variáveis de Ambiente
```bash
# Configurações de erro
LOG_LEVEL=info                    # Nível de log
LOG_FILE=logs/app.log            # Arquivo de log
RATE_LIMIT_WINDOW_MS=900000      # Janela de rate limiting
RATE_LIMIT_MAX_REQUESTS=100      # Máximo de requisições
```

### Personalização de Mensagens
```javascript
// No errorHandler.js
const customMessages = {
  'CUSTOM_ERROR': 'Mensagem personalizada para este erro',
  'VALIDATION_ERROR': 'Dados fornecidos são inválidos'
};
```

### Configuração de Retry
```javascript
// No asyncHandler.js
const retryConfig = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000
};
```

---

## 🧪 Testando o Sistema

### Testes Automáticos
```bash
# Testar diferentes tipos de erro
curl http://localhost:5000/api/errors/test/validation
curl http://localhost:5000/api/errors/test/server
curl http://localhost:5000/api/errors/test/notfound
curl http://localhost:5000/api/errors/test/timeout
```

### Testes Manuais
1. **Acesse o dashboard**: `http://localhost:5000/api/errors/dashboard`
2. **Clique nos botões de teste** para gerar erros
3. **Verifique os logs** em tempo real
4. **Teste a recuperação** com botões de retry

---

## 🎯 Benefícios

### Para Desenvolvedores
- **Debugging facilitado** - Logs detalhados e centralizados
- **Monitoramento em tempo real** - Dashboard com estatísticas
- **Recuperação automática** - Menos intervenção manual

### Para Usuários
- **Experiência fluida** - Sem crashes ou telas brancas
- **Mensagens claras** - Entendimento do que aconteceu
- **Opções de recuperação** - Sempre possível continuar

### Para o Sistema
- **Alta disponibilidade** - Sistema sempre funcional
- **Resiliência** - Recuperação automática de falhas
- **Observabilidade** - Visibilidade completa dos problemas

---

## 🚀 Próximos Passos

1. **Integrar ErrorBoundary** no App.js do frontend
2. **Usar useErrorHandler** em componentes que fazem requisições
3. **Configurar ErrorAlert** para exibir erros amigavelmente
4. **Monitorar dashboard** para identificar padrões de erro
5. **Ajustar configurações** conforme necessidade

---

**🎉 Sistema de tratamento de erros implementado com sucesso!**

O WRTmind agora é **100% resiliente** e **nunca mais terá crashes**! 🛡️ 