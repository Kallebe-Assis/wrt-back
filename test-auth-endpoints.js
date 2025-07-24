const https = require('https');

console.log('🧪 Testando endpoints de autenticação...\n');

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

async function testAuthEndpoints() {
  console.log('🚀 Testando endpoints de autenticação...\n');
  
  // Teste 1: Login com usuário válido
  console.log('1️⃣ Testando login com user1@test.com...');
  try {
    const loginResponse = await makeRequest(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'user1@test.com',
        password: '123456'
      })
    });
    
    console.log(`✅ Status: ${loginResponse.status}`);
    console.log(`📦 Resposta:`, JSON.stringify(loginResponse.data, null, 2));
    console.log('---\n');
  } catch (error) {
    console.log(`❌ Erro: ${error.message}\n`);
  }
  
  // Teste 2: Login com usuário inválido
  console.log('2️⃣ Testando login com usuário inválido...');
  try {
    const invalidLoginResponse = await makeRequest(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'invalid@test.com',
        password: 'wrongpassword'
      })
    });
    
    console.log(`✅ Status: ${invalidLoginResponse.status}`);
    console.log(`📦 Resposta:`, JSON.stringify(invalidLoginResponse.data, null, 2));
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
        name: 'Novo Usuário',
        email: 'novo@test.com',
        password: '123456'
      })
    });
    
    console.log(`✅ Status: ${registerResponse.status}`);
    console.log(`📦 Resposta:`, JSON.stringify(registerResponse.data, null, 2));
    console.log('---\n');
  } catch (error) {
    console.log(`❌ Erro: ${error.message}\n`);
  }
  
  // Teste 4: Logout
  console.log('4️⃣ Testando logout...');
  try {
    const logoutResponse = await makeRequest(`${baseUrl}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`✅ Status: ${logoutResponse.status}`);
    console.log(`📦 Resposta:`, JSON.stringify(logoutResponse.data, null, 2));
    console.log('---\n');
  } catch (error) {
    console.log(`❌ Erro: ${error.message}\n`);
  }
  
  console.log('🎯 Credenciais para teste:');
  console.log('👤 user1@test.com / 123456');
  console.log('👤 user2@test.com / 123456');
  console.log('📝 Use essas credenciais no frontend para testar o login!');
}

testAuthEndpoints().catch(console.error); 