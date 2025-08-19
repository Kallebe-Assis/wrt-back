const { db } = require('../firebase-config-vercel');

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
  const { id } = req.query;
  const userId = req.headers['user-id'];

  if (!userId) {
    return res.status(400).json({
      success: false,
      error: 'User ID não fornecido',
      message: 'Header user-id é obrigatório'
    });
  }

  try {
    // GET - Buscar categoria específica
    if (method === 'GET') {
      if (!id) {
        return res.status(400).json({ 
          success: false, 
          error: 'ID obrigatório' 
        });
      }
      
      const categoriaDoc = await db.collection('categorias').doc(id).get();
      
      if (!categoriaDoc.exists) {
        return res.status(404).json({ 
          success: false, 
          error: 'Categoria não encontrada' 
        });
      }
      
      const categoriaData = categoriaDoc.data();
      if (categoriaData.userId !== userId) {
        return res.status(403).json({ 
          success: false, 
          error: 'Acesso negado' 
        });
      }
      
      const categoria = {
        id: categoriaDoc.id,
        ...categoriaData
      };
      
      res.json({
        success: true,
        categoria
      });
    }
    
    // PUT - Atualizar categoria
    else if (method === 'PUT') {
      const { nome, cor } = req.body;
      
      if (!id || !nome) {
        return res.status(400).json({ 
          success: false, 
          error: 'ID e nome obrigatórios' 
        });
      }
      
      // Verificar se a categoria existe e pertence ao usuário
      const categoriaDoc = await db.collection('categorias').doc(id).get();
      
      if (!categoriaDoc.exists) {
        return res.status(404).json({ 
          success: false, 
          error: 'Categoria não encontrada' 
        });
      }
      
      const categoriaData = categoriaDoc.data();
      if (categoriaData.userId !== userId) {
        return res.status(403).json({ 
          success: false, 
          error: 'Acesso negado' 
        });
      }
      
      await db.collection('categorias').doc(id).update({
        nome,
        cor: cor || '#007bff',
        dataModificacao: new Date().toISOString()
      });
      
      res.json({
        success: true,
        message: 'Categoria atualizada com sucesso'
      });
    }
    
    // DELETE - Deletar categoria (soft delete)
    else if (method === 'DELETE') {
      if (!id) {
        return res.status(400).json({ 
          success: false, 
          error: 'ID obrigatório' 
        });
      }
      
      // Verificar se a categoria existe e pertence ao usuário
      const categoriaDoc = await db.collection('categorias').doc(id).get();
      
      if (!categoriaDoc.exists) {
        return res.status(404).json({ 
          success: false, 
          error: 'Categoria não encontrada' 
        });
      }
      
      const categoriaData = categoriaDoc.data();
      if (categoriaData.userId !== userId) {
        return res.status(403).json({ 
          success: false, 
          error: 'Acesso negado' 
        });
      }
      
      await db.collection('categorias').doc(id).update({
        ativo: false,
        dataModificacao: new Date().toISOString()
      });
      
      res.json({
        success: true,
        message: 'Categoria deletada com sucesso'
      });
    }
    
    else {
      res.status(405).json({ error: 'Método não permitido' });
    }
    
  } catch (error) {
    console.error('Erro nas categorias:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    });
  }
}; 