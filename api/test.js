const { setupCORS } = require('./cors');

module.exports = async function handler(req, res) {
  // Configurar CORS
  const corsHandled = setupCORS(req, res);
  if (corsHandled) return;
  
  try {
    res.json({
      success: true,
      message: 'API funcionando corretamente!',
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url
    });
  } catch (error) {
    console.error('Erro no endpoint de teste:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
}; 