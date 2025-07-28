const { setupCORS } = require('./cors');
const { db } = require('./firebase-config');

module.exports = async function handler(req, res) {
  // Configurar CORS
  const corsHandled = setupCORS(req, res);
  if (corsHandled) return;

  const { method, url } = req;
  const path = url.split('?')[0]; // Remove query parameters

  try {
    // Rota: /api/health
    if (path === '/api/health' && method === 'GET') {
      return res.status(200).json({
        status: 'OK',
        message: 'WRTmind Backend API funcionando!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      });
    }

    // Rota: /api/test
    if (path === '/api/test') {
      return res.json({
        success: true,
        message: 'API funcionando corretamente!',
        timestamp: new Date().toISOString(),
        method: method,
        url: url
      });
    }

    // Rota: /api/notas
    if (path === '/api/notas') {
      return handleNotas(req, res);
    }

    // Rota: /api/links
    if (path === '/api/links') {
      return handleLinks(req, res);
    }

    // Rota: /api/categorias
    if (path === '/api/categorias') {
      return handleCategorias(req, res);
    }

    // Rota: /api/auth/login
    if (path === '/api/auth/login' && method === 'POST') {
      return handleAuthLogin(req, res);
    }

    // Rota: /api/auth/register
    if (path === '/api/auth/register' && method === 'POST') {
      return handleAuthRegister(req, res);
    }

    // Rota: /api/auth/logout
    if (path === '/api/auth/logout' && method === 'POST') {
      return handleAuthLogout(req, res);
    }

    // Rota não encontrada
    res.status(404).json({
      success: false,
      error: 'Rota não encontrada',
      path: path,
      method: method
    });

  } catch (error) {
    console.error('Erro na API:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
};

// Handler para notas
async function handleNotas(req, res) {
  const { method } = req;

  try {
    // GET - Buscar notas
    if (method === 'GET') {
      const { userId } = req.query;
      
      if (!userId) {
        return res.status(400).json({ 
          success: false, 
          error: 'userId obrigatório' 
        });
      }
      
      const notasQuery = await db.collection('notas').where('userId', '==', userId).get();
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
    }
    
    // POST - Criar nota
    else if (method === 'POST') {
      const { titulo, conteudo, userId } = req.body;
      
      if (!titulo || !conteudo || !userId) {
        return res.status(400).json({ 
          success: false, 
          error: 'Título, conteúdo e userId obrigatórios' 
        });
      }
      
      const docRef = await db.collection('notas').add({
        titulo,
        conteudo,
        userId,
        dataCriacao: new Date().toISOString(),
        dataModificacao: new Date().toISOString()
      });
      
      res.status(201).json({
        success: true,
        nota: {
          id: docRef.id,
          titulo,
          conteudo,
          userId
        },
        message: 'Nota criada com sucesso'
      });
    }
    
    // PUT - Atualizar nota
    else if (method === 'PUT') {
      const { id } = req.query;
      const { titulo, conteudo } = req.body;
      
      if (!id || !titulo || !conteudo) {
        return res.status(400).json({ 
          success: false, 
          error: 'ID, título e conteúdo obrigatórios' 
        });
      }
      
      await db.collection('notas').doc(id).update({
        titulo,
        conteudo,
        dataModificacao: new Date().toISOString()
      });
      
      res.json({
        success: true,
        message: 'Nota atualizada com sucesso'
      });
    }
    
    // DELETE - Deletar nota
    else if (method === 'DELETE') {
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ 
          success: false, 
          error: 'ID obrigatório' 
        });
      }
      
      await db.collection('notas').doc(id).delete();
      
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
}

// Handler para links (mock data)
function handleLinks(req, res) {
  const { method } = req;
  const userId = req.headers['user-id'];

  // Dados mock específicos do usuário
  const mockLinks = {
    'user1': [
      {
        id: 1,
        titulo: 'Google',
        url: 'https://google.com',
        descricao: 'Motor de busca',
        categoria: 'Geral',
        favorito: false,
        posicao: 1,
        userId: 'user1',
        createdAt: '2025-01-15T10:00:00.000Z',
        updatedAt: '2025-01-15T10:00:00.000Z'
      },
      {
        id: 2,
        titulo: 'GitHub',
        url: 'https://github.com',
        descricao: 'Plataforma de desenvolvimento',
        categoria: 'Desenvolvimento',
        favorito: true,
        posicao: 2,
        userId: 'user1',
        createdAt: '2025-01-16T11:00:00.000Z',
        updatedAt: '2025-01-16T11:00:00.000Z'
      }
    ],
    'kallebe': [
      {
        id: 5,
        titulo: 'G2 Telecom',
        url: 'https://g2telecom.com.br',
        descricao: 'Site da empresa G2 Telecom',
        categoria: 'Trabalho',
        favorito: true,
        posicao: 1,
        userId: 'kallebe',
        createdAt: '2025-01-10T09:00:00.000Z',
        updatedAt: '2025-01-10T09:00:00.000Z'
      }
    ]
  };

  try {
    switch (method) {
      case 'GET':
        if (!userId) {
          return res.status(400).json({
            success: false,
            error: 'User ID não fornecido',
            message: 'Header user-id é obrigatório'
          });
        }

        const userLinks = mockLinks[userId] || [];
        
        res.status(200).json({
          success: true,
          data: userLinks,
          message: `Links do usuário ${userId}`,
          count: userLinks.length,
          timestamp: new Date().toISOString()
        });
        break;

      case 'POST':
        if (!userId) {
          return res.status(400).json({
            success: false,
            error: 'User ID não fornecido',
            message: 'Header user-id é obrigatório'
          });
        }

        const newLink = {
          id: Date.now(),
          ...req.body,
          userId: userId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        if (!mockLinks[userId]) {
          mockLinks[userId] = [];
        }
        mockLinks[userId].push(newLink);

        res.status(201).json({
          success: true,
          data: newLink,
          message: 'Link criado com sucesso'
        });
        break;

      default:
        res.status(405).json({
          success: false,
          error: 'Método não permitido',
          allowedMethods: ['GET', 'POST']
        });
    }
  } catch (error) {
    console.error('Erro no endpoint /links:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
}

// Handler para categorias (mock data)
function handleCategorias(req, res) {
  const { method } = req;
  const userId = req.headers['user-id'];

  // Dados mock específicos do usuário
  const mockCategorias = {
    'user1': [
      {
        id: 1,
        nome: 'Geral',
        cor: '#007bff',
        userId: 'user1',
        deletedAt: null,
        createdAt: '2025-01-15T10:00:00.000Z',
        updatedAt: '2025-01-15T10:00:00.000Z'
      },
      {
        id: 2,
        nome: 'Desenvolvimento',
        cor: '#28a745',
        userId: 'user1',
        deletedAt: null,
        createdAt: '2025-01-16T11:00:00.000Z',
        updatedAt: '2025-01-16T11:00:00.000Z'
      }
    ],
    'kallebe': [
      {
        id: 7,
        nome: 'Trabalho',
        cor: '#007bff',
        userId: 'kallebe',
        deletedAt: null,
        createdAt: '2025-01-10T09:00:00.000Z',
        updatedAt: '2025-01-10T09:00:00.000Z'
      },
      {
        id: 8,
        nome: 'Desenvolvimento',
        cor: '#28a745',
        userId: 'kallebe',
        deletedAt: null,
        createdAt: '2025-01-11T10:00:00.000Z',
        updatedAt: '2025-01-11T10:00:00.000Z'
      }
    ]
  };

  try {
    switch (method) {
      case 'GET':
        if (!userId) {
          return res.status(400).json({
            success: false,
            error: 'User ID não fornecido',
            message: 'Header user-id é obrigatório'
          });
        }

        const userCategorias = mockCategorias[userId] || [];
        
        res.status(200).json({
          success: true,
          data: userCategorias,
          message: `Categorias do usuário ${userId}`,
          count: userCategorias.length,
          timestamp: new Date().toISOString()
        });
        break;

      case 'POST':
        if (!userId) {
          return res.status(400).json({
            success: false,
            error: 'User ID não fornecido',
            message: 'Header user-id é obrigatório'
          });
        }

        const newCategoria = {
          id: Date.now(),
          ...req.body,
          userId: userId,
          deletedAt: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        if (!mockCategorias[userId]) {
          mockCategorias[userId] = [];
        }
        mockCategorias[userId].push(newCategoria);

        res.status(201).json({
          success: true,
          data: newCategoria,
          message: 'Categoria criada com sucesso'
        });
        break;

      default:
        res.status(405).json({
          success: false,
          error: 'Método não permitido',
          allowedMethods: ['GET', 'POST']
        });
    }
  } catch (error) {
    console.error('Erro no endpoint /categorias:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
}

// Handler para autenticação
async function handleAuthLogin(req, res) {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({
      success: false,
      error: 'Email e senha são obrigatórios'
    });
  }

  try {
    // Mock de autenticação - em produção seria com Firebase Auth
    if (email === 'teste@teste.com' && senha === '123456') {
      const user = {
        id: 'user1',
        email: email,
        nome: 'Usuário Teste'
      };

      res.json({
        success: true,
        user: user,
        message: 'Login realizado com sucesso'
      });
    } else {
      res.status(401).json({
        success: false,
        error: 'Credenciais inválidas'
      });
    }
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
}

async function handleAuthRegister(req, res) {
  const { email, senha, nome } = req.body;

  if (!email || !senha || !nome) {
    return res.status(400).json({
      success: false,
      error: 'Email, senha e nome são obrigatórios'
    });
  }

  try {
    // Mock de registro - em produção seria com Firebase Auth
    const user = {
      id: `user_${Date.now()}`,
      email: email,
      nome: nome
    };

    res.status(201).json({
      success: true,
      user: user,
      message: 'Usuário registrado com sucesso'
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
}

async function handleAuthLogout(req, res) {
  try {
    res.json({
      success: true,
      message: 'Logout realizado com sucesso'
    });
  } catch (error) {
    console.error('Erro no logout:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
} 