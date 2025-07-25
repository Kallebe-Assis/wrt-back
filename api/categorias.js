export default function handler(req, res) {
  // Configurar CORS usando variáveis de ambiente
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
  const origin = req.headers.origin;
  
  console.log('🌐 CORS - Origin recebido:', origin);
  console.log('🌐 CORS - Origins permitidos:', allowedOrigins);
  console.log('🌐 CORS - ALLOWED_ORIGINS env:', process.env.ALLOWED_ORIGINS);
  
  // Sempre permitir localhost:3000 para desenvolvimento
  if (origin === 'http://localhost:3000' || allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    console.log('✅ CORS - Origin permitido:', origin);
  } else {
    console.log('❌ CORS - Origin não permitido:', origin);
  }
  
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', process.env.CORS_ALLOWED_HEADERS || 'Content-Type,Authorization,user-id,X-Requested-With');

  // Responder a requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    console.log('🔄 CORS - Respondendo OPTIONS');
    res.status(200).end();
    return;
  }

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
      },
      {
        id: 3,
        nome: 'Tarefas',
        cor: '#ffc107',
        userId: 'user1',
        deletedAt: null,
        createdAt: '2025-01-17T12:00:00.000Z',
        updatedAt: '2025-01-17T12:00:00.000Z'
      },
      {
        id: 4,
        nome: 'Projetos',
        cor: '#dc3545',
        userId: 'user1',
        deletedAt: null,
        createdAt: '2025-01-18T13:00:00.000Z',
        updatedAt: '2025-01-18T13:00:00.000Z'
      }
    ],
    'user2': [
      {
        id: 5,
        nome: 'Pessoal',
        cor: '#6f42c1',
        userId: 'user2',
        deletedAt: null,
        createdAt: '2025-01-19T14:00:00.000Z',
        updatedAt: '2025-01-19T14:00:00.000Z'
      },
      {
        id: 6,
        nome: 'Trabalho',
        cor: '#fd7e14',
        userId: 'user2',
        deletedAt: null,
        createdAt: '2025-01-20T15:00:00.000Z',
        updatedAt: '2025-01-20T15:00:00.000Z'
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
      },
      {
        id: 9,
        nome: 'Projetos',
        cor: '#dc3545',
        userId: 'kallebe',
        deletedAt: null,
        createdAt: '2025-01-12T11:00:00.000Z',
        updatedAt: '2025-01-12T11:00:00.000Z'
      },
      {
        id: 10,
        nome: 'Referência',
        cor: '#6f42c1',
        userId: 'kallebe',
        deletedAt: null,
        createdAt: '2025-01-13T12:00:00.000Z',
        updatedAt: '2025-01-13T12:00:00.000Z'
      },
      {
        id: 11,
        nome: 'Pessoal',
        cor: '#fd7e14',
        userId: 'kallebe',
        deletedAt: null,
        createdAt: '2025-01-14T13:00:00.000Z',
        updatedAt: '2025-01-14T13:00:00.000Z'
      }
    ]
  };

  try {
    switch (method) {
      case 'GET':
        // Buscar todas as categorias do usuário
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
        // Criar nova categoria
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

        // Adicionar à lista mock (em produção seria salvo no banco)
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