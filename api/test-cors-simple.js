module.exports = function handler(req, res) {
  // CORS SIMPLES E DIRETO
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,user-id,X-Requested-With');

  // Responder a requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Retornar resposta simples
  res.status(200).json({
    success: true,
    message: 'CORS funcionando!',
    timestamp: new Date().toISOString(),
    origin: req.headers.origin
  });
} 