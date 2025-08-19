const { db } = require('./firebase-config-vercel');

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
  const userId = req.headers['user-id'];

  // Middleware de validação de usuário
  if (!userId && method !== 'OPTIONS') {
    return res.status(401).json({
      success: false,
      error: 'Header user-id é obrigatório'
    });
  }

  try {
    // GET - Buscar notas com queries otimizadas
    if (method === 'GET') {
      const { favoritas, topico, limit = 50, offset = 0 } = req.query;
      
      console.log('📝 Buscando notas com filtros:', { userId, favoritas, topico, limit, offset });
      
      // Query base otimizada
      let query = db.collection('notas')
        .where('userId', '==', userId)
        .where('ativo', '==', true)
        .orderBy('dataModificacao', 'desc')
        .limit(parseInt(limit));
      
      // Filtro por favoritas
      if (favoritas === 'true') {
        query = query.where('favorita', '==', true);
      }
      
      // Filtro por tópico
      if (topico) {
        query = query.where('topico', '==', topico);
      }
      
      const notasQuery = await query.get();
      const notas = [];
      
      notasQuery.forEach(doc => {
        notas.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      console.log(`✅ ${notas.length} notas encontradas para usuário ${userId}`);
      
      res.json({
        success: true,
        notas,
        total: notas.length,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
    }
    
    // POST - Criar nota otimizada
    else if (method === 'POST') {
      const { titulo, conteudo, topico, favorita = false } = req.body;
      
      console.log('📝 Criando nova nota:', { titulo, topico, favorita, userId });
      
      if (!titulo || !conteudo) {
        return res.status(400).json({ 
          success: false, 
          error: 'Título e conteúdo são obrigatórios' 
        });
      }
      
      const notaData = {
        titulo: titulo.trim(),
        conteudo: conteudo.trim(),
        userId,
        topico: topico || null,
        favorita: Boolean(favorita),
        ativo: true,
        dataCriacao: new Date().toISOString(),
        dataModificacao: new Date().toISOString()
      };
      
      const docRef = await db.collection('notas').add(notaData);
      
      console.log(`✅ Nota criada com sucesso: ${docRef.id}`);
      
      res.status(201).json({
        success: true,
        nota: {
          id: docRef.id,
          ...notaData
        }
      });
    }
    
    // PUT - Atualizar nota otimizada
    else if (method === 'PUT') {
      const pathParts = req.url.split('/');
      const id = pathParts[pathParts.length - 1];
      
      const { titulo, conteudo, topico } = req.body;
      
      console.log('📝 Atualizando nota:', { id, titulo, topico, userId });
      
      if (!id || !titulo || !conteudo) {
        return res.status(400).json({ 
          success: false, 
          error: 'ID, título e conteúdo são obrigatórios' 
        });
      }
      
      // Verificar se a nota pertence ao usuário
      const notaDoc = await db.collection('notas').doc(id).get();
      if (!notaDoc.exists) {
        return res.status(404).json({
          success: false,
          error: 'Nota não encontrada'
        });
      }
      
      if (notaDoc.data().userId !== userId) {
        return res.status(403).json({
          success: false,
          error: 'Acesso negado'
        });
      }
      
      const updateData = {
        titulo: titulo.trim(),
        conteudo: conteudo.trim(),
        topico: topico || null,
        dataModificacao: new Date().toISOString()
      };
      
      await db.collection('notas').doc(id).update(updateData);
      
      console.log(`✅ Nota atualizada com sucesso: ${id}`);
      
      res.json({
        success: true,
        nota: {
          id,
          ...updateData
        }
      });
    }
    
    // PATCH - Favoritar/Desfavoritar nota
    else if (method === 'PATCH') {
      const pathParts = req.url.split('/');
      const id = pathParts[pathParts.length - 1];
      const { favorita } = req.body;
      
      console.log('⭐ Alternando favorita:', { id, favorita, userId });
      
      if (!id || typeof favorita !== 'boolean') {
        return res.status(400).json({ 
          success: false, 
          error: 'ID e favorita (boolean) são obrigatórios' 
        });
      }
      
      // Verificar se a nota pertence ao usuário
      const notaDoc = await db.collection('notas').doc(id).get();
      if (!notaDoc.exists) {
        return res.status(404).json({
          success: false,
          error: 'Nota não encontrada'
        });
      }
      
      if (notaDoc.data().userId !== userId) {
        return res.status(403).json({
          success: false,
          error: 'Acesso negado'
        });
      }
      
      await db.collection('notas').doc(id).update({
        favorita: Boolean(favorita),
        dataModificacao: new Date().toISOString()
      });
      
      console.log(`✅ Favorita ${favorita ? 'ativada' : 'desativada'} para nota: ${id}`);
      
      res.json({
        success: true,
        nota: {
          id,
          favorita: Boolean(favorita)
        },
        message: `Nota ${favorita ? 'favoritada' : 'desfavoritada'} com sucesso`
      });
    }
    
    // DELETE - Soft delete otimizado
    else if (method === 'DELETE') {
      const pathParts = req.url.split('/');
      const id = pathParts[pathParts.length - 1];
      
      console.log('🗑️ Deletando nota:', { id, userId });
      
      if (!id) {
        return res.status(400).json({ 
          success: false, 
          error: 'ID é obrigatório' 
        });
      }
      
      // Verificar se a nota pertence ao usuário
      const notaDoc = await db.collection('notas').doc(id).get();
      if (!notaDoc.exists) {
        return res.status(404).json({
          success: false,
          error: 'Nota não encontrada'
        });
      }
      
      if (notaDoc.data().userId !== userId) {
        return res.status(403).json({
          success: false,
          error: 'Acesso negado'
        });
      }
      
      await db.collection('notas').doc(id).update({
        ativo: false,
        dataModificacao: new Date().toISOString()
      });
      
      console.log(`✅ Nota deletada com sucesso: ${id}`);
      
      res.json({
        success: true,
        message: 'Nota deletada com sucesso'
      });
    }
    
    else {
      res.status(405).json({ 
        success: false,
        error: 'Método não permitido',
        allowedMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
      });
    }
    
  } catch (error) {
    console.error('❌ Erro nas notas:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
}; 