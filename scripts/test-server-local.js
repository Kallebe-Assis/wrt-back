const express = require('express');
const NotaFirebase = require('../models/NotaFirebase');

const app = express();
const notaModel = new NotaFirebase();

// Middleware para parsear JSON
app.use(express.json());

// Simular a rota /favoritas
app.get('/api/notas/favoritas', async (req, res) => {
  try {
    console.log('🔍 Testando rota /favoritas');
    console.log('📝 Headers:', req.headers);
    
    const userId = req.headers['user-id'];
    console.log('👤 User ID:', userId);
    
    if (!userId) {
      console.log('❌ User ID não fornecido');
      return res.status(401).json({ error: 'ID do usuário não fornecido' });
    }
    
    console.log('🔍 Chamando buscarFavoritas...');
    const notas = await notaModel.buscarFavoritas(userId);
    console.log('✅ Resultado:', notas);
    
    res.json({ notas });
  } catch (error) {
    console.error('❌ Erro:', error);
    res.status(500).json({ error: 'Erro ao buscar notas favoritas' });
  }
});

// Rota de teste
app.get('/test', (req, res) => {
  res.json({ message: 'Servidor local funcionando!' });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor local rodando na porta ${PORT}`);
  console.log(`🔗 Teste: http://localhost:${PORT}/test`);
  console.log(`🔗 Favoritas: http://localhost:${PORT}/api/notas/favoritas`);
}); 