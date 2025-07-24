const express = require('express');

const app = express();

// Simular as rotas na ordem atual
app.get('/api/notas/favoritas', (req, res) => {
  console.log('✅ Rota /favoritas capturada');
  res.json({ message: 'Favoritas encontradas', route: '/favoritas' });
});

app.get('/api/notas/:id', (req, res) => {
  console.log('⚠️ Rota /:id capturada com id:', req.params.id);
  res.json({ message: 'Nota por ID', route: '/:id', id: req.params.id });
});

// Testar diferentes URLs
const testUrls = [
  '/api/notas/favoritas',
  '/api/notas/123',
  '/api/notas/fixadas'
];

async function testRoute(url) {
  try {
    console.log(`\n🔍 Testando URL: ${url}`);
    
    const response = await fetch(`http://localhost:3002${url}`);
    const data = await response.json();
    
    console.log(`✅ Resposta:`, data);
  } catch (error) {
    console.error(`❌ Erro:`, error.message);
  }
}

// Iniciar servidor
const PORT = 3002;
app.listen(PORT, async () => {
  console.log(`🚀 Servidor de teste rodando na porta ${PORT}`);
  
  // Aguardar um pouco e testar as URLs
  setTimeout(async () => {
    for (const url of testUrls) {
      await testRoute(url);
    }
    process.exit(0);
  }, 1000);
}); 