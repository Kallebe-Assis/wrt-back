const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

// Middleware para verificar se é o usuário admin
const verificarAdmin = (req, res, next) => {
  const userId = req.headers['user-id'];
  
  if (userId !== 'eUF9zbjEuU0G9f7ntD4R') {
    return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem acessar esta rota.' });
  }
  
  next();
};

// GET /api/admin/stats - Estatísticas do banco de dados
router.get('/stats', verificarAdmin, async (req, res) => {
  try {
    console.log('🔧 ADMIN - Buscando estatísticas do banco de dados');
    
    const db = admin.firestore();
    
    // Buscar todas as notas
    const notasSnapshot = await db.collection('notas').get();
    const totalNotas = notasSnapshot.size;
    
    // Buscar todas as notas do usuário admin
    const notasAdminSnapshot = await db.collection('notas')
      .where('userId', '==', 'eUF9zbjEuU0G9f7ntD4R')
      .get();
    const notasAdmin = notasAdminSnapshot.size;
    
    // Buscar todos os links
    const linksSnapshot = await db.collection('links').get();
    const totalLinks = linksSnapshot.size;
    
    // Buscar todos os links do usuário admin
    const linksAdminSnapshot = await db.collection('links')
      .where('userId', '==', 'eUF9zbjEuU0G9f7ntD4R')
      .get();
    const linksAdmin = linksAdminSnapshot.size;
    
    // Buscar todas as categorias
    const categoriasSnapshot = await db.collection('categorias').get();
    const totalCategorias = categoriasSnapshot.size;
    
    // Buscar todas as categorias do usuário admin
    const categoriasAdminSnapshot = await db.collection('categorias')
      .where('userId', '==', 'eUF9zbjEuU0G9f7ntD4R')
      .get();
    const categoriasAdmin = categoriasAdminSnapshot.size;
    
    // Buscar todos os tópicos
    const topicosSnapshot = await db.collection('topicos').get();
    const totalTopicos = topicosSnapshot.size;
    
    // Buscar todos os tópicos do usuário admin
    const topicosAdminSnapshot = await db.collection('topicos')
      .where('userId', '==', 'eUF9zbjEuU0G9f7ntD4R')
      .get();
    const topicosAdmin = topicosAdminSnapshot.size;
    
    // Buscar todos os usuários
    const usuariosSnapshot = await db.collection('usuarios').get();
    const totalUsuarios = usuariosSnapshot.size;
    
    // Calcular estatísticas adicionais
    const notasAtivas = notasAdminSnapshot.docs.filter(doc => doc.data().ativo !== false).length;
    const notasFavoritas = notasAdminSnapshot.docs.filter(doc => doc.data().favorito === true).length;
    const notasFixadas = notasAdminSnapshot.docs.filter(doc => doc.data().fixado === true).length;
    
    const linksAtivos = linksAdminSnapshot.docs.filter(doc => doc.data().ativo !== false).length;
    const linksFavoritos = linksAdminSnapshot.docs.filter(doc => doc.data().favorito === true).length;
    
    const stats = {
      timestamp: new Date().toISOString(),
      adminUserId: 'eUF9zbjEuU0G9f7ntD4R',
      
      // Estatísticas gerais do banco
      database: {
        totalNotas,
        totalLinks,
        totalCategorias,
        totalTopicos,
        totalUsuarios
      },
      
      // Estatísticas do usuário admin
      admin: {
        notas: {
          total: notasAdmin,
          ativas: notasAtivas,
          favoritas: notasFavoritas,
          fixadas: notasFixadas,
          inativas: notasAdmin - notasAtivas
        },
        links: {
          total: linksAdmin,
          ativos: linksAtivos,
          favoritos: linksFavoritos,
          inativos: linksAdmin - linksAtivos
        },
        categorias: {
          total: categoriasAdmin
        },
        topicos: {
          total: topicosAdmin
        }
      },
      
      // Percentuais
      percentuais: {
        notasAdmin: totalNotas > 0 ? ((notasAdmin / totalNotas) * 100).toFixed(2) : 0,
        linksAdmin: totalLinks > 0 ? ((linksAdmin / totalLinks) * 100).toFixed(2) : 0,
        categoriasAdmin: totalCategorias > 0 ? ((categoriasAdmin / totalCategorias) * 100).toFixed(2) : 0,
        topicosAdmin: totalTopicos > 0 ? ((topicosAdmin / totalTopicos) * 100).toFixed(2) : 0
      }
    };
    
    console.log('✅ ADMIN - Estatísticas calculadas:', stats);
    
    res.json(stats);
    
  } catch (error) {
    console.error('❌ ADMIN - Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/admin/users - Lista de usuários (apenas IDs e nomes)
router.get('/users', verificarAdmin, async (req, res) => {
  try {
    console.log('🔧 ADMIN - Buscando lista de usuários');
    
    const db = admin.firestore();
    const usuariosSnapshot = await db.collection('usuarios').get();
    
    const usuarios = usuariosSnapshot.docs.map(doc => ({
      id: doc.id,
      nome: doc.data().nome || 'Sem nome',
      email: doc.data().email || 'Sem email',
      dataCriacao: doc.data().dataCriacao || null
    }));
    
    console.log('✅ ADMIN - Lista de usuários obtida:', usuarios.length);
    
    res.json({ usuarios });
    
  } catch (error) {
    console.error('❌ ADMIN - Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router; 