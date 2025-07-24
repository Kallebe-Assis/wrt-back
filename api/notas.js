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
  const userId = req.headers['user-id'];

  // Dados mock específicos do usuário
  const mockNotas = {
    'user1': [
      {
        id: 1,
        titulo: 'Minha primeira nota',
        conteudo: 'Esta é uma nota de exemplo para o usuário 1.',
        categoria: 'Geral',
        fixado: false,
        favorito: false,
        ordenacao: 1,
        userId: 'user1',
        deletedAt: null,
        createdAt: '2025-01-15T10:00:00.000Z',
        updatedAt: '2025-01-15T10:00:00.000Z'
      },
      {
        id: 2,
        titulo: 'Lista de tarefas',
        conteudo: '1. Estudar React\n2. Fazer exercícios\n3. Ler um livro',
        categoria: 'Tarefas',
        fixado: true,
        favorito: true,
        ordenacao: 2,
        userId: 'user1',
        deletedAt: null,
        createdAt: '2025-01-16T11:00:00.000Z',
        updatedAt: '2025-01-16T11:00:00.000Z'
      },
      {
        id: 3,
        titulo: 'Ideias de projeto',
        conteudo: 'Projeto 1: App de gerenciamento\nProjeto 2: Sistema de vendas\nProjeto 3: Blog pessoal',
        categoria: 'Projetos',
        fixado: false,
        favorito: false,
        ordenacao: 3,
        userId: 'user1',
        deletedAt: null,
        createdAt: '2025-01-17T12:00:00.000Z',
        updatedAt: '2025-01-17T12:00:00.000Z'
      }
    ],
    'user2': [
      {
        id: 4,
        titulo: 'Nota do usuário 2',
        conteudo: 'Esta é uma nota específica do usuário 2.',
        categoria: 'Pessoal',
        fixado: false,
        favorito: false,
        ordenacao: 1,
        userId: 'user2',
        deletedAt: null,
        createdAt: '2025-01-18T13:00:00.000Z',
        updatedAt: '2025-01-18T13:00:00.000Z'
      }
    ],
    'kallebe': [
      {
        id: 5,
        titulo: 'Ideias para WRTmind',
        conteudo: 'Funcionalidades para implementar:\n- Sistema de tags\n- Busca avançada\n- Exportação de dados\n- Temas personalizáveis\n- Sincronização em tempo real',
        categoria: 'Projetos',
        fixado: true,
        favorito: true,
        ordenacao: 1,
        userId: 'kallebe',
        deletedAt: null,
        createdAt: '2025-01-10T09:00:00.000Z',
        updatedAt: '2025-01-10T09:00:00.000Z'
      },
      {
        id: 6,
        titulo: 'Tarefas G2 Telecom',
        conteudo: '1. Reunião com cliente às 14h\n2. Revisar proposta comercial\n3. Atualizar documentação técnica\n4. Preparar apresentação para amanhã',
        categoria: 'Trabalho',
        fixado: true,
        favorito: false,
        ordenacao: 2,
        userId: 'kallebe',
        deletedAt: null,
        createdAt: '2025-01-11T10:00:00.000Z',
        updatedAt: '2025-01-11T10:00:00.000Z'
      },
      {
        id: 7,
        titulo: 'Comandos Git úteis',
        conteudo: 'git add .\ngit commit -m "mensagem"\ngit push origin main\ngit pull origin main\ngit status\ngit log --oneline',
        categoria: 'Desenvolvimento',
        fixado: false,
        favorito: true,
        ordenacao: 3,
        userId: 'kallebe',
        deletedAt: null,
        createdAt: '2025-01-12T11:00:00.000Z',
        updatedAt: '2025-01-12T11:00:00.000Z'
      },
      {
        id: 8,
        titulo: 'Links importantes',
        conteudo: 'Documentação React: https://react.dev\nVercel: https://vercel.com\nGitHub: https://github.com\nStack Overflow: https://stackoverflow.com',
        categoria: 'Referência',
        fixado: false,
        favorito: false,
        ordenacao: 4,
        userId: 'kallebe',
        deletedAt: null,
        createdAt: '2025-01-13T12:00:00.000Z',
        updatedAt: '2025-01-13T12:00:00.000Z'
      },
      {
        id: 9,
        titulo: 'Lembretes pessoais',
        conteudo: '- Pagar conta de luz\n- Marcar consulta médica\n- Comprar presente para aniversário\n- Reservar restaurante para sábado',
        categoria: 'Pessoal',
        fixado: false,
        favorito: false,
        ordenacao: 5,
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
        // Buscar todas as notas do usuário
        if (!userId) {
          return res.status(400).json({
            success: false,
            error: 'User ID não fornecido',
            message: 'Header user-id é obrigatório'
          });
        }

        const userNotas = mockNotas[userId] || [];
        
        res.status(200).json({
          success: true,
          data: userNotas,
          message: `Notas do usuário ${userId}`,
          count: userNotas.length,
          timestamp: new Date().toISOString()
        });
        break;

      case 'POST':
        // Criar nova nota
        if (!userId) {
          return res.status(400).json({
            success: false,
            error: 'User ID não fornecido',
            message: 'Header user-id é obrigatório'
          });
        }

        const newNota = {
          id: Date.now(),
          ...req.body,
          userId: userId,
          fixado: req.body.fixado || false,
          favorito: req.body.favorito || false,
          ordenacao: req.body.ordenacao || 1,
          deletedAt: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        // Adicionar à lista mock (em produção seria salvo no banco)
        if (!mockNotas[userId]) {
          mockNotas[userId] = [];
        }
        mockNotas[userId].push(newNota);

        res.status(201).json({
          success: true,
          data: newNota,
          message: 'Nota criada com sucesso'
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
    console.error('Erro no endpoint /notas:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
} 