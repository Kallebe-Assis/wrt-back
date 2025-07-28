const express = require('express');
const admin = require('firebase-admin');
const bcrypt = require('bcrypt');

// Inicializar Firebase
const serviceAccount = require('./wrtmin-service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware básico
app.use(express.json());

// Middleware adicional para garantir CORS
app.use((req, res, next) => {
  // Garantir que CORS seja aplicado em todas as respostas
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Expose-Headers', '*');
  res.setHeader('Access-Control-Max-Age', '86400');
  
  // Para requisições OPTIONS, responder imediatamente
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
});

// Configuração CORS completamente permissiva - SEM RESTRIÇÕES
app.use((req, res, next) => {
  // Permitir TODAS as origens sem exceção
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // Permitir TODOS os métodos HTTP
  res.setHeader('Access-Control-Allow-Methods', '*');
  
  // Permitir TODOS os headers
  res.setHeader('Access-Control-Allow-Headers', '*');
  
  // Permitir credenciais
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Expor TODOS os headers
  res.setHeader('Access-Control-Expose-Headers', '*');
  
  // Configurações adicionais para evitar problemas
  res.setHeader('Access-Control-Max-Age', '86400');
  
  // Responder imediatamente para requisições OPTIONS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
});

// Rota de teste
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend funcionando!', 
    timestamp: new Date().toISOString() 
  });
});

// LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    
    // Validação
    if (!email || !senha) {
      return res.status(400).json({
        success: false,
        error: 'Email e senha obrigatórios'
      });
    }
    
    // Buscar usuário
    const userQuery = await db.collection('users').where('email', '==', email).get();
    
    if (userQuery.empty) {
      return res.status(401).json({
        success: false,
        error: 'Email ou senha inválidos'
      });
    }
    
    const userDoc = userQuery.docs[0];
    const userData = userDoc.data();
    
    // Verificar se usuário está ativo
    if (!userData.ativo) {
      return res.status(401).json({
        success: false,
        error: 'Usuário inativo'
      });
    }
    
    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, userData.senha);
    if (!senhaValida) {
      return res.status(401).json({
        success: false,
        error: 'Email ou senha inválidos'
      });
    }
    
    // Sucesso
    res.json({
      success: true,
      usuario: {
        id: userDoc.id,
        nome: userData.nome,
        email: userData.email,
        role: userData.role,
        ativo: userData.ativo
      },
      message: 'Login realizado com sucesso'
    });
    
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// CADASTRO
app.post('/api/auth/register', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    
    // Validação
    if (!nome || !email || !senha) {
      return res.status(400).json({
        success: false,
        error: 'Nome, email e senha obrigatórios'
      });
    }
    
    // Verificar se email já existe
    const userQuery = await db.collection('users').where('email', '==', email).get();
    
    if (!userQuery.empty) {
      return res.status(409).json({
        success: false,
        error: 'Email já cadastrado'
      });
    }
    
    // Hash da senha
    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(senha, saltRounds);
    
    // Criar usuário
    const docRef = await db.collection('users').add({
      nome,
      email,
      senha: senhaHash,
      role: 'user', // Padrão é user
      ativo: true, // Padrão é ativo
      dataCriacao: new Date().toISOString()
    });
    
    res.status(201).json({
      success: true,
      usuario: {
        id: docRef.id,
        nome,
        email,
        role: 'user',
        ativo: true
      },
      message: 'Usuário cadastrado com sucesso'
    });
    
  } catch (error) {
    console.error('Erro no cadastro:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// NOTAS - Buscar
app.get('/api/notas', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId obrigatório'
      });
    }
    
    const notasQuery = await db.collection('notas').where('userId', '==', userId).where('ativo', '==', true).get();
    const notas = [];
    
    notasQuery.forEach(doc => {
      notas.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json({
      success: true,
      notas
    });
    
  } catch (error) {
    console.error('Erro ao buscar notas:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// NOTAS - Buscar Favoritas
app.get('/api/notas/favoritas', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId obrigatório'
      });
    }
    
    const notasQuery = await db.collection('notas')
      .where('userId', '==', userId)
      .where('ativo', '==', true)
      .where('favorito', '==', true)
      .get();
    
    const notas = [];
    
    notasQuery.forEach(doc => {
      notas.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json({
      success: true,
      notas
    });
    
  } catch (error) {
    console.error('Erro ao buscar notas favoritas:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// NOTAS - Criar
app.post('/api/notas', async (req, res) => {
  try {
    const { titulo, conteudo, topico, userId, categoria, favorito = false } = req.body;
    
    if (!titulo || !conteudo || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Título, conteúdo e userId obrigatórios'
      });
    }
    
    const docRef = await db.collection('notas').add({
      titulo,
      conteudo,
      topico: topico || null,
      userId,
      categoria: categoria || null,
      favorito: favorito || false,
      ativo: true,
      dataCriacao: new Date().toISOString()
    });
    
    res.status(201).json({
      success: true,
      nota: {
        id: docRef.id,
        titulo,
        conteudo,
        topico: topico || null,
        userId,
        categoria: categoria || null,
        favorito: favorito || false,
        ativo: true,
        dataCriacao: new Date().toISOString()
      },
      message: 'Nota criada com sucesso'
    });
    
  } catch (error) {
    console.error('Erro ao criar nota:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// NOTAS - Atualizar
app.put('/api/notas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, conteudo, topico, categoria, favorito } = req.body;
    
    if (!titulo || !conteudo) {
      return res.status(400).json({
        success: false,
        error: 'Título e conteúdo obrigatórios'
      });
    }
    
    const updateData = {
      titulo,
      conteudo,
      dataModificacao: new Date().toISOString()
    };
    
    if (topico !== undefined) updateData.topico = topico;
    if (categoria !== undefined) updateData.categoria = categoria;
    if (favorito !== undefined) updateData.favorito = favorito;
    
    await db.collection('notas').doc(id).update(updateData);
    
    res.json({
      success: true,
      message: 'Nota atualizada com sucesso'
    });
    
  } catch (error) {
    console.error('Erro ao atualizar nota:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// NOTAS - Alternar Favorito
app.patch('/api/notas/:id/favorito', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar a nota atual para obter o status de favorito
    const notaDoc = await db.collection('notas').doc(id).get();
    
    if (!notaDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Nota não encontrada'
      });
    }
    
    const nota = notaDoc.data();
    const novoStatus = !nota.favorito; // Inverter o status atual
    
    await db.collection('notas').doc(id).update({
      favorito: novoStatus,
      dataModificacao: new Date().toISOString()
    });
    
    res.json({
      success: true,
      message: novoStatus ? 'Nota marcada como favorita' : 'Nota desmarcada como favorita',
      favorito: novoStatus
    });
    
  } catch (error) {
    console.error('Erro ao alternar favorito:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// NOTAS - Deletar (soft delete)
app.delete('/api/notas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.collection('notas').doc(id).update({
      ativo: false,
      dataModificacao: new Date().toISOString()
    });
    
    res.json({
      success: true,
      message: 'Nota deletada com sucesso'
    });
    
  } catch (error) {
    console.error('Erro ao deletar nota:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// LINKS - Buscar
app.get('/api/links', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId obrigatório'
      });
    }
    
    const linksQuery = await db.collection('links').where('userId', '==', userId).where('ativo', '==', true).get();
    const links = [];
    
    linksQuery.forEach(doc => {
      links.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json({
      success: true,
      links
    });
    
  } catch (error) {
    console.error('Erro ao buscar links:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// LINKS - Criar
app.post('/api/links', async (req, res) => {
  try {
    const { nome, url, userId, urlImagem, categoria, posicao } = req.body;
    
    console.log('📝 Dados recebidos para criar link:', { nome, url, userId, urlImagem, categoria, posicao });
    
    if (!nome || !url || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Nome, URL e userId obrigatórios'
      });
    }
    
    const docRef = await db.collection('links').add({
      nome,
      url,
      userId,
      urlImagem: urlImagem || null,
      categoria: categoria || null,
      posicao: posicao || 0,
      ativo: true,
      dataCriacao: new Date().toISOString()
    });
    
    res.status(201).json({
      success: true,
      link: {
        id: docRef.id,
        nome,
        url,
        userId,
        urlImagem: urlImagem || null,
        categoria: categoria || null,
        posicao: posicao || 0,
        ativo: true,
        dataCriacao: new Date().toISOString()
      },
      message: 'Link criado com sucesso'
    });
    
  } catch (error) {
    console.error('Erro ao criar link:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// LINKS - Atualizar
app.put('/api/links/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, url, urlImagem, categoria } = req.body;
    
    if (!nome || !url) {
      return res.status(400).json({
        success: false,
        error: 'Nome e URL obrigatórios'
      });
    }
    
    const updateData = {
      nome,
      url,
      dataModificacao: new Date().toISOString()
    };
    
    if (urlImagem !== undefined) updateData.urlImagem = urlImagem;
    if (categoria !== undefined) updateData.categoria = categoria;
    
    await db.collection('links').doc(id).update(updateData);
    
    res.json({
      success: true,
      message: 'Link atualizado com sucesso'
    });
    
  } catch (error) {
    console.error('Erro ao atualizar link:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// LINKS - Deletar (soft delete)
app.delete('/api/links/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.collection('links').doc(id).update({
      ativo: false,
      dataModificacao: new Date().toISOString()
    });
    
    res.json({
      success: true,
      message: 'Link deletado com sucesso'
    });
    
  } catch (error) {
    console.error('Erro ao deletar link:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// CATEGORIAS - Buscar todas
app.get('/api/categorias', async (req, res) => {
  try {
    const categoriasQuery = await db.collection('categorias').get();
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
    
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// CATEGORIAS - Buscar por ID
app.get('/api/categorias/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const doc = await db.collection('categorias').doc(id).get();
    
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Categoria não encontrada'
      });
    }
    
    res.json({
      success: true,
      categoria: {
        id: doc.id,
        ...doc.data()
      }
    });
    
  } catch (error) {
    console.error('Erro ao buscar categoria:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// CATEGORIAS - Criar
app.post('/api/categorias', async (req, res) => {
  try {
    const { nome, cor } = req.body;
    
    if (!nome || !cor) {
      return res.status(400).json({
        success: false,
        error: 'Nome e cor obrigatórios'
      });
    }
    
    const docRef = await db.collection('categorias').add({
      nome,
      cor,
      dataCriacao: new Date().toISOString()
    });
    
    res.status(201).json({
      success: true,
      categoria: {
        id: docRef.id,
        nome,
        cor
      },
      message: 'Categoria criada com sucesso'
    });
    
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// CATEGORIAS - Atualizar
app.put('/api/categorias/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, cor } = req.body;
    
    if (!nome || !cor) {
      return res.status(400).json({
        success: false,
        error: 'Nome e cor obrigatórios'
      });
    }
    
    await db.collection('categorias').doc(id).update({
      nome,
      cor,
      dataModificacao: new Date().toISOString()
    });
    
    res.json({
      success: true,
      message: 'Categoria atualizada com sucesso'
    });
    
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// CATEGORIAS - Deletar
app.delete('/api/categorias/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.collection('categorias').doc(id).delete();
    
    res.json({
      success: true,
      message: 'Categoria deletada com sucesso'
    });
    
  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📡 Teste: http://localhost:${PORT}/api/test`);
}); 