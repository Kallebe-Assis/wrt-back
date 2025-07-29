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
    // GET - Listar links
    if (method === 'GET') {
      console.log('📝 GET /links - Iniciando listagem de links');
      console.log('📝 UserId recebido:', userId);
      
      const linksQuery = await db.collection('links').where('userId', '==', userId).where('ativo', '==', true).get();
      const links = [];
      
      linksQuery.forEach(doc => {
        links.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      console.log('📝 Links encontrados:', links.length);
      
      res.json({
        success: true,
        data: links,
        message: `Links do usuário ${userId}`,
        count: links.length,
        timestamp: new Date().toISOString()
      });
    }
    
    // POST - Criar link
    else if (method === 'POST') {
      console.log('📝 POST /links - Iniciando criação de link');
      console.log('📝 Headers recebidos:', req.headers);
      console.log('📝 Body recebido:', req.body);
      
      const { nome, url, imagemUrl } = req.body;
      
      console.log('📝 Dados extraídos:', { nome, url, imagemUrl });
      
      if (!nome || !url) {
        console.log('❌ Validação falhou: nome ou url ausentes');
        return res.status(400).json({ 
          success: false, 
          error: 'Nome e URL são obrigatórios' 
        });
      }
      
      console.log('✅ Validação passou, salvando no banco...');
      
      try {
        const docRef = await db.collection('links').add({
          nome,
          url,
          imagemUrl: imagemUrl || null,
          favorito: false,
          posicao: 1,
          userId,
          ativo: true,
          dataCriacao: new Date().toISOString(),
          dataModificacao: new Date().toISOString()
        });
        
        console.log('✅ Link salvo com sucesso, ID:', docRef.id);
        
        res.status(201).json({
          success: true,
          data: {
            id: docRef.id,
            nome,
            url,
            imagemUrl: imagemUrl || null,
            favorito: false,
            posicao: 1,
            userId,
            ativo: true
          },
          message: 'Link criado com sucesso'
        });
      } catch (dbError) {
        console.error('❌ Erro ao salvar no banco:', dbError);
        res.status(500).json({
          success: false,
          error: 'Erro ao salvar no banco de dados',
          details: dbError.message
        });
      }
    }
    
    // PUT - Atualizar link
    else if (method === 'PUT') {
      const { id } = req.query;
      const { nome, url, imagemUrl } = req.body;
      
      console.log('📝 PUT /links - Dados recebidos:', { id, nome, url, imagemUrl });
      
      if (!id || !nome || !url) {
        console.log('❌ Validação falhou: campos obrigatórios ausentes');
        return res.status(400).json({ 
          success: false, 
          error: 'ID, nome e URL obrigatórios' 
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
        
        // Atualizar o link
        await db.collection('links').doc(id).update({
          nome,
          url,
          imagemUrl: imagemUrl || null,
          dataModificacao: new Date().toISOString()
        });
        
        // Buscar o link atualizado para retornar
        const linkAtualizado = await db.collection('links').doc(id).get();
        const dadosAtualizados = {
          id: id,
          ...linkAtualizado.data()
        };
        
        console.log('✅ Link atualizado com sucesso:', id);
        
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
      const { id } = req.query;
      
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