const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5001;

// Configuração CORS completamente permissiva
app.use((req, res, next) => {
  // Permitir TODAS as origens sem exceção
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // Permitir TODOS os métodos HTTP
  res.setHeader('Access-Control-Allow-Methods', '*');
  
  // Permitir TODOS os headers
  res.setHeader('Access-Control-Allow-Headers', '*');
  
  // Permitir credenciais
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Expor TODOS os headers
  res.setHeader('Access-Control-Expose-Headers', '*');
  
  // Configurações adicionais para evitar problemas
  res.setHeader('Access-Control-Max-Age', '86400');
  
  // Responder imediatamente para requisições OPTIONS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
});

app.use(express.json());

// Rota de teste CORS
app.get('/api/test-cors', (req, res) => {
  res.json({
    success: true,
    message: 'CORS funcionando!',
    timestamp: new Date().toISOString(),
    headers: req.headers
  });
});

// Rota POST para testar CORS
app.post('/api/test-cors', (req, res) => {
  res.json({
    success: true,
    message: 'POST CORS funcionando!',
    data: req.body,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🧪 Servidor de teste CORS rodando na porta ${PORT}`);
  console.log(`📡 Teste: http://localhost:${PORT}/api/test-cors`);
}); 