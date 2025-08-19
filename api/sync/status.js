const { db } = require('../firebase-config-vercel');

module.exports = async function handler(req, res) {
  // Configurar CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, user-id');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Tratar preflight OPTIONS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { method } = req;

  try {
    // GET /api/sync/status - Status de sincronização
    if (method === 'GET') {
      const userId = req.headers['user-id'];
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        });
      }

      // Buscar estatísticas básicas (versão simplificada)
      const notasSnapshot = await db.collection('notas').where('userId', '==', userId).get();
      const linksSnapshot = await db.collection('links').where('userId', '==', userId).get();
      const categoriasSnapshot = await db.collection('categorias').where('userId', '==', userId).get();

      const totalNotas = notasSnapshot.size;
      const totalLinks = linksSnapshot.size;
      const totalCategorias = categoriasSnapshot.size;

      // Contar favoritas
      const notasFavoritas = notasSnapshot.docs.filter(doc => doc.data().favorita === true).length;

      res.json({
        success: true,
        status: 'online',
        timestamp: new Date().toISOString(),
        stats: {
          notas: {
            total: totalNotas,
            favoritas: notasFavoritas
          },
          links: {
            total: totalLinks
          },
          categorias: {
            total: totalCategorias
          }
        },
        message: 'Sistema sincronizado'
      });
    }
    
    else {
      res.status(405).json({ error: 'Método não permitido' });
    }
    
  } catch (error) {
    console.error('Erro no sync:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor',
      status: 'error'
    });
  }
};
