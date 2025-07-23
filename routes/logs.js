const express = require('express');
const router = express.Router();
const logService = require('../services/LogService');

// GET /api/logs - Obter logs
router.get('/', async (req, res) => {
  try {
    const { type, userId, since, limit = 50 } = req.query;
    
    const filters = {};
    if (type) filters.type = type;
    if (userId) filters.userId = userId;
    if (since) filters.since = since;

    const logs = logService.getLogs(filters);
    const stats = logService.getStats();

    // Aplicar limite
    const limitedLogs = logs.slice(0, parseInt(limit));

    res.json({
      logs: limitedLogs,
      stats,
      total: logs.length,
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error('Erro ao buscar logs:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /api/logs - Limpar logs
router.delete('/', async (req, res) => {
  try {
    logService.clearLogs();
    res.json({ message: 'Logs limpos com sucesso' });
  } catch (error) {
    console.error('Erro ao limpar logs:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/logs/stats - Obter estatísticas
router.get('/stats', async (req, res) => {
  try {
    const stats = logService.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/logs/export - Exportar logs
router.get('/export', async (req, res) => {
  try {
    const exportData = logService.exportLogs();
    res.json(exportData);
  } catch (error) {
    console.error('Erro ao exportar logs:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router; 