const { db } = require('../firebase-config-vercel');

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
  const { id } = req.query;

  try {
    // GET - Buscar nota específica
    if (method === 'GET') {
      if (!id) {
        return res.status(400).json({ 
          success: false, 
          error: 'ID obrigatório' 
        });
      }
      
      const notaDoc = await db.collection('notas').doc(id).get();
      
      if (!notaDoc.exists) {
        return res.status(404).json({ 
          success: false, 
          error: 'Nota não encontrada' 
        });
      }
      
      const nota = {
        id: notaDoc.id,
        ...notaDoc.data()
      };
      
      res.json({
        success: true,
        nota
      });
    }
    
    // PUT - Atualizar nota
    else if (method === 'PUT') {
      const { titulo, conteudo, topico } = req.body;
      
      console.log('📝 Backend - Dados recebidos para atualizar nota:', req.body);
      console.log('📝 Backend - ID da nota:', id);
      console.log('📝 Backend - Tópico recebido:', topico);
      
      if (!id || !titulo || !conteudo) {
        return res.status(400).json({ 
          success: false, 
          error: 'ID, título e conteúdo obrigatórios' 
        });
      }
      
      const updateData = {
        titulo,
        conteudo,
        topico: topico || null,
        dataModificacao: new Date().toISOString()
      };
      
      console.log('📝 Backend - Dados da nota a serem atualizados:', updateData);
      
      await db.collection('notas').doc(id).update(updateData);
      
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
      const userId = req.headers['user-id'];
      const { favorita } = req.body;
      
      console.log('⭐ Alternando favorita:', { id, favorita, userId });
      
      if (!id || typeof favorita !== 'boolean') {
        return res.status(400).json({ 
          success: false, 
          error: 'ID e favorita (boolean) são obrigatórios' 
        });
      }
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
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
    
    // DELETE - Deletar nota (soft delete)
    else if (method === 'DELETE') {
      if (!id) {
        return res.status(400).json({ 
          success: false, 
          error: 'ID obrigatório' 
        });
      }
      
      await db.collection('notas').doc(id).update({
        ativo: false,
        dataModificacao: new Date().toISOString()
      });
      
      res.json({
        success: true,
        message: 'Nota deletada com sucesso'
      });
    }
    
    else {
      res.status(405).json({ error: 'Método não permitido' });
    }
    
  } catch (error) {
    console.error('Erro nas notas:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    });
  }
}; 