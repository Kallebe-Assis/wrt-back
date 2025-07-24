const https = require('https');

async function testEndpoint(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };
    
    console.log(`🔍 Testando: ${url}`);
    console.log(`📝 Headers:`, headers);
    
    const req = https.request(options, (res) => {
      console.log(`📡 Status: ${res.statusCode}`);
      console.log(`📡 Status Text: ${res.statusMessage}`);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          console.log(`📦 Resposta:`, jsonData);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (error) {
          console.log(`📦 Resposta (texto):`, data);
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', (error) => {
      console.error(`❌ Erro:`, error);
      reject(error);
    });
    
    req.end();
  });
}

async function testAll() {
  try {
    console.log('🧪 Testando endpoints do Vercel...\n');
    
    const userId = 'azphyIqxyYa9YKOGvNae';
    const headers = { 'user-id': userId };
    
    // Teste 1: Health check
    console.log('1️⃣ Testando health check...');
    await testEndpoint('https://wrt-back.vercel.app/api/health');
    
    // Teste 2: Todas as notas
    console.log('\n2️⃣ Testando todas as notas...');
    await testEndpoint('https://wrt-back.vercel.app/api/notas', headers);
    
    // Teste 3: Favoritas
    console.log('\n3️⃣ Testando favoritas...');
    await testEndpoint('https://wrt-back.vercel.app/api/notas/favoritas', headers);
    
    // Teste 4: Fixadas
    console.log('\n4️⃣ Testando fixadas...');
    await testEndpoint('https://wrt-back.vercel.app/api/notas/fixadas', headers);
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  }
}

testAll()
  .then(() => {
    console.log('\n✅ Teste concluído');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erro:', error);
    process.exit(1);
  }); 