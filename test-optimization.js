const fetch = require('node-fetch');

// Configurações de teste
const CONFIG = {
  baseUrl: 'https://wrt-back.vercel.app/api',
  userId: 'test-optimization-user',
  timeout: 10000,
  maxRetries: 3
};

// Função auxiliar para fazer requisições
async function makeRequest(endpoint, options = {}) {
  const url = `${CONFIG.baseUrl}${endpoint}`;
  const startTime = Date.now();
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'user-id': CONFIG.userId,
      ...options.headers
    },
    timeout: CONFIG.timeout
  };
  
  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    const responseTime = Date.now() - startTime;
    const data = await response.json();
    
    return {
      status: response.status,
      ok: response.ok,
      data,
      responseTime,
      url
    };
  } catch (error) {
    return {
      status: 0,
      ok: false,
      error: error.message,
      responseTime: Date.now() - startTime,
      url
    };
  }
}

// Teste de performance
async function testPerformance() {
  console.log('🚀 === TESTE DE PERFORMANCE ===\n');
  
  const tests = [
    {
      name: 'Health Check',
      endpoint: '/health',
      expectedTime: 1000
    },
    {
      name: 'Notas Otimizada - GET',
      endpoint: '/notas-optimized',
      expectedTime: 500
    },
    {
      name: 'Links Otimizada - GET',
      endpoint: '/links-optimized',
      expectedTime: 500
    },
    {
      name: 'Notas Original - GET',
      endpoint: '/notas',
      expectedTime: 2000
    },
    {
      name: 'Links Original - GET',
      endpoint: '/links',
      expectedTime: 2000
    }
  ];
  
  const results = [];
  
  for (const test of tests) {
    console.log(`📊 Testando: ${test.name}`);
    
    const result = await makeRequest(test.endpoint);
    const performance = {
      name: test.name,
      responseTime: result.responseTime,
      status: result.status,
      success: result.ok,
      withinTarget: result.responseTime <= test.expectedTime,
      target: test.expectedTime
    };
    
    results.push(performance);
    
    const emoji = performance.success ? '✅' : '❌';
    const timeEmoji = performance.withinTarget ? '⚡' : '🐌';
    
    console.log(`${emoji} Status: ${performance.status}`);
    console.log(`${timeEmoji} Tempo: ${performance.responseTime}ms (alvo: ${test.expectedTime}ms)`);
    console.log('');
  }
  
  return results;
}

// Teste de rate limiting
async function testRateLimit() {
  console.log('🛡️ === TESTE DE RATE LIMITING ===\n');
  
  const requests = [];
  const endpoint = '/health';
  
  console.log('📊 Enviando 110 requisições em paralelo...');
  
  // Enviar 110 requisições rapidamente (deve bloquear após 100)
  for (let i = 0; i < 110; i++) {
    requests.push(makeRequest(endpoint));
  }
  
  const results = await Promise.all(requests);
  
  const successful = results.filter(r => r.ok).length;
  const blocked = results.filter(r => r.status === 429).length;
  const errors = results.filter(r => !r.ok && r.status !== 429).length;
  
  console.log(`✅ Requisições bem-sucedidas: ${successful}`);
  console.log(`🛡️ Requisições bloqueadas (429): ${blocked}`);
  console.log(`❌ Erros: ${errors}`);
  console.log('');
  
  const rateLimitWorking = blocked > 0;
  console.log(`Rate limiting: ${rateLimitWorking ? '✅ Funcionando' : '❌ Não funcionando'}`);
  
  return { successful, blocked, errors, working: rateLimitWorking };
}

// Teste de cache
async function testCache() {
  console.log('💾 === TESTE DE CACHE ===\n');
  
  const endpoint = '/notas-optimized';
  
  console.log('📊 Primeira requisição (cold cache)...');
  const first = await makeRequest(endpoint);
  
  console.log('📊 Segunda requisição (warm cache)...');
  const second = await makeRequest(endpoint);
  
  console.log('📊 Terceira requisição (warm cache)...');
  const third = await makeRequest(endpoint);
  
  const times = [first.responseTime, second.responseTime, third.responseTime];
  const avgWarmTime = (second.responseTime + third.responseTime) / 2;
  const cacheImprovement = ((first.responseTime - avgWarmTime) / first.responseTime) * 100;
  
  console.log(`⏱️ Cold cache: ${first.responseTime}ms`);
  console.log(`⚡ Warm cache (média): ${Math.round(avgWarmTime)}ms`);
  console.log(`📈 Melhoria: ${Math.round(cacheImprovement)}%`);
  console.log('');
  
  const cacheWorking = cacheImprovement > 10; // Pelo menos 10% de melhoria
  console.log(`Cache: ${cacheWorking ? '✅ Funcionando' : '❌ Não detectado'}`);
  
  return { times, improvement: cacheImprovement, working: cacheWorking };
}

// Teste de segurança
async function testSecurity() {
  console.log('🔒 === TESTE DE SEGURANÇA ===\n');
  
  const tests = [
    {
      name: 'Requisição sem user-id',
      test: () => makeRequest('/notas-optimized', { 
        headers: { 'user-id': undefined }
      }),
      expectStatus: 401
    },
    {
      name: 'Payload malicioso (XSS)',
      test: () => makeRequest('/notas-optimized', {
        method: 'POST',
        body: JSON.stringify({
          titulo: '<script>alert("xss")</script>',
          conteudo: 'Teste de XSS'
        })
      }),
      expectStatus: 400
    },
    {
      name: 'Payload muito grande',
      test: () => makeRequest('/notas-optimized', {
        method: 'POST',
        body: JSON.stringify({
          titulo: 'Teste',
          conteudo: 'A'.repeat(100000) // 100KB
        })
      }),
      expectStatus: 400
    }
  ];
  
  const results = [];
  
  for (const test of tests) {
    console.log(`🔍 Testando: ${test.name}`);
    
    const result = await test.test();
    const passed = result.status === test.expectStatus;
    
    results.push({
      name: test.name,
      expected: test.expectStatus,
      actual: result.status,
      passed
    });
    
    const emoji = passed ? '✅' : '❌';
    console.log(`${emoji} Esperado: ${test.expectStatus}, Recebido: ${result.status}`);
    console.log('');
  }
  
  const allPassed = results.every(r => r.passed);
  console.log(`Segurança: ${allPassed ? '✅ Todos os testes passaram' : '❌ Alguns testes falharam'}`);
  
  return results;
}

// Teste principal
async function runOptimizationTests() {
  console.log('🔬 === AUDITORIA COMPLETA DE OTIMIZAÇÃO ===\n');
  console.log(`Base URL: ${CONFIG.baseUrl}`);
  console.log(`User ID: ${CONFIG.userId}`);
  console.log(`Timeout: ${CONFIG.timeout}ms\n`);
  
  const startTime = Date.now();
  
  try {
    const performance = await testPerformance();
    const rateLimit = await testRateLimit();
    const cache = await testCache();
    const security = await testSecurity();
    
    const totalTime = Date.now() - startTime;
    
    console.log('📋 === RESUMO DOS RESULTADOS ===\n');
    
    // Performance
    const avgResponseTime = performance.reduce((sum, p) => sum + p.responseTime, 0) / performance.length;
    const fastTests = performance.filter(p => p.withinTarget).length;
    console.log(`⚡ Performance: ${Math.round(avgResponseTime)}ms média, ${fastTests}/${performance.length} dentro do alvo`);
    
    // Rate Limiting
    console.log(`🛡️ Rate Limiting: ${rateLimit.working ? 'Ativo' : 'Inativo'} (${rateLimit.blocked} bloqueadas)`);
    
    // Cache
    console.log(`💾 Cache: ${cache.working ? 'Ativo' : 'Inativo'} (${Math.round(cache.improvement)}% melhoria)`);
    
    // Security
    const securityPassed = security.filter(s => s.passed).length;
    console.log(`🔒 Segurança: ${securityPassed}/${security.length} testes passaram`);
    
    console.log(`\n⏱️ Tempo total dos testes: ${totalTime}ms`);
    
    // Score geral
    const performanceScore = (fastTests / performance.length) * 25;
    const rateLimitScore = rateLimit.working ? 25 : 0;
    const cacheScore = cache.working ? 25 : 0;
    const securityScore = (securityPassed / security.length) * 25;
    
    const totalScore = performanceScore + rateLimitScore + cacheScore + securityScore;
    
    console.log(`\n🏆 SCORE GERAL: ${Math.round(totalScore)}/100`);
    
    if (totalScore >= 90) {
      console.log('🌟 EXCELENTE! Backend altamente otimizado');
    } else if (totalScore >= 75) {
      console.log('✅ BOM! Algumas otimizações implementadas');
    } else if (totalScore >= 50) {
      console.log('⚠️ MÉDIO! Precisa de mais otimizações');
    } else {
      console.log('❌ CRÍTICO! Muitas otimizações necessárias');
    }
    
  } catch (error) {
    console.error('❌ Erro durante os testes:', error);
  }
}

// Executar testes
if (require.main === module) {
  runOptimizationTests();
}

module.exports = {
  runOptimizationTests,
  testPerformance,
  testRateLimit,
  testCache,
  testSecurity
};
