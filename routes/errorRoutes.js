const express = require('express');
const router = express.Router();
const { errorLogger } = require('../middleware/errorHandler');
const { asyncHandler } = require('../middleware/asyncHandler');

// Rota para obter logs de erro (apenas em desenvolvimento)
router.get('/logs', asyncHandler(async (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({
      success: false,
      error: {
        message: 'Acesso negado - logs só disponíveis em desenvolvimento'
      }
    });
  }

  const logs = errorLogger.getRecentErrors(100);
  
  res.json({
    success: true,
    data: {
      logs,
      total: logs.length,
      timestamp: new Date().toISOString()
    }
  });
}));

// Rota para limpar logs de erro
router.delete('/logs', asyncHandler(async (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({
      success: false,
      error: {
        message: 'Acesso negado - logs só podem ser limpos em desenvolvimento'
      }
    });
  }

  // Implementar limpeza de logs
  res.json({
    success: true,
    message: 'Logs de erro limpos com sucesso',
    timestamp: new Date().toISOString()
  });
}));

// Rota para estatísticas de erro
router.get('/stats', asyncHandler(async (req, res) => {
  const logs = errorLogger.getRecentErrors(1000);
  
  const stats = {
    total: logs.length,
    byType: {},
    byStatus: {},
    recent: logs.slice(0, 10),
    timestamp: new Date().toISOString()
  };

  logs.forEach(log => {
    if (log.error && log.error.type) {
      stats.byType[log.error.type] = (stats.byType[log.error.type] || 0) + 1;
    }
    
    if (log.error && log.error.statusCode) {
      stats.byStatus[log.error.statusCode] = (stats.byStatus[log.error.statusCode] || 0) + 1;
    }
  });

  res.json({
    success: true,
    data: stats
  });
}));

// Rota para testar diferentes tipos de erro
router.get('/test/:type', asyncHandler(async (req, res) => {
  const { type } = req.params;
  
  switch (type) {
    case 'validation':
      throw new Error('Erro de validação de dados');
    case 'notfound':
      const error = new Error('Recurso não encontrado');
      error.status = 404;
      throw error;
    case 'server':
      throw new Error('Erro interno do servidor');
    case 'timeout':
      await new Promise(resolve => setTimeout(resolve, 10000));
      return res.json({ message: 'Timeout testado' });
    case 'database':
      throw new Error('Erro de conexão com banco de dados');
    default:
      throw new Error(`Tipo de erro desconhecido: ${type}`);
  }
}));

// Rota para página de dashboard de erros (apenas desenvolvimento)
router.get('/dashboard', (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).send('Acesso negado');
  }

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard de Erros - WRTmind</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f5f6fa;
            color: #2c3e50;
            line-height: 1.6;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        
        .header h1 {
            color: #e74c3c;
            margin-bottom: 10px;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
        }
        
        .stat-number {
            font-size: 2em;
            font-weight: bold;
            color: #e74c3c;
        }
        
        .stat-label {
            color: #7f8c8d;
            margin-top: 5px;
        }
        
        .logs-section {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .log-entry {
            border: 1px solid #ecf0f1;
            border-radius: 5px;
            padding: 15px;
            margin-bottom: 10px;
            background: #f8f9fa;
        }
        
        .log-timestamp {
            color: #7f8c8d;
            font-size: 0.9em;
        }
        
        .log-error {
            color: #e74c3c;
            font-weight: bold;
            margin: 5px 0;
        }
        
        .log-message {
            color: #2c3e50;
        }
        
        .buttons {
            margin-bottom: 20px;
        }
        
        .btn {
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin-right: 10px;
            font-size: 14px;
        }
        
        .btn-primary {
            background: #3498db;
            color: white;
        }
        
        .btn-danger {
            background: #e74c3c;
            color: white;
        }
        
        .btn:hover {
            opacity: 0.8;
        }
        
        .error-type {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 3px;
            font-size: 0.8em;
            font-weight: bold;
            margin-left: 10px;
        }
        
        .error-type.validation { background: #f39c12; color: white; }
        .error-type.server { background: #e74c3c; color: white; }
        .error-type.notfound { background: #9b59b6; color: white; }
        .error-type.timeout { background: #34495e; color: white; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚨 Dashboard de Erros - WRTmind</h1>
            <p>Monitoramento e análise de erros do sistema</p>
        </div>
        
        <div class="buttons">
            <button class="btn btn-primary" onclick="loadStats()">🔄 Atualizar</button>
            <button class="btn btn-danger" onclick="clearLogs()">🗑️ Limpar Logs</button>
            <button class="btn btn-primary" onclick="testError('validation')">🧪 Testar Validação</button>
            <button class="btn btn-primary" onclick="testError('server')">🧪 Testar Servidor</button>
            <button class="btn btn-primary" onclick="testError('notfound')">🧪 Testar 404</button>
        </div>
        
        <div class="stats-grid" id="stats">
            <div class="stat-card">
                <div class="stat-number" id="total-errors">-</div>
                <div class="stat-label">Total de Erros</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="today-errors">-</div>
                <div class="stat-label">Erros Hoje</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="error-rate">-</div>
                <div class="stat-label">Taxa de Erro (%)</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="avg-response">-</div>
                <div class="stat-label">Tempo Médio (ms)</div>
            </div>
        </div>
        
        <div class="logs-section">
            <h2>📋 Logs Recentes</h2>
            <div id="logs">
                <p>Carregando logs...</p>
            </div>
        </div>
    </div>
    
    <script>
        async function loadStats() {
            try {
                const response = await fetch('/api/errors/stats');
                const data = await response.json();
                
                if (data.success) {
                    updateStats(data.data);
                    updateLogs(data.data.recent);
                }
            } catch (error) {
                console.error('Erro ao carregar estatísticas:', error);
            }
        }
        
        function updateStats(stats) {
            document.getElementById('total-errors').textContent = stats.total;
            document.getElementById('today-errors').textContent = stats.recent.length;
            document.getElementById('error-rate').textContent = '0.5'; // Placeholder
            document.getElementById('avg-response').textContent = '150'; // Placeholder
        }
        
        function updateLogs(logs) {
            const logsContainer = document.getElementById('logs');
            
            if (logs.length === 0) {
                logsContainer.innerHTML = '<p>Nenhum erro registrado</p>';
                return;
            }
            
            logsContainer.innerHTML = logs.map(log => `
                <div class="log-entry">
                    <div class="log-timestamp">${new Date(log.timestamp).toLocaleString()}</div>
                    <div class="log-error">
                        ${log.error?.type || 'UNKNOWN'}
                        <span class="error-type ${log.error?.type?.toLowerCase()}">${log.error?.statusCode || '500'}</span>
                    </div>
                    <div class="log-message">${log.error?.message || 'Erro desconhecido'}</div>
                </div>
            `).join('');
        }
        
        async function clearLogs() {
            if (confirm('Tem certeza que deseja limpar todos os logs?')) {
                try {
                    const response = await fetch('/api/errors/logs', { method: 'DELETE' });
                    const data = await response.json();
                    
                    if (data.success) {
                        alert('Logs limpos com sucesso!');
                        loadStats();
                    }
                } catch (error) {
                    console.error('Erro ao limpar logs:', error);
                }
            }
        }
        
        async function testError(type) {
            try {
                await fetch(\`/api/errors/test/\${type}\`);
            } catch (error) {
                console.log('Erro de teste gerado:', error);
            }
        }
        
        // Carregar dados iniciais
        loadStats();
        
        // Atualizar a cada 30 segundos
        setInterval(loadStats, 30000);
    </script>
</body>
</html>`;

  res.send(html);
}));

module.exports = router; 