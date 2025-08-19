const { db } = require('./firebase-config-vercel');
const { commonMiddleware } = require('../middleware/commonMiddleware');

// Cache simples em memória
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

// Validações específicas
const linkValidations = {
  nome: { required: true, type: 'string', minLength: 1, maxLength: 100 },
  url: { 
    required: true, 
    type: 'string', 
    minLength: 1, 
    maxLength: 2000,
    pattern: /^https?:\/\/.+/
  },
  categoria: { type: 'string', maxLength: 50 },
  favorito: { type: 'boolean' }
};

// Função para buscar links otimizada
const buscarLinksOtimizada = async (userId, filtros = {}) => {
  const cacheKey = `links_${userId}_${JSON.stringify(filtros)}`;
  
  // Verificar cache
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }
    cache.delete(cacheKey);
  }
  
  // Query otimizada
  let query = db.collection('links').where('userId', '==', userId);
  
  // Aplicar filtros direto no Firestore quando possível
  if (filtros.favorito === 'true') {
    query = query.where('favorito', '==', true);
  }
  
  if (filtros.categoria) {
    query = query.where('categoria', '==', filtros.categoria);
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
  let links = [];
  
  snapshot.forEach(doc => {
    links.push({
      id: doc.id,
      ...doc.data()
    });
  });
  
  // Aplicar filtro de busca localmente (se necessário)
  if (filtros.search) {
    const searchLower = filtros.search.toLowerCase();
    links = links.filter(link => 
      link.nome?.toLowerCase().includes(searchLower) ||
      link.url?.toLowerCase().includes(searchLower)
    );
  }
  
  // Salvar no cache
  cache.set(cacheKey, {
    data: links,
    timestamp: Date.now()
  });
  
  return links;
};

// Invalidar cache do usuário
const invalidarCache = (userId) => {
  for (const key of cache.keys()) {
    if (key.startsWith(`links_${userId}_`)) {
      cache.delete(key);
    }
  }
};

// Validar URL
const validarURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

module.exports = async function handler(req, res) {
  const middleware = await commonMiddleware(req, res, 'links');
  if (middleware.skip) return;
  
  const { userId, validateInput, sendResponse, logRequest } = middleware;
  const { method } = req;
  
  try {
    // GET - Buscar links
    if (method === 'GET') {
      const { favorito, categoria, search, limit = 50, offset = 0 } = req.query;
      
      const links = await buscarLinksOtimizada(userId, {
        favorito,
        categoria,
        search,
        limit: Math.min(parseInt(limit), 100), // Máximo 100
        offset: parseInt(offset)
      });
      
      logRequest('links_list_success');
      
      return sendResponse(200, {
        data: links,
        message: `Links do usuário`,
        count: links.length,
        limit: parseInt(limit),
        offset: parseInt(offset),
        timestamp: new Date().toISOString()
      });
    }
    
    // POST - Criar link
    if (method === 'POST') {
      const { _method } = req.body;
      
      // Handle PUT via POST (fallback)
      if (_method === 'PUT') {
        return handlePutViaPost(req, res, userId, validateInput, sendResponse, logRequest);
      }
      
      const errors = validateInput(req.body, linkValidations);
      if (errors.length > 0) {
        return sendResponse(400, { 
          error: 'Dados inválidos',
          details: errors
        });
      }
      
      const { nome, url, imagemUrl, categoria, favorito = false } = req.body;
      
      // Validação adicional de URL
      if (!validarURL(url)) {
        return sendResponse(400, { 
          error: 'URL inválida. Deve começar com http:// ou https://'
        });
      }
      
      // Verificar tamanho da imagem (máximo 1MB)
      if (imagemUrl && imagemUrl.length > 1000000) {
        return sendResponse(400, { 
          error: 'Imagem muito grande. Máximo 1MB.'
        });
      }
      
      const linkData = {
        nome: nome.trim(),
        url: url.trim(),
        imagemUrl: imagemUrl || null,
        categoria: categoria?.trim() || null,
        favorito: Boolean(favorito),
        userId,
        ativo: true,
        dataCriacao: new Date().toISOString(),
        dataModificacao: new Date().toISOString()
      };
      
      const docRef = await db.collection('links').add(linkData);
      
      // Invalidar cache
      invalidarCache(userId);
      
      logRequest('link_create_success');
      
      return sendResponse(201, {
        data: {
          id: docRef.id,
          ...linkData
        },
        message: 'Link criado com sucesso'
      });
    }
    
    // PUT - Atualizar link
    if (method === 'PUT') {
      const { id } = req.query;
      
      if (!id) {
        return sendResponse(400, { error: 'ID é obrigatório' });
      }
      
      const errors = validateInput(req.body, linkValidations);
      if (errors.length > 0) {
        return sendResponse(400, { 
          error: 'Dados inválidos',
          details: errors
        });
      }
      
      const { nome, url, imagemUrl, categoria, favorito } = req.body;
      
      // Validação adicional de URL
      if (!validarURL(url)) {
        return sendResponse(400, { 
          error: 'URL inválida. Deve começar com http:// ou https://'
        });
      }
      
      // Verificar tamanho da imagem (máximo 1MB)
      if (imagemUrl && imagemUrl.length > 1000000) {
        return sendResponse(400, { 
          error: 'Imagem muito grande. Máximo 1MB.'
        });
      }
      
      // Verificar propriedade
      const linkDoc = await db.collection('links').doc(id).get();
      if (!linkDoc.exists) {
        return sendResponse(404, { error: 'Link não encontrado' });
      }
      
      if (linkDoc.data().userId !== userId) {
        return sendResponse(403, { error: 'Acesso negado' });
      }
      
      const updateData = {
        nome: nome.trim(),
        url: url.trim(),
        imagemUrl: imagemUrl || null,
        categoria: categoria?.trim() || null,
        favorito: Boolean(favorito),
        dataModificacao: new Date().toISOString()
      };
      
      await db.collection('links').doc(id).update(updateData);
      
      // Invalidar cache
      invalidarCache(userId);
      
      logRequest('link_update_success');
      
      return sendResponse(200, {
        data: {
          id,
          ...updateData
        },
        message: 'Link atualizado com sucesso'
      });
    }
    
    // DELETE - Soft delete
    if (method === 'DELETE') {
      const { id } = req.query;
      
      if (!id) {
        return sendResponse(400, { error: 'ID é obrigatório' });
      }
      
      // Verificar propriedade
      const linkDoc = await db.collection('links').doc(id).get();
      if (!linkDoc.exists) {
        return sendResponse(404, { error: 'Link não encontrado' });
      }
      
      if (linkDoc.data().userId !== userId) {
        return sendResponse(403, { error: 'Acesso negado' });
      }
      
      await db.collection('links').doc(id).update({
        ativo: false,
        dataModificacao: new Date().toISOString()
      });
      
      // Invalidar cache
      invalidarCache(userId);
      
      logRequest('link_delete_success');
      
      return sendResponse(200, {
        message: 'Link excluído com sucesso'
      });
    }
    
    return sendResponse(405, { 
      error: 'Método não permitido',
      allowedMethods: ['GET', 'POST', 'PUT', 'DELETE']
    });
    
  } catch (error) {
    console.error('❌ Erro nos links:', error);
    logRequest('link_error');
    
    return sendResponse(500, { 
      error: 'Erro interno do servidor'
    });
  }
};

// Função auxiliar para PUT via POST
async function handlePutViaPost(req, res, userId, validateInput, sendResponse, logRequest) {
  const { id } = req.query;
  
  if (!id) {
    return sendResponse(400, { error: 'ID é obrigatório' });
  }
  
  const errors = validateInput(req.body, linkValidations);
  if (errors.length > 0) {
    return sendResponse(400, { 
      error: 'Dados inválidos',
      details: errors
    });
  }
  
  const { nome, url, imagemUrl, categoria, favorito } = req.body;
  
  // Verificar propriedade
  const linkDoc = await db.collection('links').doc(id).get();
  if (!linkDoc.exists) {
    return sendResponse(404, { error: 'Link não encontrado' });
  }
  
  if (linkDoc.data().userId !== userId) {
    return sendResponse(403, { error: 'Acesso negado' });
  }
  
  const updateData = {
    nome: nome.trim(),
    url: url.trim(),
    imagemUrl: imagemUrl || null,
    categoria: categoria?.trim() || null,
    favorito: Boolean(favorito),
    dataModificacao: new Date().toISOString()
  };
  
  await db.collection('links').doc(id).update(updateData);
  
  // Invalidar cache
  invalidarCache(userId);
  
  logRequest('link_update_via_post_success');
  
  return sendResponse(200, {
    data: {
      id,
      ...updateData
    },
    message: 'Link atualizado com sucesso'
  });
}
