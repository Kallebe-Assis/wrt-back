const fetch = require('node-fetch');

// Test configuration
const BASE_URL = 'https://wrt-back.vercel.app/api';
const TEST_USER_ID = 'test-user-123';

// Test data
const testNota = {
  titulo: 'Teste de Nota',
  conteudo: 'Conteúdo de teste',
  userId: TEST_USER_ID,
  ativo: true
};

const testLink = {
  nome: 'Teste de Link',
  url: 'https://example.com',
  userId: TEST_USER_ID,
  ativo: true
};

const testCategoria = {
  nome: 'Teste de Categoria',
  cor: '#007bff',
  userId: TEST_USER_ID,
  ativo: true
};

// Helper function to make requests
async function makeRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'user-id': TEST_USER_ID
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

// Test functions
async function testNotasAPI() {
  console.log('\n📝 === TESTANDO API DE NOTAS ===');
  
  // Test GET /notas
  await makeRequest('/notas?userId=' + TEST_USER_ID);
  
  // Test POST /notas
  const createResult = await makeRequest('/notas', {
    method: 'POST',
    body: JSON.stringify(testNota)
  });
  
  if (createResult.success && createResult.data.nota) {
    const notaId = createResult.data.nota.id;
    
    // Test PUT /notas/[id]
    await makeRequest(`/notas/${notaId}`, {
      method: 'PUT',
      body: JSON.stringify({
        titulo: 'Nota Atualizada',
        conteudo: 'Conteúdo atualizado'
      })
    });
    
    // Test DELETE /notas/[id]
    await makeRequest(`/notas/${notaId}`, {
      method: 'DELETE'
    });
  }
}

async function testLinksAPI() {
  console.log('\n🔗 === TESTANDO API DE LINKS ===');
  
  // Test GET /links
  await makeRequest('/links?userId=' + TEST_USER_ID);
  
  // Test POST /links
  const createResult = await makeRequest('/links', {
    method: 'POST',
    body: JSON.stringify(testLink)
  });
  
  if (createResult.success && createResult.data) {
    const linkId = createResult.data.id;
    
    // Test PUT /links/[id]
    await makeRequest(`/links/${linkId}`, {
      method: 'PUT',
      body: JSON.stringify({
        nome: 'Link Atualizado',
        url: 'https://updated-example.com'
      })
    });
    
    // Test DELETE /links/[id]
    await makeRequest(`/links/${linkId}`, {
      method: 'DELETE'
    });
  }
}

async function testCategoriasAPI() {
  console.log('\n📂 === TESTANDO API DE CATEGORIAS ===');
  
  // Test GET /categorias
  await makeRequest('/categorias?userId=' + TEST_USER_ID);
  
  // Test POST /categorias
  const createResult = await makeRequest('/categorias', {
    method: 'POST',
    body: JSON.stringify(testCategoria)
  });
  
  if (createResult.success && createResult.data) {
    const categoriaId = createResult.data.id;
    
    // Test PUT /categorias/[id]
    await makeRequest(`/categorias/${categoriaId}`, {
      method: 'PUT',
      body: JSON.stringify({
        nome: 'Categoria Atualizada',
        cor: '#ff0000'
      })
    });
    
    // Test DELETE /categorias/[id]
    await makeRequest(`/categorias/${categoriaId}`, {
      method: 'DELETE'
    });
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Iniciando testes da API...');
  
  try {
    await testNotasAPI();
    await testLinksAPI();
    await testCategoriasAPI();
    
    console.log('\n✅ Todos os testes concluídos!');
  } catch (error) {
    console.error('\n❌ Erro durante os testes:', error);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = { runTests }; 