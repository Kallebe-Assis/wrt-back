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
    // GET - Buscar link específico
    if (method === 'GET') {
      if (!id) {
        return res.status(400).json({ 
          success: false, 
          error: 'ID obrigatório' 
        });
      }
      
      const linkDoc = await db.collection('links').doc(id).get();
      
      if (!linkDoc.exists) {
        return res.status(404).json({ 
          success: false, 
          error: 'Link não encontrado' 
        });
      }
      
      const linkData = linkDoc.data();
      if (linkData.userId !== userId) {
        return res.status(403).json({ 
          success: false, 
          error: 'Acesso negado' 
        });
      }
      
      const link = {
        id: linkDoc.id,
        ...linkData
      };
      
      res.json({
        success: true,
        data: link
      });
    }
    
    // PUT - Atualizar link
    else if (method === 'PUT') {
      const { nome, url, imagemUrl } = req.body;
      
      console.log('📝 PUT /links - Dados recebidos:', { id, nome, url });
      console.log('📝 PUT /links - imagemUrl length:', imagemUrl ? imagemUrl.length : 0);
      console.log('📝 PUT /links - ID extraído:', id);
      console.log('📝 PUT /links - UserId:', userId);
      
      if (!id || !nome || !url) {
        console.log('❌ Validação falhou: campos obrigatórios ausentes');
        return res.status(400).json({ 
          success: false, 
          error: 'ID, nome e URL obrigatórios' 
        });
      }
      
      // Verificar tamanho da imagem (máximo 1MB)
      if (imagemUrl && imagemUrl.length > 1000000) {
        console.log('❌ Imagem muito grande:', imagemUrl.length, 'bytes');
        return res.status(400).json({ 
          success: false, 
          error: 'Imagem muito grande. Máximo 1MB.' 
        });
      }
      
      try {
        console.log('📝 PUT /links - Buscando documento:', id);
        // Verificar se o link existe e pertence ao usuário
        const linkDoc = await db.collection('links').doc(id).get();
        
        console.log('📝 PUT /links - Documento existe:', linkDoc.exists);
        
        if (!linkDoc.exists) {
          console.log('❌ Link não encontrado:', id);
          return res.status(404).json({ 
            success: false, 
            error: 'Link não encontrado' 
          });
        }
        
        const linkData = linkDoc.data();
        console.log('📝 PUT /links - Dados do documento:', linkData);
        console.log('📝 PUT /links - UserId do documento:', linkData.userId);
        console.log('📝 PUT /links - UserId da requisição:', userId);
        
        if (linkData.userId !== userId) {
          console.log('❌ Link não pertence ao usuário:', id);
          return res.status(403).json({ 
            success: false, 
            error: 'Acesso negado' 
          });
        }
        
        console.log('📝 PUT /links - Atualizando documento...');
        // Atualizar o link
        await db.collection('links').doc(id).update({
          nome,
          url,
          imagemUrl: imagemUrl || null,
          dataModificacao: new Date().toISOString()
        });
        
        console.log('📝 PUT /links - Documento atualizado, buscando dados atualizados...');
        // Buscar o link atualizado para retornar
        const linkAtualizado = await db.collection('links').doc(id).get();
        const dadosAtualizados = {
          id: id,
          ...linkAtualizado.data()
        };
        
        console.log('✅ Link atualizado com sucesso:', id);
        console.log('📝 PUT /links - Dados atualizados:', dadosAtualizados);
        
        res.json({
          success: true,
          data: dadosAtualizados,
          message: 'Link atualizado com sucesso'
        });
      } catch (dbError) {
        console.error('❌ Erro ao atualizar no banco:', dbError);
        res.status(500).json({
          success: false,
          error: 'Erro ao atualizar no banco de dados',
          details: dbError.message
        });
      }
    }
    
    // DELETE - Deletar link (hard delete)
    else if (method === 'DELETE') {
      if (!id) {
        return res.status(400).json({ 
          success: false, 
          error: 'ID obrigatório' 
        });
      }
      
      try {
        // Verificar se o link existe e pertence ao usuário
        const linkDoc = await db.collection('links').doc(id).get();
        
        if (!linkDoc.exists) {
          console.log('❌ Link não encontrado:', id);
          return res.status(404).json({ 
            success: false, 
            error: 'Link não encontrado' 
          });
        }
        
        const linkData = linkDoc.data();
        if (linkData.userId !== userId) {
          console.log('❌ Link não pertence ao usuário:', id);
          return res.status(403).json({ 
            success: false, 
            error: 'Acesso negado' 
          });
        }
        
        // Deletar o link completamente (hard delete)
        await db.collection('links').doc(id).delete();
        
        console.log('✅ Link deletado com sucesso:', id);
        
        res.json({
          success: true,
          message: 'Link deletado com sucesso'
        });
      } catch (dbError) {
        console.error('❌ Erro ao deletar no banco:', dbError);
        res.status(500).json({
          success: false,
          error: 'Erro ao deletar no banco de dados',
          details: dbError.message
        });
      }
    }
    
    else {
      res.status(405).json({ error: 'Método não permitido' });
    }
    
  } catch (error) {
    console.error('Erro nos links:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    });
  }
}; 