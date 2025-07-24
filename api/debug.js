export default function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, user-id, X-Requested-With');

  // Responder a requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Apenas GET permitido
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Método não permitido' });
    return;
  }

  try {
    res.status(200).json({
      message: 'Debug das variáveis de ambiente',
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID ? '✅ Definido' : '❌ Não definido',
      FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY ? '✅ Definido' : '❌ Não definido',
      FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL ? '✅ Definido' : '❌ Não definido',
      JWT_SECRET: process.env.JWT_SECRET ? '✅ Definido' : '❌ Não definido',
      SESSION_SECRET: process.env.SESSION_SECRET ? '✅ Definido' : '❌ Não definido',
      NODE_ENV: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('Erro na rota debug:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
} 