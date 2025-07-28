module.exports = async function handler(req, res) {

  // Permitir requisições OPTIONS (preflight CORS)
  if (req.method === 'OPTIONS') {
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
}; 