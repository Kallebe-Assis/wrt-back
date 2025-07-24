export default function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, user-id, X-Requested-With');

  // Responder a requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        // Buscar todas as categorias
        res.status(200).json({
          success: true,
          data: [
            {
              id: 1,
              nome: 'Geral',
              cor: '#007bff',
              createdAt: new Date().toISOString()
            }
          ],
          message: 'Lista de categorias (mock)',
          timestamp: new Date().toISOString()
        });
        break;

      case 'POST':
        // Criar nova categoria
        res.status(201).json({
          success: true,
          data: {
            id: Date.now(),
            ...req.body,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
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