const fetch = require('node-fetch');

// Test configuration
const BASE_URL = 'https://wrt-back.vercel.app/api';
const TEST_USER_ID = 'test-user-123';

// Helper function to test CORS
async function testCORS(endpoint, method = 'GET', body = null) {
  const url = `${BASE_URL}${endpoint}`;
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'user-id': TEST_USER_ID,
      'Origin': 'http://localhost:3000'
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    console.log(`\n🔍 Testando CORS: ${method} ${url}`);
    console.log(`📋 Headers:`, options.headers);
    
    const response = await fetch(url, options);
    
    console.log(`📊 Status: ${response.status}`);
    console.log(`📋 Response Headers:`);
    response.headers.forEach((value, key) => {
      console.log(`  ${key}: ${value}`);
    });
    
    const data = await response.json();
    console.log(`📄 Response Body:`, JSON.stringify(data, null, 2));
    
    return { success: response.ok, data, status: response.status };
  } catch (error) {
    console.error(`❌ Erro: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Test OPTIONS preflight
async function testOPTIONS(endpoint) {
  const url = `${BASE_URL}${endpoint}`;
  
  try {
    console.log(`\n🔍 Testando OPTIONS preflight: ${url}`);
    
    const response = await fetch(url, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'PUT',
        'Access-Control-Request-Headers': 'Content-Type, user-id'
      }
    });
    
    console.log(`📊 Status: ${response.status}`);
    console.log(`📋 Response Headers:`);
    response.headers.forEach((value, key) => {
      console.log(`  ${key}: ${value}`);
    });
    
    return { success: response.ok, status: response.status };
  } catch (error) {
    console.error(`❌ Erro: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Test functions
async function testNotasCORS() {
  console.log('\n📝 === TESTANDO CORS - NOTAS ===');
  
  // Test OPTIONS preflight for PUT
  await testOPTIONS('/notas/test-id');
  
  // Test actual PUT request
  await testCORS('/notas/test-id', 'PUT', {
    titulo: 'Teste CORS',
    conteudo: 'Conteúdo de teste'
  });
}

async function testLinksCORS() {
  console.log('\n🔗 === TESTANDO CORS - LINKS ===');
  
  // Test OPTIONS preflight for PUT
  await testOPTIONS('/links/test-id');
  
  // Test actual PUT request
  await testCORS('/links/test-id', 'PUT', {
    nome: 'Teste CORS',
    url: 'https://example.com'
  });
}

async function testCategoriasCORS() {
  console.log('\n📂 === TESTANDO CORS - CATEGORIAS ===');
  
  // Test OPTIONS preflight for PUT
  await testOPTIONS('/categorias/test-id');
  
  // Test actual PUT request
  await testCORS('/categorias/test-id', 'PUT', {
    nome: 'Teste CORS',
    cor: '#ff0000'
  });
}

// Run all CORS tests
async function runCORSTests() {
  console.log('🚀 Iniciando testes de CORS...');
  
  try {
    await testNotasCORS();
    await testLinksCORS();
    await testCategoriasCORS();
    
    console.log('\n✅ Todos os testes de CORS concluídos!');
  } catch (error) {
    console.error('\n❌ Erro durante os testes de CORS:', error);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runCORSTests();
}

module.exports = { runCORSTests }; 