const { db } = require('./firebase-config-vercel');

module.exports = async function handler(req, res) {
  // Tratar preflight OPTIONS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { method } = req;
  const userId = req.headers['user-id'];

  if (!userId) {
    return res.status(400).json({
      success: false,
      error: 'User ID não fornecido',
      message: 'Header user-id é obrigatório'
    });
  }

  try {
    // GET - Listar categorias
    if (method === 'GET') {
      const categoriasQuery = await db.collection('categorias').where('userId', '==', userId).where('ativo', '==', true).get();
      const categorias = [];
      
      categoriasQuery.forEach(doc => {
        categorias.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      res.json({
        success: true,
        categorias
      });
    }
    
    // POST - Criar categoria
    else if (method === 'POST') {
      const { nome, cor } = req.body;
      
      if (!nome) {
        return res.status(400).json({ 
          success: false, 
          error: 'Nome é obrigatório' 
        });
      }
      
      const docRef = await db.collection('categorias').add({
        nome,
        cor: cor || '#007bff',
        userId,
        ativo: true,
        dataCriacao: new Date().toISOString(),
        dataModificacao: new Date().toISOString()
      });
      
      res.status(201).json({
        success: true,
        categoria: {
          id: docRef.id,
          nome,
          cor: cor || '#007bff',
          userId,
          ativo: true
        },
        message: 'Categoria criada com sucesso'
      });
    }
    
    // PUT - Atualizar categoria
    else if (method === 'PUT') {
      const { id } = req.query;
      const { nome, cor } = req.body;
      
      if (!id || !nome) {
        return res.status(400).json({ 
          success: false, 
          error: 'ID e nome obrigatórios' 
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
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ 
          success: false, 
          error: 'ID obrigatório' 
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