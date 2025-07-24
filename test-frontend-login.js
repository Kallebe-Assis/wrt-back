const https = require('https');

console.log('🧪 Testando login do frontend com nova estrutura...\n');

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

async function testFrontendLogin() {
  console.log('🚀 Testando login com nova estrutura de resposta...\n');
  
  // Teste 1: Login com dados exatos do frontend (teste@wrtmind.com)
  console.log('1️⃣ Testando login com teste@wrtmind.com...');
  try {
    const loginResponse = await makeRequest(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'teste@wrtmind.com',
        senha: '123456'
      })
    });
    
    console.log(`✅ Status: ${loginResponse.status}`);
    console.log(`📦 Resposta:`, JSON.stringify(loginResponse.data, null, 2));
    
    // Verificar estrutura da resposta
    if (loginResponse.data.usuario && loginResponse.data.usuario.id) {
      console.log(`✅ Estrutura correta: usuario.id = ${loginResponse.data.usuario.id}`);
    } else {
      console.log(`❌ Estrutura incorreta: usuario.id não encontrado`);
    }
    console.log('---\n');
  } catch (error) {
    console.log(`❌ Erro: ${error.message}\n`);
  }
  
  // Teste 2: Login com user1@test.com
  console.log('2️⃣ Testando login com user1@test.com...');
  try {
    const loginResponse2 = await makeRequest(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'user1@test.com',
        senha: '123456'
      })
    });
    
    console.log(`✅ Status: ${loginResponse2.status}`);
    console.log(`📦 Resposta:`, JSON.stringify(loginResponse2.data, null, 2));
    
    // Verificar estrutura da resposta
    if (loginResponse2.data.usuario && loginResponse2.data.usuario.id) {
      console.log(`✅ Estrutura correta: usuario.id = ${loginResponse2.data.usuario.id}`);
    } else {
      console.log(`❌ Estrutura incorreta: usuario.id não encontrado`);
    }
    console.log('---\n');
  } catch (error) {
    console.log(`❌ Erro: ${error.message}\n`);
  }
  
  // Teste 3: Registro de novo usuário
  console.log('3️⃣ Testando registro de novo usuário...');
  try {
    const registerResponse = await makeRequest(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nome: 'Novo Usuário Teste',
        email: 'novo@teste.com',
        senha: '123456'
      })
    });
    
    console.log(`✅ Status: ${registerResponse.status}`);
    console.log(`📦 Resposta:`, JSON.stringify(registerResponse.data, null, 2));
    
    // Verificar estrutura da resposta
    if (registerResponse.data.usuario && registerResponse.data.usuario.id) {
      console.log(`✅ Estrutura correta: usuario.id = ${registerResponse.data.usuario.id}`);
    } else {
      console.log(`❌ Estrutura incorreta: usuario.id não encontrado`);
    }
    console.log('---\n');
  } catch (error) {
    console.log(`❌ Erro: ${error.message}\n`);
  }
  
  console.log('🎯 Credenciais para teste no frontend:');
  console.log('👤 teste@wrtmind.com / 123456');
  console.log('👤 user1@test.com / 123456');
  console.log('👤 user2@test.com / 123456');
  console.log('📝 Use essas credenciais no frontend para testar o login!');
  console.log('📝 A estrutura da resposta agora é: { success: true, usuario: {...}, token: "..." }');
}

testFrontendLogin().catch(console.error); 