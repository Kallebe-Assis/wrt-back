#!/usr/bin/env node

/**
 * 🚀 Script de Inicialização Rápida - WRTmind Backend
 * 
 * Este script verifica a configuração e inicia o servidor
 * de forma mais amigável para desenvolvimento.
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

console.log('🚀 WRTmind Backend - Inicialização Rápida');
console.log('==========================================');

// Verificar se o arquivo de configuração existe
const configPath = path.join(__dirname, 'config.env');
if (!fs.existsSync(configPath)) {
  console.log('❌ Arquivo config.env não encontrado!');
  console.log('📝 Copiando arquivo de exemplo...');
  
  const examplePath = path.join(__dirname, 'config.example.env');
  if (fs.existsSync(examplePath)) {
    fs.copyFileSync(examplePath, configPath);
    console.log('✅ Arquivo config.env criado a partir do exemplo');
    console.log('⚠️  IMPORTANTE: Configure suas credenciais Firebase no arquivo config.env');
    console.log('📖 Veja o SETUP-GUIDE.md para instruções detalhadas');
  } else {
    console.log('❌ Arquivo config.example.env não encontrado!');
    process.exit(1);
  }
}

// Verificar se as dependências estão instaladas
const packagePath = path.join(__dirname, 'node_modules');
if (!fs.existsSync(packagePath)) {
  console.log('📦 Instalando dependências...');
  const install = spawn('npm', ['install'], { stdio: 'inherit' });
  
  install.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Dependências instaladas com sucesso');
      startServer();
    } else {
      console.log('❌ Erro ao instalar dependências');
      process.exit(1);
    }
  });
} else {
  startServer();
}

function startServer() {
  console.log('🚀 Iniciando servidor...');
  console.log('📡 Backend estará disponível em: http://localhost:5000');
  console.log('🌐 Frontend deve estar em: http://localhost:3000');
  console.log('📊 Firebase Console: https://console.firebase.google.com');
  console.log('');
  console.log('💡 Dicas:');
  console.log('   - Pressione Ctrl+C para parar o servidor');
  console.log('   - Verifique os logs para debug');
  console.log('   - Use SETUP-GUIDE.md para configuração completa');
  console.log('');
  
  const server = spawn('node', ['backend-zero.js'], { stdio: 'inherit' });
  
  server.on('close', (code) => {
    console.log(`\n🛑 Servidor finalizado com código: ${code}`);
  });
  
  // Capturar Ctrl+C
  process.on('SIGINT', () => {
    console.log('\n🛑 Parando servidor...');
    server.kill('SIGINT');
    process.exit(0);
  });
} 