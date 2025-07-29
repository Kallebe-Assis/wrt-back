const axios = require('axios');

// Configuração base
const BASE_URL = 'https://wrt-back.vercel.app/api';
const USER_ID = 'Nrt4xSRGjruu5yBTUxrA'; // ID do usuário de teste

// Simular como o frontend faz as requisições
async function testarIntegracaoFrontend() {
  console.log('🧪 TESTANDO INTEGRAÇÃO FRONTEND-BACKEND');
  console.log('=' .repeat(60));
  
  try {
    // 1. Teste GET /api/notas - Como o frontend faz (userId no query)
    console.log('\n📝 TESTE 1: GET /api/notas (Frontend Style)');
    const response1 = await axios.get(`${BASE_URL}/notas?userId=${USER_ID}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Status:', response1.status);
    console.log('📦 Resposta:', response1.data);
    
    // 2. Teste POST /api/notas - Como o frontend faz (userId no body)
    console.log('\n📝 TESTE 2: POST /api/notas (Frontend Style)');
    const notaTeste = {
      titulo: 'Nota de Teste Frontend',
      conteudo: 'Conteúdo da nota de teste do frontend',
      userId: USER_ID
    };
    const response2 = await axios.post(`${BASE_URL}/notas`, notaTeste, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Status:', response2.status);
    console.log('📦 Resposta:', response2.data);
    
    // 3. Teste GET /api/links - Como o frontend faz (user-id no header)
    console.log('\n📝 TESTE 3: GET /api/links (Frontend Style)');
    const response3 = await axios.get(`${BASE_URL}/links`, {
      headers: {
        'Content-Type': 'application/json',
        'user-id': USER_ID
      }
    });
    console.log('✅ Status:', response3.status);
    console.log('📦 Resposta:', response3.data);
    
    // 4. Teste POST /api/links - Como o frontend faz (user-id no header)
    console.log('\n📝 TESTE 4: POST /api/links (Frontend Style)');
    const linkTeste = {
      nome: 'Teste Frontend',
      url: 'https://teste.com',
      descricao: 'Link de teste do frontend'
    };
    const response4 = await axios.post(`${BASE_URL}/links`, linkTeste, {
      headers: {
        'Content-Type': 'application/json',
        'user-id': USER_ID
      }
    });
    console.log('✅ Status:', response4.status);
    console.log('📦 Resposta:', response4.data);
    
    // 5. Teste GET /api/notas novamente para verificar se a nota foi criada
    console.log('\n📝 TESTE 5: GET /api/notas (Verificar nota criada)');
    const response5 = await axios.get(`${BASE_URL}/notas?userId=${USER_ID}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Status:', response5.status);
    console.log('📦 Total de notas:', response5.data.notas?.length || 0);
    
    // 6. Teste GET /api/links novamente para verificar se o link foi criado
    console.log('\n📝 TESTE 6: GET /api/links (Verificar link criado)');
    const response6 = await axios.get(`${BASE_URL}/links`, {
      headers: {
        'Content-Type': 'application/json',
        'user-id': USER_ID
      }
    });
    console.log('✅ Status:', response6.status);
    console.log('📦 Total de links:', response6.data.data?.length || 0);
    
    console.log('\n🎉 TODOS OS TESTES DE INTEGRAÇÃO CONCLUÍDOS COM SUCESSO!');
    console.log('✅ Frontend e Backend estão se comunicando corretamente');
    
  } catch (error) {
    console.error('❌ Erro nos testes de integração:', error.response?.status || error.code);
    console.error('📦 Resposta de erro:', error.response?.data || error.message);
  }
}

// Executar testes
testarIntegracaoFrontend();