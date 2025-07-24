const https = require('https');

console.log('🧪 Testando usuário Kallebe...\n');

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

async function testKallebeUser() {
  console.log('🚀 Testando usuário Kallebe (kallebe@g2telecom.com.br)...\n');
  
  // Teste 1: Login do Kallebe
  console.log('1️⃣ Testando login do Kallebe...');
  try {
    const loginResponse = await makeRequest(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'kallebe@g2telecom.com.br',
        senha: '123456'
      })
    });
    
    console.log(`✅ Status: ${loginResponse.status}`);
    console.log(`📦 Resposta:`, JSON.stringify(loginResponse.data, null, 2));
    
    if (loginResponse.data.usuario && loginResponse.data.usuario.id === 'kallebe') {
      console.log(`✅ Login do Kallebe bem-sucedido!`);
    }
    console.log('---\n');
  } catch (error) {
    console.log(`❌ Erro: ${error.message}\n`);
  }
  
  // Teste 2: Links do Kallebe
  console.log('2️⃣ Testando links do Kallebe...');
  try {
    const linksResponse = await makeRequest(`${baseUrl}/api/links`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'user-id': 'kallebe'
      }
    });
    
    console.log(`✅ Status: ${linksResponse.status}`);
    console.log(`📦 Resposta:`, JSON.stringify(linksResponse.data, null, 2));
    
    if (linksResponse.data.data && linksResponse.data.data.length > 0) {
      console.log(`✅ Kallebe tem ${linksResponse.data.data.length} links`);
      console.log(`📋 Links:`, linksResponse.data.data.map(link => link.titulo).join(', '));
    }
    console.log('---\n');
  } catch (error) {
    console.log(`❌ Erro: ${error.message}\n`);
  }
  
  // Teste 3: Notas do Kallebe
  console.log('3️⃣ Testando notas do Kallebe...');
  try {
    const notasResponse = await makeRequest(`${baseUrl}/api/notas`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'user-id': 'kallebe'
      }
    });
    
    console.log(`✅ Status: ${notasResponse.status}`);
    console.log(`📦 Resposta:`, JSON.stringify(notasResponse.data, null, 2));
    
    if (notasResponse.data.data && notasResponse.data.data.length > 0) {
      console.log(`✅ Kallebe tem ${notasResponse.data.data.length} notas`);
      console.log(`📋 Notas:`, notasResponse.data.data.map(nota => nota.titulo).join(', '));
    }
    console.log('---\n');
  } catch (error) {
    console.log(`❌ Erro: ${error.message}\n`);
  }
  
  // Teste 4: Categorias do Kallebe
  console.log('4️⃣ Testando categorias do Kallebe...');
  try {
    const categoriasResponse = await makeRequest(`${baseUrl}/api/categorias`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'user-id': 'kallebe'
      }
    });
    
    console.log(`✅ Status: ${categoriasResponse.status}`);
    console.log(`📦 Resposta:`, JSON.stringify(categoriasResponse.data, null, 2));
    
    if (categoriasResponse.data.data && categoriasResponse.data.data.length > 0) {
      console.log(`✅ Kallebe tem ${categoriasResponse.data.data.length} categorias`);
      console.log(`📋 Categorias:`, categoriasResponse.data.data.map(cat => cat.nome).join(', '));
    }
    console.log('---\n');
  } catch (error) {
    console.log(`❌ Erro: ${error.message}\n`);
  }
  
  console.log('🎯 Resumo do usuário Kallebe:');
  console.log('👤 Email: kallebe@g2telecom.com.br');
  console.log('🔑 Senha: 123456');
  console.log('🆔 User ID: kallebe');
  console.log('📝 Use essas credenciais no frontend para acessar seus dados!');
}

testKallebeUser().catch(console.error); 