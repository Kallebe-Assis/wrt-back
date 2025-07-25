module.exports = async function handler(req, res) {
  console.log('=== TESTE SIMPLES ===');
  
  // TRATAR OPTIONS (PREFLIGHT)
  if (req.method === 'OPTIONS') {
    console.log('OPTIONS request - respondendo 200');
    res.status(200).end();
    return;
  }
  
  try {
    console.log('1. Teste simples funcionando');
    
    res.status(200).json({
      success: true,
      message: 'Teste simples funcionando',
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url
    });
    
  } catch (error) {
    console.error('ERRO NO TESTE SIMPLES:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({
      success: false,
      error: 'Erro no teste simples: ' + error.message,
      timestamp: new Date().toISOString()
    });
  }
}; 