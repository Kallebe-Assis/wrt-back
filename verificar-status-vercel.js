const https = require('https');

console.log('🔍 Verificando status do backend no Vercel...\n');

// URLs para testar
const urls = [
  'https://wrt-back.vercel.app/api/health',
  'https://wrt-back.vercel.app/api/debug',
  'https://wrt-back.vercel.app/api/test',
  'https://wrt-back.vercel.app/api/links/pendencias'
];

function testUrl(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          url,
          status: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });
    
    req.on('error', (error) => {
      reject({
        url,
        error: error.message
      });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      reject({
        url,
        error: 'Timeout após 10 segundos'
      });
    });
  });
}

async function verificarStatus() {
  console.log('📡 Testando endpoints...\n');
  
  for (const url of urls) {
    try {
      console.log(`🔍 Testando: ${url}`);
      const result = await testUrl(url);
      
      console.log(`✅ Status: ${result.status}`);
      console.log(`📋 Headers CORS:`);
      console.log(`   - Access-Control-Allow-Origin: ${result.headers['access-control-allow-origin'] || '❌ Não encontrado'}`);
      console.log(`   - Access-Control-Allow-Methods: ${result.headers['access-control-allow-methods'] || '❌ Não encontrado'}`);
      console.log(`   - Access-Control-Allow-Headers: ${result.headers['access-control-allow-headers'] || '❌ Não encontrado'}`);
      
      if (result.data) {
        try {
          const jsonData = JSON.parse(result.data);
          console.log(`📦 Resposta:`, JSON.stringify(jsonData, null, 2));
        } catch (e) {
          console.log(`📦 Resposta (texto):`, result.data.substring(0, 200) + '...');
        }
      }
      
      console.log('---\n');
      
    } catch (error) {
      console.log(`❌ Erro: ${error.error}`);
      console.log('---\n');
    }
  }
  
  console.log('🎯 Análise dos problemas:');
  console.log('1. Se status 404: Endpoint não existe');
  console.log('2. Se status 500: Erro interno do servidor');
  console.log('3. Se timeout: Servidor não responde');
  console.log('4. Se CORS headers ausentes: Problema de configuração CORS');
  console.log('5. Se Firebase não inicializado: Variáveis de ambiente faltando');
}

verificarStatus().catch(console.error); 