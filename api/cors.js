// Configuração CORS centralizada
const corsConfig = {
  // Métodos permitidos
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  
  // Headers permitidos
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'user-id'
  ]
};

// Função para configurar CORS
function setupCORS(req, res) {
  const origin = req.headers.origin;
  
  // Obter origens permitidas da variável de ambiente
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',').map(o => o.trim()) || [
    'http://localhost:3000',
    'https://wrtmind.vercel.app',
    'https://wrt-frontend.vercel.app'
  ];
  
  console.log('🌐 CORS - Origin recebido:', origin);
  console.log('🌐 CORS - Origins permitidos:', allowedOrigins);
  console.log('🌐 CORS - ALLOWED_ORIGINS env:', process.env.ALLOWED_ORIGINS);
  
  // Verificar se a origem está na lista de permitidas
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    console.log('✅ CORS - Origin permitido:', origin);
  } else {
    // Em desenvolvimento, permitir localhost
    if (origin && (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      console.log('✅ CORS - Origin localhost permitido:', origin);
    } else {
      console.log('❌ CORS - Origin não permitido:', origin);
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
  }
  
  // Configurar outros headers CORS
  res.setHeader('Access-Control-Allow-Methods', corsConfig.allowedMethods.join(', '));
  res.setHeader('Access-Control-Allow-Headers', corsConfig.allowedHeaders.join(', '));
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 horas
  
  // Responder a requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    console.log('🔄 CORS - Respondendo OPTIONS');
    res.status(200).end();
    return true; // Indica que a requisição foi tratada
  }
  
  return false; // Indica que a requisição deve continuar
}

module.exports = { setupCORS, corsConfig }; 