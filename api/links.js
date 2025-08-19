const { db } = require('./firebase-config-vercel');

module.exports = async function handler(req, res) {
  // Log detalhado de todas as requisições
  console.log('🚀 === INÍCIO DA REQUISIÇÃO LINKS ===');
  console.log('📝 Method:', req.method);
  console.log('📝 URL:', req.url);
  console.log('📝 Headers:', req.headers);
  console.log('📝 Query:', req.query);
  console.log('📝 Body:', req.body);
  
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, user-id');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Tratar preflight OPTIONS
  if (req.method === 'OPTIONS') {
    console.log('✅ OPTIONS preflight - retornando 200');
    res.status(200).end();
    return;
  }

  const { method } = req;
  const userId = req.headers['user-id'];

  console.log('📝 Method extraído:', method);
  console.log('📝 UserId extraído:', userId);

  if (!userId) {
    console.log('❌ UserId não fornecido');
    return res.status(400).json({
      success: false,
      error: 'User ID não fornecido',
      message: 'Header user-id é obrigatório'
    });
  }

  try {
    // GET - Listar links com queries otimizadas
    if (method === 'GET') {
      console.log('📝 GET /links - Iniciando listagem de links');
      console.log('📝 UserId recebido:', userId);
      
      const { limit = 50, offset = 0, search, categoria, favorito } = req.query;
      
      console.log('📝 Filtros aplicados:', { limit, offset, search, categoria, favorito });
      
      // Query base otimizada
      let query = db.collection('links')
        .where('userId', '==', userId)
        .where('ativo', '==', true)
        .orderBy('dataModificacao', 'desc')
        .limit(parseInt(limit));
      
      // Aplicar filtros adicionais
      if (favorito === 'true') {
        query = query.where('favorito', '==', true);
      }
      
      if (categoria) {
        query = query.where('categoria', '==', categoria);
      }
      
      const linksQuery = await query.get();
      const links = [];
      
      linksQuery.forEach(doc => {
        const linkData = {
          id: doc.id,
          ...doc.data()
        };
        
        // Filtro de busca local (se aplicável)
        if (search) {
          const searchLower = search.toLowerCase();
          const nomeMatch = linkData.nome && linkData.nome.toLowerCase().includes(searchLower);
          const urlMatch = linkData.url && linkData.url.toLowerCase().includes(searchLower);
          
          if (nomeMatch || urlMatch) {
            links.push(linkData);
          }
        } else {
          links.push(linkData);
        }
      });
      
      console.log('📝 Links encontrados:', links.length);
      
      res.json({
        success: true,
        data: links,
        message: `Links do usuário ${userId}`,
        count: links.length,
        limit: parseInt(limit),
        offset: parseInt(offset),
        timestamp: new Date().toISOString()
      });
    }
    
    // POST - Criar link otimizado
    else if (method === 'POST') {
      console.log('📝 POST /links - Iniciando criação de link');
      console.log('📝 Headers recebidos:', req.headers);
      console.log('📝 Body recebido:', req.body);
      
      const { nome, url, imagemUrl, categoria, favorito = false, _method } = req.body;
      
      console.log('📝 Dados extraídos:', { nome, url, imagemUrl, categoria, favorito, _method });
      
      // Verificar se é um POST com _method=PUT (fallback para PUT)
      if (_method === 'PUT') {
        console.log('🔄 POST com _method=PUT detectado, tratando como PUT...');
        
        const { id } = req.query;
        console.log('📝 PUT via POST - ID:', id);
        
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
          console.log('📝 PUT via POST - Buscando documento:', id);
          // Verificar se o link existe e pertence ao usuário
          const linkDoc = await db.collection('links').doc(id).get();
          
          console.log('📝 PUT via POST - Documento existe:', linkDoc.exists);
          
          if (!linkDoc.exists) {
            console.log('❌ Link não encontrado:', id);
            return res.status(404).json({ 
              success: false, 
              error: 'Link não encontrado' 
            });
          }
          
          const linkData = linkDoc.data();
          console.log('📝 PUT via POST - UserId do documento:', linkData.userId);
          console.log('📝 PUT via POST - UserId da requisição:', userId);
          
          if (linkData.userId !== userId) {
            console.log('❌ Link não pertence ao usuário:', id);
            return res.status(403).json({ 
              success: false, 
              error: 'Acesso negado' 
            });
          }
          
          console.log('📝 PUT via POST - Atualizando documento...');
          // Atualizar o link
          await db.collection('links').doc(id).update({
            nome: nome.trim(),
            url: url.trim(),
            imagemUrl: imagemUrl || null,
            categoria: categoria || null,
            favorito: Boolean(favorito),
            dataModificacao: new Date().toISOString()
          });
          
          console.log('📝 PUT via POST - Documento atualizado, buscando dados atualizados...');
          // Buscar o link atualizado para retornar
          const linkAtualizado = await db.collection('links').doc(id).get();
          const dadosAtualizados = {
            id: id,
            ...linkAtualizado.data()
          };
          
          console.log('✅ Link atualizado via POST com sucesso:', id);
          console.log('📝 PUT via POST - Dados atualizados:', dadosAtualizados);
          
          res.json({
            success: true,
            data: dadosAtualizados,
            message: 'Link atualizado com sucesso'
          });
        } catch (dbError) {
          console.error('❌ Erro ao atualizar no banco:', dbError);
          res.status(500).json({ 
            success: false, 
            error: 'Erro interno do servidor' 
          });
        }
        return;
      }
      
      // Validação para criação de link
      if (!nome || !url) {
        console.log('❌ Validação falhou: campos obrigatórios ausentes');
        return res.status(400).json({ 
          success: false, 
          error: 'Nome e URL obrigatórios' 
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
        console.log('📝 POST /links - Criando novo documento...');
        
        const linkData = {
          nome: nome.trim(),
          url: url.trim(),
          imagemUrl: imagemUrl || null,
          categoria: categoria || null,
          favorito: Boolean(favorito),
          userId,
          ativo: true,
          dataCriacao: new Date().toISOString(),
          dataModificacao: new Date().toISOString()
        };
        
        console.log('📝 POST /links - Dados do link:', linkData);
        
        const docRef = await db.collection('links').add(linkData);
        
        console.log('✅ Link criado com sucesso:', docRef.id);
        
        res.status(201).json({
          success: true,
          data: {
            id: docRef.id,
            ...linkData
          },
          message: 'Link criado com sucesso'
        });
      } catch (dbError) {
        console.error('❌ Erro ao criar no banco:', dbError);
        res.status(500).json({ 
          success: false, 
          error: 'Erro interno do servidor' 
        });
      }
    }
    
    // PUT - Atualizar link otimizado
    else if (method === 'PUT') {
      console.log('📝 PUT /links - Iniciando atualização de link');
      
      const { nome, url, imagemUrl, categoria, favorito } = req.body;
      
      console.log('📝 PUT /links - Dados recebidos:', { nome, url, imagemUrl, categoria, favorito });
      console.log('📝 PUT /links - imagemUrl length:', imagemUrl ? imagemUrl.length : 0);
      console.log('📝 PUT /links - ID extraído:', req.query.id);
      console.log('📝 PUT /links - UserId:', userId);
      
      const { id } = req.query;
      
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
          nome: nome.trim(),
          url: url.trim(),
          imagemUrl: imagemUrl || null,
          categoria: categoria || null,
          favorito: Boolean(favorito),
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
          error: 'Erro interno do servidor' 
        });
      }
    }
    
    // DELETE - Deletar link otimizado
    else if (method === 'DELETE') {
      console.log('📝 DELETE /links - Iniciando exclusão de link');
      
      const { id } = req.query;
      console.log('📝 DELETE /links - ID:', id);
      console.log('📝 DELETE /links - UserId:', userId);
      
      if (!id) {
        console.log('❌ ID não fornecido');
        return res.status(400).json({ 
          success: false, 
          error: 'ID obrigatório' 
        });
      }
      
      try {
        console.log('📝 DELETE /links - Buscando documento:', id);
        // Verificar se o link existe e pertence ao usuário
        const linkDoc = await db.collection('links').doc(id).get();
        
        console.log('📝 DELETE /links - Documento existe:', linkDoc.exists);
        
        if (!linkDoc.exists) {
          console.log('❌ Link não encontrado:', id);
          return res.status(404).json({ 
            success: false, 
            error: 'Link não encontrado' 
          });
        }
        
        const linkData = linkDoc.data();
        console.log('📝 DELETE /links - UserId do documento:', linkData.userId);
        console.log('📝 DELETE /links - UserId da requisição:', userId);
        
        if (linkData.userId !== userId) {
          console.log('❌ Link não pertence ao usuário:', id);
          return res.status(403).json({ 
            success: false, 
            error: 'Acesso negado' 
          });
        }
        
        console.log('📝 DELETE /links - Excluindo documento...');
        // Soft delete - marcar como inativo
        await db.collection('links').doc(id).update({
          ativo: false,
          dataModificacao: new Date().toISOString()
        });
        
        console.log('✅ Link excluído com sucesso:', id);
        
        res.json({
          success: true,
          message: 'Link excluído com sucesso'
        });
      } catch (dbError) {
        console.error('❌ Erro ao excluir no banco:', dbError);
        res.status(500).json({ 
          success: false, 
          error: 'Erro interno do servidor' 
        });
      }
    }
    
    else {
      console.log('❌ Método não permitido:', method);
      res.status(405).json({ 
        success: false,
        error: 'Método não permitido',
        allowedMethods: ['GET', 'POST', 'PUT', 'DELETE']
      });
    }
    
  } catch (error) {
    console.error('❌ Erro geral na API de links:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
}; 