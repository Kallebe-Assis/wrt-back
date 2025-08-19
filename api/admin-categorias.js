const { db } = require('./firebase-config-vercel');

module.exports = async function handler(req, res) {
  // Configurar CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, user-id, admin-key');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Tratar preflight OPTIONS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { method } = req;
  const userId = req.headers['user-id'];
  const adminKey = req.headers['admin-key'];
  const { type } = req.query; // 'admin' ou 'categorias'

  try {
    // ROTAS DE ADMIN
    if (type === 'admin') {
      // Verificação de autenticação admin
      if (!adminKey || adminKey !== process.env.ADMIN_SECRET_KEY) {
        return res.status(401).json({
          success: false,
          error: 'Acesso negado - Chave de administrador inválida'
        });
      }

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
    }

    // ROTAS DE CATEGORIAS
    else if (type === 'categorias' || !type) {
      // Middleware de validação de usuário
      if (!userId && method !== 'OPTIONS') {
        return res.status(401).json({
          success: false,
          error: 'Header user-id é obrigatório'
        });
      }

      // GET - Buscar categorias
      if (method === 'GET') {
        const { limit = 50, offset = 0, search, cor } = req.query;
        
        console.log('🏷️ Buscando categorias com filtros:', { userId, limit, offset, search, cor });
        
        // Query base otimizada
        let query = db.collection('categorias')
          .where('userId', '==', userId)
          .where('ativo', '==', true)
          .orderBy('nome', 'asc')
          .limit(parseInt(limit));
        
        // Filtro por cor
        if (cor) {
          query = query.where('cor', '==', cor);
        }
        
        const categoriasQuery = await query.get();
        const categorias = [];
        
        categoriasQuery.forEach(doc => {
          const categoriaData = {
            id: doc.id,
            ...doc.data()
          };
          
          // Filtro de busca local (se aplicável)
          if (search) {
            const searchLower = search.toLowerCase();
            const nomeMatch = categoriaData.nome && categoriaData.nome.toLowerCase().includes(searchLower);
            const descricaoMatch = categoriaData.descricao && categoriaData.descricao.toLowerCase().includes(searchLower);
            
            if (nomeMatch || descricaoMatch) {
              categorias.push(categoriaData);
            }
          } else {
            categorias.push(categoriaData);
          }
        });
        
        console.log(`✅ ${categorias.length} categorias encontradas para usuário ${userId}`);
        
        res.json({
          success: true,
          data: categorias,
          count: categorias.length,
          limit: parseInt(limit),
          offset: parseInt(offset)
        });
      }
      
      // POST - Criar categoria
      else if (method === 'POST') {
        const { nome, cor, descricao, icone } = req.body;
        
        console.log('🏷️ Criando nova categoria:', { nome, cor, descricao, icone, userId });
        
        if (!nome || !cor) {
          return res.status(400).json({ 
            success: false, 
            error: 'Nome e cor são obrigatórios' 
          });
        }
        
        // Validar formato da cor (hex)
        const corRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        if (!corRegex.test(cor)) {
          return res.status(400).json({
            success: false,
            error: 'Formato de cor inválido. Use formato hexadecimal (ex: #FF0000)'
          });
        }
        
        // Verificar se já existe categoria com mesmo nome para o usuário
        const existingQuery = await db.collection('categorias')
          .where('userId', '==', userId)
          .where('nome', '==', nome.trim())
          .where('ativo', '==', true)
          .get();
        
        if (!existingQuery.empty) {
          return res.status(400).json({
            success: false,
            error: 'Já existe uma categoria com este nome'
          });
        }
        
        const categoriaData = {
          nome: nome.trim(),
          cor: cor.trim(),
          descricao: descricao?.trim() || null,
          icone: icone?.trim() || null,
          userId,
          ativo: true,
          dataCriacao: new Date().toISOString(),
          dataModificacao: new Date().toISOString()
        };
        
        const docRef = await db.collection('categorias').add(categoriaData);
        
        console.log(`✅ Categoria criada com sucesso: ${docRef.id}`);
        
        res.status(201).json({
          success: true,
          data: {
            id: docRef.id,
            ...categoriaData
          }
        });
      }
      
      // PUT - Atualizar categoria
      else if (method === 'PUT') {
        const { id } = req.query;
        
        if (!id) {
          return res.status(400).json({ error: 'ID é obrigatório' });
        }
        
        const { nome, cor, descricao, icone } = req.body;
        
        console.log('🏷️ Atualizando categoria:', { id, nome, cor, descricao, icone, userId });
        
        if (!nome || !cor) {
          return res.status(400).json({ 
            success: false, 
            error: 'Nome e cor são obrigatórios' 
          });
        }
        
        // Validar formato da cor (hex)
        const corRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        if (!corRegex.test(cor)) {
          return res.status(400).json({
            success: false,
            error: 'Formato de cor inválido. Use formato hexadecimal (ex: #FF0000)'
          });
        }
        
        // Verificar se a categoria pertence ao usuário
        const categoriaDoc = await db.collection('categorias').doc(id).get();
        if (!categoriaDoc.exists) {
          return res.status(404).json({
            success: false,
            error: 'Categoria não encontrada'
          });
        }
        
        if (categoriaDoc.data().userId !== userId) {
          return res.status(403).json({
            success: false,
            error: 'Acesso negado'
          });
        }
        
        // Verificar se já existe outra categoria com mesmo nome (excluindo a atual)
        const existingQuery = await db.collection('categorias')
          .where('userId', '==', userId)
          .where('nome', '==', nome.trim())
          .where('ativo', '==', true)
          .get();
        
        const hasConflict = existingQuery.docs.some(doc => doc.id !== id);
        if (hasConflict) {
          return res.status(400).json({
            success: false,
            error: 'Já existe uma categoria com este nome'
          });
        }
        
        const updateData = {
          nome: nome.trim(),
          cor: cor.trim(),
          descricao: descricao?.trim() || null,
          icone: icone?.trim() || null,
          dataModificacao: new Date().toISOString()
        };
        
        await db.collection('categorias').doc(id).update(updateData);
        
        console.log(`✅ Categoria atualizada com sucesso: ${id}`);
        
        res.json({
          success: true,
          data: {
            id,
            ...updateData
          }
        });
      }
      
      // DELETE - Soft delete categoria
      else if (method === 'DELETE') {
        const { id } = req.query;
        
        if (!id) {
          return res.status(400).json({ error: 'ID é obrigatório' });
        }
        
        console.log('🏷️ Deletando categoria:', { id, userId });
        
        // Verificar se a categoria pertence ao usuário
        const categoriaDoc = await db.collection('categorias').doc(id).get();
        if (!categoriaDoc.exists) {
          return res.status(404).json({
            success: false,
            error: 'Categoria não encontrada'
          });
        }
        
        if (categoriaDoc.data().userId !== userId) {
          return res.status(403).json({
            success: false,
            error: 'Acesso negado'
          });
        }
        
        // Verificar se a categoria está sendo usada por notas ou links
        const notasQuery = await db.collection('notas')
          .where('categoria', '==', categoriaDoc.data().nome)
          .where('userId', '==', userId)
          .where('ativo', '==', true)
          .limit(1)
          .get();
        
        const linksQuery = await db.collection('links')
          .where('categoria', '==', categoriaDoc.data().nome)
          .where('userId', '==', userId)
          .where('ativo', '==', true)
          .limit(1)
          .get();
        
        if (!notasQuery.empty || !linksQuery.empty) {
          return res.status(400).json({
            success: false,
            error: 'Não é possível deletar uma categoria que está sendo usada por notas ou links'
          });
        }
        
        await db.collection('categorias').doc(id).update({
          ativo: false,
          dataModificacao: new Date().toISOString()
        });
        
        console.log(`✅ Categoria deletada com sucesso: ${id}`);
        
        res.json({
          success: true,
          message: 'Categoria deletada com sucesso'
        });
      }
      
      else {
        res.status(405).json({ 
          success: false,
          error: 'Método não permitido',
          allowedMethods: ['GET', 'POST', 'PUT', 'DELETE']
        });
      }
    }
    
    else {
      res.status(400).json({
        success: false,
        error: 'Tipo inválido. Use "admin" ou "categorias"',
        allowedTypes: ['admin', 'categorias']
      });
    }
    
  } catch (error) {
    console.error('❌ Erro na API admin-categorias:', error);
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
    // Estatísticas de usuários
    const usersSnapshot = await db.collection('users').get();
    const totalUsers = usersSnapshot.size;
    
    const activeUsersSnapshot = await db.collection('users')
      .where('ativo', '==', true)
      .get();
    const activeUsers = activeUsersSnapshot.size;
    
    // Estatísticas de notas
    const notasSnapshot = await db.collection('notas')
      .where('ativo', '==', true)
      .get();
    const totalNotas = notasSnapshot.size;
    
    const notasFavoritasSnapshot = await db.collection('notas')
      .where('ativo', '==', true)
      .where('favorita', '==', true)
      .get();
    const notasFavoritas = notasFavoritasSnapshot.size;
    
    // Estatísticas de links
    const linksSnapshot = await db.collection('links')
      .where('ativo', '==', true)
      .get();
    const totalLinks = linksSnapshot.size;
    
    // Estatísticas de categorias
    const categoriasSnapshot = await db.collection('categorias')
      .where('ativo', '==', true)
      .get();
    const totalCategorias = categoriasSnapshot.size;
    
    // Estatísticas por mês (últimos 6 meses)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const notasRecentesSnapshot = await db.collection('notas')
      .where('ativo', '==', true)
      .where('dataCriacao', '>=', sixMonthsAgo.toISOString())
      .get();
    
    const linksRecentesSnapshot = await db.collection('links')
      .where('ativo', '==', true)
      .where('dataCriacao', '>=', sixMonthsAgo.toISOString())
      .get();
    
    // Usuários mais ativos (top 5)
    const usersWithNotes = {};
    notasSnapshot.forEach(doc => {
      const userId = doc.data().userId;
      usersWithNotes[userId] = (usersWithNotes[userId] || 0) + 1;
    });
    
    const topUsers = Object.entries(usersWithNotes)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([userId, count]) => ({ userId, notasCount: count }));
    
    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: totalUsers - activeUsers
      },
      notas: {
        total: totalNotas,
        favoritas: notasFavoritas,
        recentes: notasRecentesSnapshot.size
      },
      links: {
        total: totalLinks,
        recentes: linksRecentesSnapshot.size
      },
      categorias: {
        total: totalCategorias
      },
      topUsers,
      performance: {
        notasPerUser: totalUsers > 0 ? (totalNotas / totalUsers).toFixed(2) : 0,
        linksPerUser: totalUsers > 0 ? (totalLinks / totalUsers).toFixed(2) : 0,
        favoritasPercentage: totalNotas > 0 ? ((notasFavoritas / totalNotas) * 100).toFixed(2) : 0
      }
    };
  } catch (error) {
    console.error('Erro ao gerar estatísticas:', error);
    throw error;
  }
}
