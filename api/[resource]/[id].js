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
  const { resource, id } = req.query;

  try {
    switch (method) {
      case 'GET':
        // Buscar por ID
        res.status(200).json({
          success: true,
          data: {
            id: id,
            resource: resource,
            message: `${resource} encontrado (mock)`,
            timestamp: new Date().toISOString()
          }
        });
        break;

      case 'PUT':
        // Atualizar
        res.status(200).json({
          success: true,
          data: {
            id: id,
            resource: resource,
            ...req.body,
            updatedAt: new Date().toISOString()
          },
          message: `${resource} atualizado com sucesso`
        });
        break;

      case 'DELETE':
        // Excluir
        res.status(200).json({
          success: true,
          message: `${resource} excluído com sucesso`,
          id: id
        });
        break;

      case 'PATCH':
        // Atualização parcial
        res.status(200).json({
          success: true,
          data: {
            id: id,
            resource: resource,
            ...req.body,
            updatedAt: new Date().toISOString()
          },
          message: `${resource} atualizado parcialmente`
        });
        break;

      default:
        res.status(405).json({
          success: false,
          error: 'Método não permitido',
          allowedMethods: ['GET', 'PUT', 'DELETE', 'PATCH']
        });
    }
  } catch (error) {
    console.error(`Erro no endpoint /${resource}/${id}:`, error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
} 