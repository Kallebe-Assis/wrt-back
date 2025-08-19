const { db } = require('./firebase-config-vercel');

module.exports = async function handler(req, res) {
  // Configurar CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
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
    // GET - Buscar categorias com queries otimizadas
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
    
    // POST - Criar categoria otimizada
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
      
      // Verificar se já existe categoria com mesmo nome
      const existingQuery = await db.collection('categorias')
        .where('userId', '==', userId)
        .where('nome', '==', nome.trim())
        .where('ativo', '==', true)
        .get();
      
      if (!existingQuery.empty) {
        return res.status(409).json({
          success: false,
          error: 'Já existe uma categoria com este nome'
        });
      }
      
      const categoriaData = {
        nome: nome.trim(),
        cor: cor.toUpperCase(),
        descricao: descricao ? descricao.trim() : null,
        icone: icone || null,
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
    
    // PUT - Atualizar categoria otimizada
    else if (method === 'PUT') {
      const pathParts = req.url.split('/');
      const id = pathParts[pathParts.length - 1];
      
      const { nome, cor, descricao, icone } = req.body;
      
      console.log('🏷️ Atualizando categoria:', { id, nome, cor, descricao, icone, userId });
      
      if (!id || !nome || !cor) {
        return res.status(400).json({ 
          success: false, 
          error: 'ID, nome e cor são obrigatórios' 
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
      
      // Verificar se já existe outra categoria com mesmo nome
      const existingQuery = await db.collection('categorias')
        .where('userId', '==', userId)
        .where('nome', '==', nome.trim())
        .where('ativo', '==', true)
        .get();
      
      const existingCategoria = existingQuery.docs.find(doc => doc.id !== id);
      if (existingCategoria) {
        return res.status(409).json({
          success: false,
          error: 'Já existe uma categoria com este nome'
        });
      }
      
      const updateData = {
        nome: nome.trim(),
        cor: cor.toUpperCase(),
        descricao: descricao ? descricao.trim() : null,
        icone: icone || null,
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
    
    // DELETE - Soft delete otimizado
    else if (method === 'DELETE') {
      const pathParts = req.url.split('/');
      const id = pathParts[pathParts.length - 1];
      
      console.log('🗑️ Deletando categoria:', { id, userId });
      
      if (!id) {
        return res.status(400).json({ 
          success: false, 
          error: 'ID é obrigatório' 
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
      
      // Verificar se há notas ou links usando esta categoria
      const notasQuery = await db.collection('notas')
        .where('categoria', '==', id)
        .where('ativo', '==', true)
        .limit(1)
        .get();
      
      const linksQuery = await db.collection('links')
        .where('categoria', '==', id)
        .where('ativo', '==', true)
        .limit(1)
        .get();
      
      if (!notasQuery.empty || !linksQuery.empty) {
        return res.status(400).json({
          success: false,
          error: 'Não é possível excluir categoria que está sendo usada por notas ou links'
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
    
  } catch (error) {
    console.error('❌ Erro nas categorias:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
}; 