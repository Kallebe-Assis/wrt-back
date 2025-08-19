const fetch = require('node-fetch');

async function testSync() {
  console.log('🧪 Testando rota de sync...\n');

  const userId = 'test-user-123';
  const baseUrl = 'https://wrt-back.vercel.app/api';

  try {
    console.log('📊 Testando: GET /api/sync/status');
    const response = await fetch(`${baseUrl}/sync/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'user-id': userId
      }
    });

    console.log(`📊 Status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Erro: ${errorText}`);
      return;
    }

    const data = await response.json();
    console.log('📄 Resposta:', JSON.stringify(data, null, 2));

    console.log('\n✅ Teste de sync concluído com sucesso!');

  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

testSync();
