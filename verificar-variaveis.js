require('dotenv').config();

console.log('🔍 Verificando variáveis de ambiente...\n');

const variaveis = [
  'FIREBASE_PROJECT_ID',
  'FIREBASE_PRIVATE_KEY',
  'FIREBASE_CLIENT_EMAIL',
  'JWT_SECRET',
  'SESSION_SECRET',
  'ALLOWED_ORIGINS',
  'NODE_ENV',
  'PORT'
];

console.log('📋 Status das variáveis de ambiente:\n');

let todasConfiguradas = true;

variaveis.forEach(variavel => {
  const valor = process.env[variavel];
  
  if (valor) {
    if (variavel === 'FIREBASE_PRIVATE_KEY') {
      // Mostrar apenas os primeiros e últimos caracteres da chave privada
      const inicio = valor.substring(0, 20);
      const fim = valor.substring(valor.length - 20);
      console.log(`✅ ${variavel}: ${inicio}...${fim} (${valor.length} caracteres)`);
    } else if (variavel === 'ALLOWED_ORIGINS') {
      console.log(`✅ ${variavel}: ${valor}`);
    } else {
      console.log(`✅ ${variavel}: ${valor}`);
    }
  } else {
    console.log(`❌ ${variavel}: Não definida`);
    todasConfiguradas = false;
  }
});

console.log('\n🎯 Análise:');
if (todasConfiguradas) {
  console.log('✅ Todas as variáveis estão configuradas!');
} else {
  console.log('❌ Algumas variáveis estão faltando!');
  console.log('\n🔧 Para configurar no Vercel:');
  console.log('1. Acesse: https://vercel.com/dashboard');
  console.log('2. Selecione o projeto: wrt-back');
  console.log('3. Vá para: Settings > Environment Variables');
  console.log('4. Adicione as variáveis que estão faltando');
  console.log('5. Faça redeploy do projeto');
}

console.log('\n📝 Variáveis necessárias para o Vercel:');
console.log('- FIREBASE_PROJECT_ID: ID do projeto Firebase');
console.log('- FIREBASE_PRIVATE_KEY: Chave privada do Firebase (formato JSON)');
console.log('- FIREBASE_CLIENT_EMAIL: Email do service account');
console.log('- JWT_SECRET: Chave secreta para JWT');
console.log('- SESSION_SECRET: Chave secreta para sessões');
console.log('- ALLOWED_ORIGINS: URLs permitidas para CORS'); 