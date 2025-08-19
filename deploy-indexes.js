const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Deployando índices do Firestore...\n');

try {
  // Verificar se o firebase CLI está instalado
  try {
    execSync('firebase --version', { stdio: 'pipe' });
  } catch (error) {
    console.error('❌ Firebase CLI não está instalado. Instale com: npm install -g firebase-tools');
    process.exit(1);
  }

  // Verificar se está logado no Firebase
  try {
    execSync('firebase projects:list', { stdio: 'pipe' });
  } catch (error) {
    console.error('❌ Não está logado no Firebase. Execute: firebase login');
    process.exit(1);
  }

  // Fazer deploy dos índices
  console.log('📊 Criando índices compostos...');
  execSync('firebase deploy --only firestore:indexes', { 
    stdio: 'inherit',
    cwd: __dirname 
  });

  console.log('\n✅ Índices deployados com sucesso!');
  console.log('⏳ Aguarde alguns minutos para os índices ficarem ativos...');

} catch (error) {
  console.error('❌ Erro ao fazer deploy dos índices:', error.message);
  process.exit(1);
}
