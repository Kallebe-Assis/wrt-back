export default function handler(req, res) {
  // Configurar CORS usando variáveis de ambiente
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
  const origin = req.headers.origin;
  
  console.log('🌐 CORS - Origin recebido:', origin);
  console.log('🌐 CORS - Origins permitidos:', allowedOrigins);
  console.log('🌐 CORS - ALLOWED_ORIGINS env:', process.env.ALLOWED_ORIGINS);
  console.log('🌐 CORS - CORS_ALLOWED_HEADERS env:', process.env.CORS_ALLOWED_HEADERS);
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    console.log('✅ CORS - Origin permitido:', origin);
  } else {
    console.log('❌ CORS - Origin não permitido:', origin);
  }
  
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', process.env.CORS_ALLOWED_HEADERS || 'Content-Type,Authorization,user-id,X-Requested-With');

  // Responder a requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    console.log('🔄 CORS - Respondendo OPTIONS');
    res.status(200).end();
    return;
  }

  // Retornar informações de debug
  res.status(200).json({
    success: true,
    message: 'Teste de CORS funcionando',
    debug: {
      origin: origin,
      allowedOrigins: allowedOrigins,
      envAllowedOrigins: process.env.ALLOWED_ORIGINS,
      envCorsHeaders: process.env.CORS_ALLOWED_HEADERS,
      method: req.method,
      headers: req.headers
    }
  });
} 