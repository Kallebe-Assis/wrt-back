const { setupCORS } = require('./cors');

module.exports = async function handler(req, res) {
  // Configurar CORS
  const corsHandled = setupCORS(req, res);
  if (corsHandled) return;

  // Apenas GET permitido
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Método não permitido' });
    return;
  }

  try {
    res.status(200).json({
      status: 'OK',
      message: 'WRTmind Backend API funcionando!',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('Erro na rota health:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
} 