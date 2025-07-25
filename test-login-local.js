const fetch = require('node-fetch');

async function testLoginLocal() {
  console.log('🧪 Testando login localmente...');
  
  const testCases = [
    {
      name: 'Login com usuário de teste (simulado)',
      data: {
        email: 'kallebe@g2telecom.com.br',
        senha: 'Amsterda309061'
      }
    },
    {
      name: 'Login com usuário real do Firebase',
      data: {
        email: 'kallebe@g2telecom.com.br',
        senha: '123456'
      }
    },
    {
      name: 'Login com email inválido',
      data: {
        email: 'usuario@inexistente.com',
        senha: '123456'
      }
    },
    {
      name: 'Login sem email',
      data: {
        senha: '123456'
      }
    },
    {
      name: 'Login sem senha',
      data: {
        email: 'kallebe@g2telecom.com.br'
      }
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n📋 Testando: ${testCase.name}`);
    console.log(`📤 Dados:`, JSON.stringify(testCase.data, null, 2));
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCase.data)
      });
      
      const data = await response.json();
      
      console.log(`📥 Status: ${response.status}`);
      console.log(`📥 Resposta:`, JSON.stringify(data, null, 2));
      
      if (response.ok) {
        console.log('✅ SUCESSO!');
      } else {
        console.log('❌ ERRO!');
      }
      
    } catch (error) {
      console.error('❌ Erro na requisição:', error.message);
    }
    
    console.log('─'.repeat(50));
  }
}

// Verificar se o servidor está rodando
async function checkServer() {
  try {
    const response = await fetch('http://localhost:5000/api/test-simple');
    const data = await response.json();
    console.log('✅ Servidor local está rodando');
    console.log('📥 Resposta do teste simples:', data);
    return true;
  } catch (error) {
    console.error('❌ Servidor local não está rodando');
    console.error('💡 Execute: npm start ou node server.js');
    return false;
  }
}

async function main() {
  console.log('🚀 Iniciando testes de login local...');
  
  const serverRunning = await checkServer();
  if (!serverRunning) {
    return;
  }
  
  await testLoginLocal();
  
  console.log('\n🎉 Testes concluídos!');
}

main().catch(console.error); 