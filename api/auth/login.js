const { setupCORS } = require('../cors');

module.exports = async function handler(req, res) {
  // Configurar CORS
  const corsHandled = setupCORS(req, res);
  if (corsHandled) return;

  // Apenas POST permitido
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Método não permitido',
      allowedMethods: ['POST']
    });
  }

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
}; 