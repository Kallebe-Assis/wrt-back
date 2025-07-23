#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 Configuração de Credenciais do WRTmind Backend\n');

// Função para fazer perguntas
function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

// Função para verificar se arquivo existe
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

// Função para criar arquivo de configuração
function createConfigFile(projectId, privateKey, clientEmail) {
  const configContent = `# Configurações do Servidor
PORT=3001
NODE_ENV=development

# Configurações do Firebase
FIREBASE_PROJECT_ID=${projectId}
FIREBASE_PRIVATE_KEY="${privateKey}"
FIREBASE_CLIENT_EMAIL=${clientEmail}

# Configurações de Segurança
JWT_SECRET=${generateRandomString(32)}
SESSION_SECRET=${generateRandomString(32)}
`;

  fs.writeFileSync('config.env', configContent);
  console.log('✅ Arquivo config.env criado com sucesso!');
}

// Função para gerar string aleatória
function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Função principal
async function setupCredentials() {
  try {
    console.log('📋 Vamos configurar suas credenciais do Firebase...\n');

    // Verificar se já existe config.env
    if (fileExists('config.env')) {
      const overwrite = await question('⚠️  Arquivo config.env já existe. Deseja sobrescrever? (s/n): ');
      if (overwrite.toLowerCase() !== 's') {
        console.log('❌ Configuração cancelada.');
        rl.close();
        return;
      }
    }

    // Verificar se existe service account
    if (!fileExists('wrtmin-service-account.json')) {
      console.log('❌ Arquivo wrtmin-service-account.json não encontrado!');
      console.log('\n📝 Para obter este arquivo:');
      console.log('1. Vá para https://console.firebase.google.com/');
      console.log('2. Selecione seu projeto');
      console.log('3. Vá em Configurações > Contas de serviço');
      console.log('4. Clique em "Gerar nova chave privada"');
      console.log('5. Baixe o arquivo JSON');
      console.log('6. Renomeie para wrtmin-service-account.json');
      console.log('7. Coloque na raiz do projeto\n');
      
      const continueSetup = await question('Deseja continuar sem o arquivo de service account? (s/n): ');
      if (continueSetup.toLowerCase() !== 's') {
        console.log('❌ Configuração cancelada.');
        rl.close();
        return;
      }
    }

    // Ler arquivo de service account se existir
    let projectId = '';
    let privateKey = '';
    let clientEmail = '';

    if (fileExists('wrtmin-service-account.json')) {
      try {
        const serviceAccount = JSON.parse(fs.readFileSync('wrtmin-service-account.json', 'utf8'));
        projectId = serviceAccount.project_id;
        privateKey = serviceAccount.private_key;
        clientEmail = serviceAccount.client_email;
        
        console.log('✅ Arquivo de service account encontrado!');
        console.log(`📁 Projeto: ${projectId}`);
        console.log(`📧 Email: ${clientEmail}\n`);
      } catch (error) {
        console.log('❌ Erro ao ler arquivo de service account:', error.message);
      }
    }

    // Se não conseguiu ler do arquivo, pedir manualmente
    if (!projectId) {
      projectId = await question('🔑 Digite o ID do seu projeto Firebase: ');
    }

    if (!privateKey) {
      console.log('\n📝 Para obter a chave privada:');
      console.log('1. Abra o arquivo wrtmin-service-account.json');
      console.log('2. Copie o valor do campo "private_key"');
      console.log('3. Cole aqui (incluindo as aspas)\n');
      privateKey = await question('🔐 Digite a chave privada do Firebase: ');
    }

    if (!clientEmail) {
      clientEmail = await question('📧 Digite o email do service account: ');
    }

    // Criar arquivo de configuração
    createConfigFile(projectId, privateKey, clientEmail);

    console.log('\n🎉 Configuração concluída com sucesso!');
    console.log('\n📋 Próximos passos:');
    console.log('1. Execute: npm install');
    console.log('2. Execute: npm start');
    console.log('3. Acesse: http://localhost:3001');
    
    console.log('\n🔐 Arquivos criados:');
    console.log('✅ config.env (com suas credenciais)');
    console.log('✅ wrtmin-service-account.json (se fornecido)');
    
    console.log('\n⚠️  Lembre-se:');
    console.log('- NUNCA commite estes arquivos no GitHub');
    console.log('- Mantenha suas credenciais seguras');
    console.log('- Use .env em produção');

  } catch (error) {
    console.error('❌ Erro durante a configuração:', error.message);
  } finally {
    rl.close();
  }
}

// Executar script
setupCredentials(); 