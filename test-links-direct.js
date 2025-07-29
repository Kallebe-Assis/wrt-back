const axios = require('axios');

// Configuração base
const BASE_URL = 'https://wrt-back.vercel.app/api';
const USER_ID = 'Nrt4xSRGjruu5yBTUxrA';

// Função para fazer requisições com header user-id
async function makeRequest(method, endpoint, data = null, useUserIdHeader = true) {
  try {
    const url = `${BASE_URL}${endpoint}`;
    const config = {
      method,
      url,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    // Adicionar header de usuário
    if (useUserIdHeader) {
      config.headers['user-id'] = USER_ID;
    } else {
      config.headers['userId'] = USER_ID;
    }

    if (data) {
      config.data = data;
    }

    console.log(`\n🌐 ${method} ${endpoint}`);
    console.log('📋 Headers:', config.headers);
    if (data) {
      console.log('📤 Dados enviados:', data);
    }

    const response = await axios(config);

    console.log('✅ Status:', response.status);
    console.log('📦 Resposta:', JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    console.log('❌ Erro:', error.response?.status || error.code);
    console.log('📦 Resposta de erro:', error.response?.data || error.message);
    throw error;
  }
}

// Testes específicos para links
async function testarLinks() {
  console.log('🧪 TESTE DIRETO DOS LINKS');
  console.log('=' .repeat(50));
  
  try {
    // 1. Teste GET /api/links - Listar links (antes)
    console.log('\n📝 TESTE 1: Listar links (antes de criar)');
    const linksAntes = await makeRequest('GET', '/links');
    
    // 2. Teste POST /api/links - Criar link
    console.log('\n📝 TESTE 2: Criar link');
    const linkData = {
      nome: 'Teste Direto',
      url: 'https://exemplo.com/teste',
      imagemUrl: ''
    };
    const linkCriado = await makeRequest('POST', '/links', linkData);
    
    // Aguardar um pouco para o banco processar
    console.log('\n⏳ Aguardando 2 segundos...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 3. Teste GET /api/links - Listar links (depois)
    console.log('\n📝 TESTE 3: Listar links (depois de criar)');
    const linksDepois = await makeRequest('GET', '/links');
    
    // 4. Teste GET com header diferente
    console.log('\n📝 TESTE 4: Listar links com header userId');
    try {
      const linksDepois2 = await makeRequest('GET', '/links', null, false);
    } catch (error) {
      console.log('✅ Erro esperado: backend rejeita header userId');
    }
    
    // 5. Teste GET com query parameter
    console.log('\n📝 TESTE 5: Listar links com query parameter');
    try {
      const response = await axios({
        method: 'GET',
        url: `${BASE_URL}/links?userId=${USER_ID}`,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ Status:', response.status);
      console.log('📦 Resposta:', JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.log('❌ Erro com query parameter:', error.response?.status);
    }
    
    // 6. Comparar resultados
    console.log('\n📊 COMPARAÇÃO:');
    console.log('Links antes:', linksAntes.links?.length || linksAntes.data?.length || 0);
    console.log('Links depois (user-id):', linksDepois.links?.length || linksDepois.data?.length || 0);
    
    console.log('\n🎉 TESTES CONCLUÍDOS!');
    
  } catch (error) {
    console.error('❌ Erro geral nos testes:', error.message);
  }
}

// Executar testes
testarLinks();