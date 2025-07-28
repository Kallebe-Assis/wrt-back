module.exports = async function handler(req, res) {
  console.log('🧪 Teste login - Método:', req.method);
  console.log('🧪 Teste login - Headers:', req.headers);
  
  // Permitir todos os métodos
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Apenas POST permitido
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Método não permitido',
      allowedMethods: ['POST']
    });
  }

  try {
    const { email, senha } = req.body;
    console.log('🧪 Teste login - Dados recebidos:', { email, senha: senha ? '***' : 'não fornecida' });

    if (!email || !senha) {
      return res.status(400).json({
        success: false,
        error: 'Email e senha são obrigatórios'
      });
    }

    // Simular login bem-sucedido
    res.json({
      success: true,
      user: {
        id: 'test-user-id',
        nome: 'Usuário Teste',
        email: email
      },
      message: 'Login de teste realizado com sucesso'
    });

  } catch (error) {
    console.error('❌ Erro no teste login:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno',
      message: error.message
    });
  }
}; 