const express = require('express');
const NotaFirebase = require('../models/NotaFirebase');

const app = express();
const notaModel = new NotaFirebase();

// Middleware para parsear JSON
app.use(express.json());

// Rota de teste
app.get('/test', (req, res) => {
  res.json({ message: 'Servidor local funcionando!' });
});

// GET /api/notas/favoritas - Buscar notas favoritas (ANTES da rota /:id)
app.get('/api/notas/favoritas', async (req, res) => {
  try {
    console.log('🔍 Rota /favoritas capturada');
    const userId = req.headers['user-id'];
    
    if (!userId) {
      return res.status(401).json({ error: 'ID do usuário não fornecido' });
    }
    
    console.log('👤 User ID:', userId);
    const notas = await notaModel.buscarFavoritas(userId);
    console.log('✅ Favoritas encontradas:', notas.length);
    
    res.json({ notas });
  } catch (error) {
    console.error('❌ Erro:', error);
    res.status(500).json({ error: 'Erro ao buscar notas favoritas' });
  }
});

// GET /api/notas/fixadas - Buscar notas fixadas (ANTES da rota /:id)
app.get('/api/notas/fixadas', async (req, res) => {
  try {
    console.log('🔍 Rota /fixadas capturada');
    const userId = req.headers['user-id'];
    
    if (!userId) {
      return res.status(401).json({ error: 'ID do usuário não fornecido' });
    }
    
    console.log('👤 User ID:', userId);
    const notas = await notaModel.buscarFixadas(userId);
    console.log('✅ Fixadas encontradas:', notas.length);
    
    res.json({ notas });
  } catch (error) {
    console.error('❌ Erro:', error);
    res.status(500).json({ error: 'Erro ao buscar notas fixadas' });
  }
});

// GET /api/notas/:id - Buscar nota por ID (DEPOIS das rotas específicas)
app.get('/api/notas/:id', async (req, res) => {
  try {
    console.log('⚠️ Rota /:id capturada com id:', req.params.id);
    const userId = req.headers['user-id'];
    
    if (!userId) {
      return res.status(401).json({ error: 'ID do usuário não fornecido' });
    }
    
    const nota = await notaModel.buscarPorId(req.params.id, userId);
    
    if (!nota) {
      return res.status(404).json({ error: 'Nota não encontrada' });
    }
    
    res.json({ nota });
  } catch (error) {
    console.error('❌ Erro:', error);
    res.status(500).json({ error: 'Erro ao buscar nota' });
  }
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`🚀 Servidor local rodando na porta ${PORT}`);
  console.log(`🔗 Teste: http://localhost:${PORT}/test`);
  console.log(`🔗 Favoritas: http://localhost:${PORT}/api/notas/favoritas`);
  console.log(`🔗 Fixadas: http://localhost:${PORT}/api/notas/fixadas`);
  console.log(`🔗 Nota por ID: http://localhost:${PORT}/api/notas/123`);
}); 