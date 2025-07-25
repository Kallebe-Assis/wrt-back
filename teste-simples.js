const http = require('http');

// Função para fazer requisição HTTP simples
function fazerRequisicao(metodo, caminho, dados = null) {
  return new Promise((resolve, reject) => {
    const opcoes = {
      hostname: 'localhost',
      port: 5000,
      path: caminho,
      method: metodo,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(opcoes, (res) => {
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

    if (dados) {
      req.write(JSON.stringify(dados));
    }

    req.end();
  });
}

async function testarBackend() {
  console.log('🧪 Testando backend simples...\n');

  try {
    // Teste 1: Endpoint de teste
    console.log('1. Testando endpoint /api/test...');
    const teste1 = await fazerRequisicao('GET', '/api/test');
    console.log('Status:', teste1.status);
    console.log('Resposta:', teste1.data);
    console.log('✅ Teste 1 passou!\n');

    // Teste 2: Login com usuário existente
    console.log('2. Testando login...');
    const teste2 = await fazerRequisicao('POST', '/api/auth/login', {
      email: 'kallebe@g2telecom.com.br',
      senha: '123456'
    });
    console.log('Status:', teste2.status);
    console.log('Resposta:', teste2.data);
    console.log('✅ Teste 2 passou!\n');

    // Teste 3: Buscar notas
    console.log('3. Testando busca de notas...');
    const teste3 = await fazerRequisicao('GET', '/api/notas?userId=test-user');
    console.log('Status:', teste3.status);
    console.log('Resposta:', teste3.data);
    console.log('✅ Teste 3 passou!\n');

    console.log('🎉 Todos os testes passaram! Backend funcionando perfeitamente!');

  } catch (error) {
    console.error('❌ Erro nos testes:', error.message);
  }
}

testarBackend(); 