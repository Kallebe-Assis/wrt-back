const { db } = require('./firebase-config-vercel');

// Métricas em memória
const metrics = {
  requests: 0,
  errors: 0,
  avgResponseTime: 0,
  lastError: null,
  uptime: Date.now()
};

// Incrementar métricas
const recordMetric = (type, value = 1) => {
  switch (type) {
    case 'request':
      metrics.requests += value;
      break;
    case 'error':
      metrics.errors += value;
      metrics.lastError = new Date().toISOString();
      break;
    case 'responseTime':
      metrics.avgResponseTime = (metrics.avgResponseTime + value) / 2;
      break;
  }
};

// Health check completo
const performHealthCheck = async () => {
  const startTime = Date.now();
  const checks = [];
  
  // 1. Verificar conexão Firebase
  try {
    await db.collection('_health').doc('test').set({
      timestamp: new Date().toISOString(),
      test: true
    });
    await db.collection('_health').doc('test').delete();
    
    checks.push({
      service: 'Firebase',
      status: 'healthy',
      responseTime: Date.now() - startTime
    });
  } catch (error) {
    checks.push({
      service: 'Firebase',
      status: 'unhealthy',
      error: error.message,
      responseTime: Date.now() - startTime
    });
  }
  
  // 2. Verificar memória
  const memUsage = process.memoryUsage();
  const memoryHealthy = memUsage.heapUsed < 100 * 1024 * 1024; // < 100MB
  
  checks.push({
    service: 'Memory',
    status: memoryHealthy ? 'healthy' : 'warning',
    heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
    heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`
  });
  
  // 3. Verificar uptime
  const uptimeMs = Date.now() - metrics.uptime;
  const uptimeMinutes = Math.floor(uptimeMs / 60000);
  
  checks.push({
    service: 'Uptime',
    status: 'healthy',
    uptime: `${uptimeMinutes} minutes`
  });
  
  // Status geral
  const allHealthy = checks.every(check => check.status === 'healthy');
  const hasWarnings = checks.some(check => check.status === 'warning');
  
  return {
    status: allHealthy ? 'healthy' : hasWarnings ? 'warning' : 'unhealthy',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    environment: process.env.NODE_ENV || 'development',
    checks,
    metrics: {
      totalRequests: metrics.requests,
      totalErrors: metrics.errors,
      errorRate: metrics.requests > 0 ? ((metrics.errors / metrics.requests) * 100).toFixed(2) + '%' : '0%',
      avgResponseTime: Math.round(metrics.avgResponseTime) + 'ms',
      lastError: metrics.lastError,
      uptime: `${uptimeMinutes} minutes`
    }
  };
};

module.exports = async function handler(req, res) {
  const startTime = Date.now();
  
  // CORS básico
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'GET') {
    res.status(405).json({
      error: 'Method not allowed',
      allowedMethods: ['GET']
    });
    return;
  }
  
  try {
    recordMetric('request');
    
    const healthResult = await performHealthCheck();
    const responseTime = Date.now() - startTime;
    
    recordMetric('responseTime', responseTime);
    
    // Status code baseado na saúde
    const statusCode = healthResult.status === 'healthy' ? 200 : 
                      healthResult.status === 'warning' ? 200 : 503;
    
    res.status(statusCode).json({
      ...healthResult,
      responseTime: responseTime + 'ms'
    });
    
  } catch (error) {
    recordMetric('error');
    
    const responseTime = Date.now() - startTime;
    recordMetric('responseTime', responseTime);
    
    console.error('Health check error:', error);
    
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      responseTime: responseTime + 'ms',
      metrics: {
        totalRequests: metrics.requests,
        totalErrors: metrics.errors,
        errorRate: ((metrics.errors / metrics.requests) * 100).toFixed(2) + '%'
      }
    });
  }
};

// Exportar função de métricas para uso em outras APIs
module.exports.recordMetric = recordMetric;
