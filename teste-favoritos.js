const fetch = require('node-fetch');

// Configuração
const API_BASE_URL = 'http://localhost:5000/api';
const TEST_USER_ID = 'test-user-123';

// Função para fazer requisições
async function makeRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'user-id': TEST_USER_ID
    },
    ...options
  };

  console.log('🌐 Fazendo requisição para:', url);
  console.log('📦 Dados:', options.body || 'Nenhum');

  try {
    const response = await fetch(url, defaultOptions);
    
    console.log('📡 Status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro HTTP:', response.status, errorText);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ Dados recebidos:', data);
    return data;
  } catch (error) {
    console.error('❌ Erro na requisição:', error);
    throw error;
  }
}

// Teste 1: Criar nota com favorito = false
async function testCriarNotaSemFavorito() {
  console.log('\n🧪 TESTE 1: Criar nota sem favorito');
  
  const notaData = {
    titulo: 'Nota de teste sem favorito',
    conteudo: 'Esta é uma nota de teste sem favorito',
    topico: 'Teste',
    categoria: 'Trabalho',
    userId: TEST_USER_ID,
    favorito: false
  };

  try {
    const response = await makeRequest('/notas', {
      method: 'POST',
      body: JSON.stringify(notaData)
    });
    
    console.log('✅ Nota criada com sucesso:', response.nota);
    
    if (response.nota.favorito === false) {
      console.log('✅ Favorito configurado corretamente como false');
      return response.nota.id;
    } else {
      console.error('❌ Favorito não configurado corretamente');
    }
  } catch (error) {
    console.error('❌ Erro ao criar nota:', error);
  }
}

// Teste 2: Criar nota com favorito = true
async function testCriarNotaComFavorito() {
  console.log('\n🧪 TESTE 2: Criar nota com favorito');
  
  const notaData = {
    titulo: 'Nota de teste com favorito',
    conteudo: 'Esta é uma nota de teste com favorito',
    topico: 'Teste',
    categoria: 'Pessoal',
    userId: TEST_USER_ID,
    favorito: true
  };

  try {
    const response = await makeRequest('/notas', {
      method: 'POST',
      body: JSON.stringify(notaData)
    });
    
    console.log('✅ Nota criada com sucesso:', response.nota);
    
    if (response.nota.favorito === true) {
      console.log('✅ Favorito configurado corretamente como true');
      return response.nota.id;
    } else {
      console.error('❌ Favorito não configurado corretamente');
    }
  } catch (error) {
    console.error('❌ Erro ao criar nota:', error);
  }
}

// Teste 3: Buscar notas favoritas
async function testBuscarFavoritas() {
  console.log('\n🧪 TESTE 3: Buscar notas favoritas');
  
  try {
    const response = await makeRequest('/notas/favoritas?userId=' + TEST_USER_ID);
    
    console.log('✅ Favoritas encontradas:', response.notas.length);
    
    response.notas.forEach((nota, index) => {
      console.log(`❤️ Favorita ${index + 1}:`, {
        id: nota.id,
        titulo: nota.titulo,
        favorito: nota.favorito
      });
    });
  } catch (error) {
    console.error('❌ Erro ao buscar favoritas:', error);
  }
}

// Teste 4: Alternar favorito
async function testAlternarFavorito(notaId) {
  console.log('\n🧪 TESTE 4: Alternar favorito');
  
  try {
    const response = await makeRequest(`/notas/${notaId}/favorito`, {
      method: 'PATCH'
    });
    
    console.log('✅ Favorito alternado com sucesso:', response);
    
    if (response.success) {
      console.log('✅ Favorito alternado corretamente!');
    } else {
      console.error('❌ Favorito não foi alternado corretamente');
    }
  } catch (error) {
    console.error('❌ Erro ao alternar favorito:', error);
  }
}

// Executar todos os testes
async function executarTestes() {
  console.log('🚀 Iniciando testes de favoritos...');
  
  try {
    // Teste 1: Criar nota sem favorito
    const notaId1 = await testCriarNotaSemFavorito();
    
    // Teste 2: Criar nota com favorito
    const notaId2 = await testCriarNotaComFavorito();
    
    // Teste 3: Buscar favoritas
    await testBuscarFavoritas();
    
    // Teste 4: Alternar favorito (se foi criada com sucesso)
    if (notaId1) {
      await testAlternarFavorito(notaId1);
    }
    
    console.log('\n✅ Todos os testes concluídos!');
  } catch (error) {
    console.error('❌ Erro durante os testes:', error);
  }
}

// Executar testes se o script for chamado diretamente
if (require.main === module) {
  executarTestes();
}

module.exports = {
  testCriarNotaSemFavorito,
  testCriarNotaComFavorito,
  testBuscarFavoritas,
  testAlternarFavorito,
  executarTestes
}; 