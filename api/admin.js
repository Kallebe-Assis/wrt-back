const { db } = require('./firebase-config-vercel');

module.exports = async function handler(req, res) {
  // Configurar CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, user-id, admin-key');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Tratar preflight OPTIONS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { method } = req;
  const adminKey = req.headers['admin-key'];
  const userId = req.headers['user-id'];

  // Verificação de autenticação admin
  if (!adminKey || adminKey !== process.env.ADMIN_SECRET_KEY) {
    return res.status(401).json({
      success: false,
      error: 'Acesso negado - Chave de administrador inválida'
    });
  }

  try {
    // GET - Estatísticas do sistema
    if (method === 'GET') {
      console.log('📊 Gerando estatísticas do sistema...');
      
      const stats = await generateSystemStats();
      
      console.log('✅ Estatísticas geradas com sucesso');
      
      res.json({
        success: true,
        stats,
        timestamp: new Date().toISOString()
      });
    }
    
    // POST - Salvar configurações do painel admin
    else if (method === 'POST') {
      const { configuracao } = req.body;
      
      console.log('⚙️ Salvando configuração do painel admin');
      
      if (!configuracao) {
        return res.status(400).json({
          success: false,
          error: 'Configuração é obrigatória'
        });
      }
      
      // Salvar configuração no Firestore
      await db.collection('admin_config').doc('painel').set({
        configuracao,
        userId,
        dataModificacao: new Date().toISOString()
      });
      
      console.log('✅ Configuração salva com sucesso');
      
      res.json({
        success: true,
        message: 'Configuração salva com sucesso'
      });
    }
    
    else {
      res.status(405).json({
        success: false,
        error: 'Método não permitido',
        allowedMethods: ['GET', 'POST']
      });
    }
    
  } catch (error) {
    console.error('❌ Erro no painel admin:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
};

// Função para gerar estatísticas do sistema
async function generateSystemStats() {
  try {
    console.log('📈 Iniciando coleta de estatísticas...');
    
    // Contar usuários
    const usersQuery = await db.collection('users').get();
    const totalUsers = usersQuery.size;
    
    // Contar usuários ativos (últimos 30 dias)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const activeUsersQuery = await db.collection('users')
      .where('dataCriacao', '>=', thirtyDaysAgo.toISOString())
      .get();
    const activeUsers = activeUsersQuery.size;
    
    // Contar notas
    const notasQuery = await db.collection('notas').where('ativo', '==', true).get();
    const totalNotas = notasQuery.size;
    
    // Contar notas favoritas
    const favoritasQuery = await db.collection('notas')
      .where('ativo', '==', true)
      .where('favorita', '==', true)
      .get();
    const totalFavoritas = favoritasQuery.size;
    
    // Contar links
    const linksQuery = await db.collection('links').where('ativo', '==', true).get();
    const totalLinks = linksQuery.size;
    
    // Contar categorias
    const categoriasQuery = await db.collection('categorias').where('ativo', '==', true).get();
    const totalCategorias = categoriasQuery.size;
    
    // Estatísticas por período
    const hoje = new Date();
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    
    const notasMesQuery = await db.collection('notas')
      .where('ativo', '==', true)
      .where('dataCriacao', '>=', inicioMes.toISOString())
      .get();
    const notasMes = notasMesQuery.size;
    
    const linksMesQuery = await db.collection('links')
      .where('ativo', '==', true)
      .where('dataCriacao', '>=', inicioMes.toISOString())
      .get();
    const linksMes = linksMesQuery.size;
    
    // Top 5 usuários mais ativos (por número de notas)
    const userStats = {};
    notasQuery.forEach(doc => {
      const userId = doc.data().userId;
      userStats[userId] = (userStats[userId] || 0) + 1;
    });
    
    const topUsers = Object.entries(userStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([userId, count]) => ({ userId, notaCount: count }));
    
    // Estatísticas de crescimento
    const crescimento = {
      usuarios: {
        total: totalUsers,
        ativos: activeUsers,
        percentualAtivos: totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(2) : 0
      },
      conteudo: {
        notas: {
          total: totalNotas,
          favoritas: totalFavoritas,
          percentualFavoritas: totalNotas > 0 ? ((totalFavoritas / totalNotas) * 100).toFixed(2) : 0,
          mes: notasMes
        },
        links: {
          total: totalLinks,
          mes: linksMes
        },
        categorias: {
          total: totalCategorias
        }
      },
      performance: {
        mediaNotasPorUsuario: totalUsers > 0 ? (totalNotas / totalUsers).toFixed(2) : 0,
        mediaLinksPorUsuario: totalUsers > 0 ? (totalLinks / totalUsers).toFixed(2) : 0
      },
      topUsuarios: topUsers,
      periodos: {
        mesAtual: {
          notas: notasMes,
          links: linksMes
        },
        ultimos30Dias: {
          usuariosAtivos: activeUsers
        }
      }
    };
    
    console.log('📊 Estatísticas coletadas:', {
      usuarios: totalUsers,
      notas: totalNotas,
      links: totalLinks,
      categorias: totalCategorias
    });
    
    return crescimento;
    
  } catch (error) {
    console.error('❌ Erro ao gerar estatísticas:', error);
    throw error;
  }
}
