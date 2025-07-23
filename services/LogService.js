class LogService {
  constructor() {
    this.logs = [];
    this.maxLogs = 100; // Manter apenas os últimos 100 logs
  }

  // Adicionar log
  addLog(type, message, details = null) {
    const log = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      type, // 'firebase', 'api', 'error', 'info'
      message,
      details,
      userId: details?.userId || null
    };

    this.logs.unshift(log); // Adicionar no início

    // Manter apenas os últimos logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // Log no console também
    const emoji = this.getEmoji(type);
    console.log(`${emoji} ${log.timestamp} - ${message}`, details || '');

    return log;
  }

  // Log específico do Firebase
  firebaseLog(message, details = null) {
    return this.addLog('firebase', message, details);
  }

  // Log de erro
  errorLog(message, details = null) {
    return this.addLog('error', message, details);
  }

  // Log de informação
  infoLog(message, details = null) {
    return this.addLog('info', message, details);
  }

  // Log de API
  apiLog(message, details = null) {
    return this.addLog('api', message, details);
  }

  // Obter emoji baseado no tipo
  getEmoji(type) {
    const emojis = {
      firebase: '🔥',
      api: '🌐',
      error: '❌',
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️'
    };
    return emojis[type] || '📝';
  }

  // Obter todos os logs
  getLogs(filters = {}) {
    let filteredLogs = [...this.logs];

    // Filtrar por tipo
    if (filters.type) {
      filteredLogs = filteredLogs.filter(log => log.type === filters.type);
    }

    // Filtrar por usuário
    if (filters.userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === filters.userId);
    }

    // Filtrar por período
    if (filters.since) {
      const sinceDate = new Date(filters.since);
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= sinceDate);
    }

    return filteredLogs;
  }

  // Limpar logs
  clearLogs() {
    this.logs = [];
    console.log('🧹 Logs limpos');
  }

  // Obter estatísticas
  getStats() {
    const stats = {
      total: this.logs.length,
      firebase: this.logs.filter(log => log.type === 'firebase').length,
      api: this.logs.filter(log => log.type === 'api').length,
      error: this.logs.filter(log => log.type === 'error').length,
      info: this.logs.filter(log => log.type === 'info').length
    };

    return stats;
  }

  // Exportar logs
  exportLogs() {
    return {
      timestamp: new Date().toISOString(),
      stats: this.getStats(),
      logs: this.logs
    };
  }
}

// Instância singleton
const logService = new LogService();

module.exports = logService; 