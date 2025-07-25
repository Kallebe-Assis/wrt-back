const https = require('https');

console.log('🧪 Testando login com credenciais reais do Kallebe...\n');

const baseUrl = 'https://wrt-back.vercel.app';

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

async function testRealLogin() {
  console.log('🚀 Testando login com credenciais reais...\n');
  
  // Teste 1: Login com credenciais reais do Kallebe
  console.log('1️⃣ Testando login com kallebe@g2telecom.com.br / Amsterda309061...');
  try {
    const loginResponse = await makeRequest(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'kallebe@g2telecom.com.br',
        senha: 'Amsterda309061'
      })
    });
    
    console.log(`✅ Status: ${loginResponse.status}`);
    console.log(`📦 Resposta:`, JSON.stringify(loginResponse.data, null, 2));
    
    if (loginResponse.data.success) {
      console.log(`✅ Login real bem-sucedido!`);
      console.log(`👤 Usuário ID: ${loginResponse.data.usuario.id}`);
      console.log(`📧 Email: ${loginResponse.data.usuario.email}`);
      console.log(`📝 Nome: ${loginResponse.data.usuario.nome || loginResponse.data.usuario.name}`);
    } else {
      console.log(`❌ Login falhou: ${loginResponse.data.error}`);
    }
    console.log('---\n');
  } catch (error) {
    console.log(`❌ Erro: ${error.message}\n`);
  }
  
  // Teste 2: Login com credenciais mock (para comparação)
  console.log('2️⃣ Testando login com credenciais mock (kallebe@g2telecom.com.br / 123456)...');
  try {
    const loginResponse2 = await makeRequest(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'kallebe@g2telecom.com.br',
        senha: '123456'
      })
    });
    
    console.log(`✅ Status: ${loginResponse2.status}`);
    console.log(`📦 Resposta:`, JSON.stringify(loginResponse2.data, null, 2));
    
    if (loginResponse2.data.success) {
      console.log(`✅ Login mock bem-sucedido!`);
    } else {
      console.log(`❌ Login mock falhou: ${loginResponse2.data.error}`);
    }
    console.log('---\n');
  } catch (error) {
    console.log(`❌ Erro: ${error.message}\n`);
  }
  
  console.log('🎯 Resumo dos testes:');
  console.log('👤 Credenciais reais: kallebe@g2telecom.com.br / Amsterda309061');
  console.log('👤 Credenciais mock: kallebe@g2telecom.com.br / 123456');
  console.log('📝 O sistema deve priorizar o banco real, mas usar mock como fallback');
}

testRealLogin().catch(console.error); 