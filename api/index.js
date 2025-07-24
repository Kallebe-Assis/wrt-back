export default function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, user-id, X-Requested-With');

  // Responder a requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Rota raiz
  if (req.path === '/' || req.path === '') {
    try {
      res.status(200).json({
        message: 'WRTmind Backend API',
        version: '1.0.0',
        status: 'running',
        timestamp: new Date().toISOString(),
        endpoints: {
          health: '/api/health',
          debug: '/api/debug',
          test: '/api/test'
        }
      });
    } catch (error) {
      console.error('Erro na rota raiz:', error);
      res.status(500).json({ error: 'Erro interno' });
    }
    return;
  }

  // Para outras rotas, redirecionar para os endpoints específicos
  res.status(404).json({
    error: 'Endpoint não encontrado',
    path: req.path,
    method: req.method,
    availableEndpoints: [
      '/api/health',
      '/api/debug',
      '/api/test'
    ]
  });
} 