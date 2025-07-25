module.exports = async function handler(req, res) {
  console.log('🚀 === TEST CORS ENDPOINT ===');
  console.log('📅 Timestamp:', new Date().toISOString());
  console.log('🌐 Origin:', req.headers.origin);
  console.log('🔗 Method:', req.method);
  console.log('📋 Headers:', JSON.stringify(req.headers, null, 2));
  
  // CORS SIMPLES E DIRETO
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  console.log('✅ CORS Headers configurados');
  
  if (req.method === 'OPTIONS') {
    console.log('🔄 Preflight OPTIONS - Respondendo 200');
    res.status(200).end();
    return;
  }

  console.log('📦 Body recebido:', req.body);
  
  res.status(200).json({
    success: true,
    message: 'CORS funcionando!',
    timestamp: new Date().toISOString(),
    method: req.method,
    origin: req.headers.origin,
    body: req.body
  });
  
  console.log('✅ Resposta enviada');
} 