module.exports = async function handler(req, res) {
  console.log('=== TEST SIMPLE ===');
  
  // TRATAR OPTIONS
  if (req.method === 'OPTIONS') {
    console.log('OPTIONS request - respondendo 200');
    res.status(200).end();
    return;
  }
  
  try {
    console.log('Teste simples funcionando');
    res.status(200).json({
      success: true,
      message: 'Teste simples OK',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('ERRO NO TEST:', error.message);
    res.status(500).json({
      success: false,
      error: 'Erro interno'
    });
  }
}; 