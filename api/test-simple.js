module.exports = async function handler(req, res) {
  console.log('🧪 Teste simples - Método:', req.method);
  console.log('🧪 Teste simples - Headers:', req.headers);
  
  // Permitir todos os métodos
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    res.json({
      success: true,
      message: 'API funcionando!',
      method: req.method,
      timestamp: new Date().toISOString(),
      headers: req.headers
    });
  } catch (error) {
    console.error('❌ Erro no teste simples:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno',
      message: error.message
    });
  }
}; 