const https = require('https');

console.log('🧪 Testando endpoints do frontend...\n');

const baseUrl = 'https://wrt-back.vercel.app';
const endpoints = [
  '/api/links',
  '/api/notas',
  '/api/categorias',
  '/api/links/1',
  '/api/notas/1',
  '/api/categorias/1'
];

function testEndpoint(endpoint) {
  return new Promise((resolve, reject) => {
    const url = `${baseUrl}${endpoint}`;
    
    console.log(`🔍 Testando: ${url}`);
    
    const req = https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`✅ Status: ${res.statusCode}`);
        console.log(`📋 Headers CORS:`);
        console.log(`   - Access-Control-Allow-Origin: ${res.headers['access-control-allow-origin'] || '❌ Não encontrado'}`);
        console.log(`   - Access-Control-Allow-Methods: ${res.headers['access-control-allow-methods'] || '❌ Não encontrado'}`);
        console.log(`   - Access-Control-Allow-Headers: ${res.headers['access-control-allow-headers'] || '❌ Não encontrado'}`);
        
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

async function testAllEndpoints() {
  console.log('🚀 Testando endpoints do frontend...\n');
  
  for (const endpoint of endpoints) {
    try {
      await testEndpoint(endpoint);
    } catch (error) {
      console.log(`❌ Falha no endpoint ${endpoint}: ${error.message}`);
    }
  }
  
  console.log('🎯 Análise dos resultados:');
  console.log('✅ Status 200: Endpoint funcionando');
  console.log('❌ Status 500: Erro interno do servidor');
  console.log('❌ Status 404: Endpoint não encontrado');
  console.log('❌ Timeout: Servidor não responde');
  console.log('❌ CORS não configurado: Problema de CORS');
}

testAllEndpoints().catch(console.error); 