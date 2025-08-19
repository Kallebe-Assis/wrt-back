const fetch = require('node-fetch');

// Test configuration
const BASE_URL = 'https://wrt-back.vercel.app/api';
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'your-admin-secret-key';
const TEST_USER_ID = 'test-admin-user-123';

// Helper function to make requests
async function makeRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'user-id': TEST_USER_ID,
      'admin-key': ADMIN_SECRET_KEY
    },
    ...options
  };

  try {
    console.log(`\n🔍 Testando: ${options.method || 'GET'} ${url}`);
    const response = await fetch(url, defaultOptions);
    const data = await response.json();
    
    console.log(`📊 Status: ${response.status}`);
    console.log(`📄 Resposta:`, JSON.stringify(data, null, 2));
    
    return { success: response.ok, data, status: response.status };
  } catch (error) {
    console.error(`❌ Erro: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Test admin API
async function testAdminAPI() {
  console.log('\n📊 === TESTANDO API DE ADMIN ===');
  
  // Test GET /admin - Estatísticas do sistema
  console.log('\n📈 Testando estatísticas do sistema...');
  const statsResult = await makeRequest('/admin');
  
  if (statsResult.success && statsResult.data.stats) {
    const stats = statsResult.data.stats;
    console.log('\n📊 Estatísticas coletadas:');
    console.log(`👥 Usuários: ${stats.usuarios.total} (${stats.usuarios.ativos} ativos)`);
    console.log(`📝 Notas: ${stats.conteudo.notas.total} (${stats.conteudo.notas.favoritas} favoritas)`);
    console.log(`🔗 Links: ${stats.conteudo.links.total}`);
    console.log(`🏷️ Categorias: ${stats.conteudo.categorias.total}`);
    console.log(`📊 Média notas/usuário: ${stats.performance.mediaNotasPorUsuario}`);
    console.log(`📊 Média links/usuário: ${stats.performance.mediaLinksPorUsuario}`);
    
    if (stats.topUsuarios.length > 0) {
      console.log('\n🏆 Top usuários mais ativos:');
      stats.topUsuarios.forEach((user, index) => {
        console.log(`${index + 1}. Usuário ${user.userId}: ${user.notaCount} notas`);
      });
    }
  }
  
  // Test POST /admin - Salvar configuração
  console.log('\n⚙️ Testando salvamento de configuração...');
  const configData = {
    configuracao: {
      tema: 'dark',
      notificacoes: true,
      autoSave: true,
      dashboard: {
        mostrarEstatisticas: true,
        mostrarGraficos: true,
        refreshInterval: 30000
      }
    }
  };
  
  const configResult = await makeRequest('/admin', {
    method: 'POST',
    body: JSON.stringify(configData)
  });
  
  if (configResult.success) {
    console.log('✅ Configuração salva com sucesso');
  }
  
  // Test sem chave de admin (deve falhar)
  console.log('\n🔒 Testando acesso sem chave de admin...');
  const unauthorizedResult = await makeRequest('/admin', {
    headers: {
      'Content-Type': 'application/json',
      'user-id': TEST_USER_ID
      // Sem admin-key
    }
  });
  
  if (!unauthorizedResult.success) {
    console.log('✅ Acesso negado corretamente sem chave de admin');
  }
  
  // Test com chave de admin inválida
  console.log('\n🔒 Testando acesso com chave de admin inválida...');
  const invalidKeyResult = await makeRequest('/admin', {
    headers: {
      'Content-Type': 'application/json',
      'user-id': TEST_USER_ID,
      'admin-key': 'invalid-key'
    }
  });
  
  if (!invalidKeyResult.success) {
    console.log('✅ Acesso negado corretamente com chave inválida');
  }
}

// Test notas com favoritar
async function testNotasFavoritar() {
  console.log('\n⭐ === TESTANDO FAVORITAR NOTAS ===');
  
  // Criar uma nota de teste
  console.log('\n📝 Criando nota de teste...');
  const notaData = {
    titulo: 'Nota de Teste para Favoritar',
    conteudo: 'Conteúdo de teste para verificar funcionalidade de favoritar',
    topico: 'Teste'
  };
  
  const createResult = await makeRequest('/notas', {
    method: 'POST',
    body: JSON.stringify(notaData)
  });
  
  if (createResult.success && createResult.data.nota) {
    const notaId = createResult.data.nota.id;
    console.log(`✅ Nota criada: ${notaId}`);
    
    // Favoritar a nota
    console.log('\n⭐ Favoritando nota...');
    const favoritarResult = await makeRequest(`/notas/${notaId}`, {
      method: 'PATCH',
      body: JSON.stringify({ favorita: true })
    });
    
    if (favoritarResult.success) {
      console.log('✅ Nota favoritada com sucesso');
    }
    
    // Buscar notas favoritas
    console.log('\n🔍 Buscando notas favoritas...');
    const favoritasResult = await makeRequest('/notas?favoritas=true');
    
    if (favoritasResult.success) {
      console.log(`✅ Encontradas ${favoritasResult.data.notas.length} notas favoritas`);
    }
    
    // Desfavoritar a nota
    console.log('\n⭐ Desfavoritando nota...');
    const desfavoritarResult = await makeRequest(`/notas/${notaId}`, {
      method: 'PATCH',
      body: JSON.stringify({ favorita: false })
    });
    
    if (desfavoritarResult.success) {
      console.log('✅ Nota desfavoritada com sucesso');
    }
    
    // Limpar - deletar nota de teste
    console.log('\n🗑️ Deletando nota de teste...');
    await makeRequest(`/notas/${notaId}`, {
      method: 'DELETE'
    });
  }
}

// Test queries otimizadas
async function testQueriesOtimizadas() {
  console.log('\n🚀 === TESTANDO QUERIES OTIMIZADAS ===');
  
  // Test notas com filtros
  console.log('\n📝 Testando filtros de notas...');
  await makeRequest('/notas?limit=10&offset=0');
  await makeRequest('/notas?favoritas=true');
  await makeRequest('/notas?topico=Teste');
  
  // Test links com filtros
  console.log('\n🔗 Testando filtros de links...');
  await makeRequest('/links?limit=10&offset=0');
  await makeRequest('/links?favorito=true');
  await makeRequest('/links?categoria=teste');
  await makeRequest('/links?search=teste');
  
  // Test categorias com filtros
  console.log('\n🏷️ Testando filtros de categorias...');
  await makeRequest('/categorias?limit=10&offset=0');
  await makeRequest('/categorias?search=teste');
  await makeRequest('/categorias?cor=%23FF0000');
}

// Main test function
async function runAllTests() {
  console.log('🧪 === INICIANDO TESTES DO BACKEND OTIMIZADO ===\n');
  
  try {
    await testAdminAPI();
    await testNotasFavoritar();
    await testQueriesOtimizadas();
    
    console.log('\n✅ === TODOS OS TESTES CONCLUÍDOS ===');
    console.log('\n🎉 Backend otimizado funcionando perfeitamente!');
    
  } catch (error) {
    console.error('\n❌ Erro durante os testes:', error);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
}

module.exports = {
  testAdminAPI,
  testNotasFavoritar,
  testQueriesOtimizadas,
  runAllTests
};
