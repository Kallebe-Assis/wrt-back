const https = require('https');

console.log('🧪 Testando endpoints com filtro por usuário...\n');

const baseUrl = 'https://wrt-back.vercel.app';

function testEndpointWithUser(endpoint, userId) {
  return new Promise((resolve, reject) => {
    const url = `${baseUrl}${endpoint}`;
    
    console.log(`🔍 Testando: ${url}`);
    console.log(`👤 User ID: ${userId}`);
    
    const options = {
      headers: {
        'user-id': userId,
        'Content-Type': 'application/json'
      }
    };
    
    const req = https.get(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`✅ Status: ${res.statusCode}`);
        console.log(`📋 Headers CORS:`);
        console.log(`   - Access-Control-Allow-Origin: ${res.headers['access-control-allow-origin'] || '❌ Não encontrado'}`);
        
        if (data) {
          try {
            const jsonData = JSON.parse(data);
            console.log(`📦 Resposta:`, JSON.stringify(jsonData, null, 2));
          } catch (e) {
            console.log(`📦 Resposta (texto):`, data.substring(0, 200) + '...');
          }
        }
        
        console.log('---\n');
        resolve({ status: res.statusCode, data, headers: res.headers });
      });
    });
    
    req.on('error', (error) => {
      console.log(`❌ Erro: ${error.message}`);
      console.log('---\n');
      reject(error);
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      console.log(`❌ Timeout após 10 segundos`);
      console.log('---\n');
      reject(new Error('Timeout'));
    });
  });
}

async function testAllUsers() {
  const endpoints = ['/api/links', '/api/notas', '/api/categorias'];
  const users = ['user1', 'user2', 'user3']; // user3 não existe nos dados mock
  
  console.log('🚀 Testando endpoints com diferentes usuários...\n');
  
  for (const endpoint of endpoints) {
    for (const userId of users) {
      try {
        await testEndpointWithUser(endpoint, userId);
      } catch (error) {
        console.log(`❌ Falha no endpoint ${endpoint} com usuário ${userId}: ${error.message}`);
      }
    }
  }
  
  console.log('🎯 Análise dos resultados:');
  console.log('✅ user1: Deve ter dados (3 links, 3 notas, 4 categorias)');
  console.log('✅ user2: Deve ter dados (1 link, 1 nota, 2 categorias)');
  console.log('✅ user3: Deve retornar arrays vazios (usuário não existe)');
  console.log('❌ Sem user-id: Deve retornar erro 400');
}

testAllUsers().catch(console.error); 