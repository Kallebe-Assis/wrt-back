const https = require('https');
const http = require('http');

// Função para fazer requisição HTTP
function makeRequest(url, options, data) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };
    
    const req = client.request(requestOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(body);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (error) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testLogin() {
  console.log('🧪 Testando login manualmente...');
  
  try {
    // Teste 1: Health check
    console.log('\n1. Testando health check...');
    const healthResponse = await makeRequest('http://localhost:5000/api/health', {});
    console.log('Status:', healthResponse.status);
    console.log('Resposta:', healthResponse.data);
    
    // Teste 2: Login com usuário de teste
    console.log('\n2. Testando login com usuário de teste...');
    const loginResponse = await makeRequest('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, {
      email: 'kallebe@g2telecom.com.br',
      senha: 'Amsterda309061'
    });
    
    console.log('Status:', loginResponse.status);
    console.log('Resposta:', loginResponse.data);
    
    // Teste 3: Login com usuário real
    console.log('\n3. Testando login com usuário real...');
    const loginRealResponse = await makeRequest('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, {
      email: 'kallebe@g2telecom.com.br',
      senha: '123456'
    });
    
    console.log('Status:', loginRealResponse.status);
    console.log('Resposta:', loginRealResponse.data);
    
    console.log('\n✅ Testes concluídos!');
    
  } catch (error) {
    console.error('❌ Erro nos testes:', error.message);
  }
}

testLogin(); 