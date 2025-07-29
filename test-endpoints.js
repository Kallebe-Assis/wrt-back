const axios = require('axios');

// Configuração base
const BASE_URL = 'https://wrt-back.vercel.app/api';
const USER_ID = 'Nrt4xSRGjruu5yBTUxrA'; // ID do usuário de teste

// Função para fazer requisições GET (com userId no query)
async function makeGetRequest(endpoint, params = {}) {
  try {
    const url = `${BASE_URL}${endpoint}`;
    const config = {
      method: 'GET',
      url,
      params: { ...params, userId: USER_ID },
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    console.log(`\n🌐 GET ${endpoint}`);
    console.log('📤 Params enviados:', config.params);
    console.log('📋 Headers:', config.headers);
    
    const response = await axios(config);
    
    console.log('✅ Status:', response.status);
    console.log('📦 Resposta:', response.data);
    
    return response.data;
  } catch (error) {
    console.log('❌ Erro:', error.response?.status || error.code);
    console.log('📦 Resposta de erro:', error.response?.data || error.message);
    throw error;
  }
}

// Função para fazer requisições POST (com userId no body)
async function makePostRequest(endpoint, data = {}) {
  try {
    const url = `${BASE_URL}${endpoint}`;
    const requestData = { ...data, userId: USER_ID };
    const config = {
      method: 'POST',
      url,
      data: requestData,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    console.log(`\n🌐 POST ${endpoint}`);
    console.log('📤 Dados enviados:', requestData);
    console.log('📋 Headers:', config.headers);
    
    const response = await axios(config);
    
    console.log('✅ Status:', response.status);
    console.log('📦 Resposta:', response.data);
    
    return response.data;
  } catch (error) {
    console.log('❌ Erro:', error.response?.status || error.code);
    console.log('📦 Resposta de erro:', error.response?.data || error.message);
    throw error;
  }
}

// Testes dos endpoints
async function testarEndpoints() {
  console.log('🧪 INICIANDO TESTES DOS ENDPOINTS (Vercel Functions)');
  console.log('=' .repeat(60));
  
  try {
    // 1. Teste GET /api/notas - Listar notas
    console.log('\n📝 TESTE 1: Listar notas');
    await makeGetRequest('/notas');
    
    // 2. Teste POST /api/notas - Criar nota (CORRETO)
    console.log('\n📝 TESTE 2: Criar nota (CORRETO)');
    const notaCorreta = {
      titulo: 'Nota de Teste',
      conteudo: 'Conteúdo da nota de teste'
    };
    await makePostRequest('/notas', notaCorreta);
    
    // 3. Teste POST /api/notas - Criar nota (SEM CONTEÚDO - DEVE FALHAR)
    console.log('\n📝 TESTE 3: Criar nota (SEM CONTEÚDO - DEVE FALHAR)');
    const notaSemConteudo = {
      titulo: 'Nota sem conteúdo',
      conteudo: ''
    };
    try {
      await makePostRequest('/notas', notaSemConteudo);
    } catch (error) {
      console.log('✅ Erro esperado capturado corretamente');
    }
    
    // 4. Teste POST /api/notas - Criar nota (SEM TÍTULO - DEVE FALHAR)
    console.log('\n📝 TESTE 4: Criar nota (SEM TÍTULO - DEVE FALHAR)');
    const notaSemTitulo = {
      titulo: '',
      conteudo: 'Conteúdo sem título'
    };
    try {
      await makePostRequest('/notas', notaSemTitulo);
    } catch (error) {
      console.log('✅ Erro esperado capturado corretamente');
    }
    
    // 5. Teste GET /api/notas - Listar notas novamente
    console.log('\n📝 TESTE 5: Listar notas novamente');
    const notasAtualizadas = await makeGetRequest('/notas');
    
    // 6. Teste GET /api/links - Listar links
    console.log('\n📝 TESTE 6: Listar links');
    await makeGetRequest('/links');
    
    // 7. Teste POST /api/links - Criar link
    console.log('\n📝 TESTE 7: Criar link');
    const linkCorreto = {
      nome: 'Google',
      url: 'https://google.com',
      descricao: 'Site de busca'
    };
    await makePostRequest('/links', linkCorreto);
    
    console.log('\n🎉 TODOS OS TESTES CONCLUÍDOS!');
    
  } catch (error) {
    console.error('❌ Erro geral nos testes:', error.message);
  }
}

// Executar testes
testarEndpoints();