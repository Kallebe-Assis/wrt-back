export default function handler(req, res) {
  // Configurar CORS usando variáveis de ambiente
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', process.env.CORS_ALLOWED_HEADERS || 'Content-Type,Authorization,user-id,X-Requested-With');

  // Responder a requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

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
      },
      {
        id: 3,
        titulo: 'Stack Overflow',
        url: 'https://stackoverflow.com',
        descricao: 'Comunidade de programadores',
        categoria: 'Desenvolvimento',
        favorito: false,
        posicao: 3,
        userId: 'user1',
        createdAt: '2025-01-17T12:00:00.000Z',
        updatedAt: '2025-01-17T12:00:00.000Z'
      }
    ],
    'user2': [
      {
        id: 4,
        titulo: 'YouTube',
        url: 'https://youtube.com',
        descricao: 'Plataforma de vídeos',
        categoria: 'Entretenimento',
        favorito: true,
        posicao: 1,
        userId: 'user2',
        createdAt: '2025-01-18T13:00:00.000Z',
        updatedAt: '2025-01-18T13:00:00.000Z'
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
      },
      {
        id: 6,
        titulo: 'LinkedIn',
        url: 'https://linkedin.com',
        descricao: 'Rede profissional',
        categoria: 'Trabalho',
        favorito: true,
        posicao: 2,
        userId: 'kallebe',
        createdAt: '2025-01-11T10:00:00.000Z',
        updatedAt: '2025-01-11T10:00:00.000Z'
      },
      {
        id: 7,
        titulo: 'GitHub',
        url: 'https://github.com',
        descricao: 'Repositório de código',
        categoria: 'Desenvolvimento',
        favorito: false,
        posicao: 3,
        userId: 'kallebe',
        createdAt: '2025-01-12T11:00:00.000Z',
        updatedAt: '2025-01-12T11:00:00.000Z'
      },
      {
        id: 8,
        titulo: 'Stack Overflow',
        url: 'https://stackoverflow.com',
        descricao: 'Comunidade de programadores',
        categoria: 'Desenvolvimento',
        favorito: false,
        posicao: 4,
        userId: 'kallebe',
        createdAt: '2025-01-13T12:00:00.000Z',
        updatedAt: '2025-01-13T12:00:00.000Z'
      },
      {
        id: 9,
        titulo: 'Vercel',
        url: 'https://vercel.com',
        descricao: 'Plataforma de deploy',
        categoria: 'Desenvolvimento',
        favorito: true,
        posicao: 5,
        userId: 'kallebe',
        createdAt: '2025-01-14T13:00:00.000Z',
        updatedAt: '2025-01-14T13:00:00.000Z'
      }
    ]
  };

  try {
    switch (method) {
      case 'GET':
        // Buscar todos os links do usuário
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
        // Criar novo link
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

        // Adicionar à lista mock (em produção seria salvo no banco)
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