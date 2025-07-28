module.exports = async function handler(req, res) {

  // Tratar preflight OPTIONS
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
}; 