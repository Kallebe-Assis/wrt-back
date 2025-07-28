const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:5000/api';
const TEST_USER_ID = 'test-user-123';

async function testBuscarFavoritas() {
  console.log('\n🧪 TESTE: Buscar favoritas');
  try {
    const response = await fetch(`${API_BASE_URL}/notas/favoritas?userId=${TEST_USER_ID}`);
    const data = await response.json();
    console.log('✅ Resposta:', data);
    return data;
  } catch (error) {
    console.error('❌ Erro:', error.message);
    return null;
  }
}

async function testAlternarFavorito(notaId) {
  console.log('\n🧪 TESTE: Alternar favorito');
  try {
    const response = await fetch(`${API_BASE_URL}/notas/${notaId}/favorito`, {
      method: 'PATCH'
    });
    const data = await response.json();
    console.log('✅ Resposta:', data);
    return data;
  } catch (error) {
    console.error('❌ Erro:', error.message);
    return null;
  }
}

async function executarTestes() {
  console.log('🚀 Iniciando testes de favoritos...');
  
  // Teste 1: Buscar favoritas
  await testBuscarFavoritas();
  
  // Teste 2: Alternar favorito (usando um ID fictício)
  await testAlternarFavorito('nota-teste-123');
}

if (require.main === module) {
  executarTestes();
}

module.exports = {
  testBuscarFavoritas,
  testAlternarFavorito
}; 