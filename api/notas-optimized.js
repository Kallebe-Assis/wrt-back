const { db } = require('./firebase-config-vercel');
const { commonMiddleware } = require('../middleware/commonMiddleware');

// Cache simples em memória
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

// Validações específicas
const notaValidations = {
  titulo: { required: true, type: 'string', minLength: 1, maxLength: 200 },
  conteudo: { required: true, type: 'string', minLength: 1, maxLength: 50000 },
  topico: { type: 'string', maxLength: 100 },
  favorita: { type: 'boolean' }
};

// Função para buscar notas otimizada
const buscarNotasOtimizada = async (userId, filtros = {}) => {
  const cacheKey = `notas_${userId}_${JSON.stringify(filtros)}`;
  
  // Verificar cache
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }
    cache.delete(cacheKey);
  }
  
  // Query otimizada
  let query = db.collection('notas').where('userId', '==', userId);
  
  // Aplicar filtros direto no Firestore quando possível
  if (filtros.favoritas === 'true') {
    query = query.where('favorita', '==', true);
  }
  
  if (filtros.topico) {
    query = query.where('topico', '==', filtros.topico);
  }
  
  // Ordenação e paginação
  query = query.orderBy('dataModificacao', 'desc');
  
  if (filtros.limit) {
    query = query.limit(parseInt(filtros.limit));
  }
  
  if (filtros.offset) {
    query = query.offset(parseInt(filtros.offset));
  }
  
  const snapshot = await query.get();
  const notas = [];
  
  snapshot.forEach(doc => {
    notas.push({
      id: doc.id,
      ...doc.data()
    });
  });
  
  // Salvar no cache
  cache.set(cacheKey, {
    data: notas,
    timestamp: Date.now()
  });
  
  return notas;
};

// Invalidar cache do usuário
const invalidarCache = (userId) => {
  for (const key of cache.keys()) {
    if (key.startsWith(`notas_${userId}_`)) {
      cache.delete(key);
    }
  }
};

module.exports = async function handler(req, res) {
  const middleware = await commonMiddleware(req, res, 'notas');
  if (middleware.skip) return;
  
  const { userId, validateInput, sendResponse, logRequest } = middleware;
  const { method } = req;
  
  try {
    // GET - Buscar notas
    if (method === 'GET') {
      const { favoritas, topico, limit = 50, offset = 0 } = req.query;
      
      const notas = await buscarNotasOtimizada(userId, {
        favoritas,
        topico,
        limit: Math.min(parseInt(limit), 100), // Máximo 100
        offset: parseInt(offset)
      });
      
      logRequest('notas_list_success');
      
      return sendResponse(200, {
        notas,
        count: notas.length,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
    }
    
    // POST - Criar nota
    if (method === 'POST') {
      const errors = validateInput(req.body, notaValidations);
      if (errors.length > 0) {
        return sendResponse(400, { 
          error: 'Dados inválidos',
          details: errors
        });
      }
      
      const { titulo, conteudo, topico, favorita = false } = req.body;
      
      const notaData = {
        titulo: titulo.trim(),
        conteudo: conteudo.trim(),
        userId,
        topico: topico?.trim() || null,
        favorita: Boolean(favorita),
        ativo: true,
        dataCriacao: new Date().toISOString(),
        dataModificacao: new Date().toISOString()
      };
      
      const docRef = await db.collection('notas').add(notaData);
      
      // Invalidar cache
      invalidarCache(userId);
      
      logRequest('nota_create_success');
      
      return sendResponse(201, {
        nota: {
          id: docRef.id,
          ...notaData
        }
      });
    }
    
    // PUT - Atualizar nota
    if (method === 'PUT') {
      const pathParts = req.url.split('/');
      const id = pathParts[pathParts.length - 1];
      
      if (!id) {
        return sendResponse(400, { error: 'ID é obrigatório' });
      }
      
      const errors = validateInput(req.body, {
        titulo: notaValidations.titulo,
        conteudo: notaValidations.conteudo,
        topico: notaValidations.topico
      });
      
      if (errors.length > 0) {
        return sendResponse(400, { 
          error: 'Dados inválidos',
          details: errors
        });
      }
      
      // Verificar propriedade
      const notaDoc = await db.collection('notas').doc(id).get();
      if (!notaDoc.exists) {
        return sendResponse(404, { error: 'Nota não encontrada' });
      }
      
      if (notaDoc.data().userId !== userId) {
        return sendResponse(403, { error: 'Acesso negado' });
      }
      
      const { titulo, conteudo, topico } = req.body;
      
      const updateData = {
        titulo: titulo.trim(),
        conteudo: conteudo.trim(),
        topico: topico?.trim() || null,
        dataModificacao: new Date().toISOString()
      };
      
      await db.collection('notas').doc(id).update(updateData);
      
      // Invalidar cache
      invalidarCache(userId);
      
      logRequest('nota_update_success');
      
      return sendResponse(200, {
        nota: {
          id,
          ...updateData
        }
      });
    }
    
    // PATCH - Favoritar
    if (method === 'PATCH') {
      const pathParts = req.url.split('/');
      const id = pathParts[pathParts.length - 1];
      
      if (!id) {
        return sendResponse(400, { error: 'ID é obrigatório' });
      }
      
      const { favorita } = req.body;
      
      if (typeof favorita !== 'boolean') {
        return sendResponse(400, { 
          error: 'Campo favorita deve ser boolean' 
        });
      }
      
      // Verificar propriedade
      const notaDoc = await db.collection('notas').doc(id).get();
      if (!notaDoc.exists) {
        return sendResponse(404, { error: 'Nota não encontrada' });
      }
      
      if (notaDoc.data().userId !== userId) {
        return sendResponse(403, { error: 'Acesso negado' });
      }
      
      await db.collection('notas').doc(id).update({
        favorita: Boolean(favorita),
        dataModificacao: new Date().toISOString()
      });
      
      // Invalidar cache
      invalidarCache(userId);
      
      logRequest('nota_favorite_success');
      
      return sendResponse(200, {
        nota: {
          id,
          favorita: Boolean(favorita)
        },
        message: `Nota ${favorita ? 'favoritada' : 'desfavoritada'} com sucesso`
      });
    }
    
    // DELETE - Soft delete
    if (method === 'DELETE') {
      const pathParts = req.url.split('/');
      const id = pathParts[pathParts.length - 1];
      
      if (!id) {
        return sendResponse(400, { error: 'ID é obrigatório' });
      }
      
      // Verificar propriedade
      const notaDoc = await db.collection('notas').doc(id).get();
      if (!notaDoc.exists) {
        return sendResponse(404, { error: 'Nota não encontrada' });
      }
      
      if (notaDoc.data().userId !== userId) {
        return sendResponse(403, { error: 'Acesso negado' });
      }
      
      await db.collection('notas').doc(id).update({
        ativo: false,
        dataModificacao: new Date().toISOString()
      });
      
      // Invalidar cache
      invalidarCache(userId);
      
      logRequest('nota_delete_success');
      
      return sendResponse(200, {
        message: 'Nota deletada com sucesso'
      });
    }
    
    return sendResponse(405, { 
      error: 'Método não permitido',
      allowedMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    });
    
  } catch (error) {
    console.error('❌ Erro nas notas:', error);
    logRequest('nota_error');
    
    return sendResponse(500, { 
      error: 'Erro interno do servidor'
    });
  }
};
