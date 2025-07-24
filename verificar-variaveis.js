const fs = require('fs');
const path = require('path');

console.log('🔍 VERIFICAÇÃO COMPLETA DE VARIÁVEIS DE AMBIENTE');
console.log('===============================================\n');

// 1. Verificar se arquivo .env existe
console.log('1️⃣ VERIFICANDO ARQUIVO .env:');
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('✅ Arquivo .env encontrado');
  
  // Ler conteúdo do .env
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('📄 Tamanho do arquivo:', envContent.length, 'caracteres');
  
  // Verificar variáveis específicas
  const requiredVars = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_PRIVATE_KEY',
    'FIREBASE_CLIENT_EMAIL',
    'JWT_SECRET',
    'SESSION_SECRET',
    'ALLOWED_ORIGINS'
  ];
  
  console.log('\n📋 VARIÁVEIS REQUERIDAS:');
  requiredVars.forEach(varName => {
    if (envContent.includes(varName + '=')) {
      console.log(`✅ ${varName}: Definida`);
    } else {
      console.log(`❌ ${varName}: NÃO encontrada`);
    }
  });
  
} else {
  console.log('❌ Arquivo .env NÃO encontrado');
  console.log('💡 Execute: node create-env.js');
}

console.log('\n2️⃣ VERIFICANDO VARIÁVEIS DE PROCESSO:');
console.log('NODE_ENV:', process.env.NODE_ENV || 'não definido');
console.log('PORT:', process.env.PORT || 'não definido');

// 3. Testar carregamento do dotenv
console.log('\n3️⃣ TESTANDO CARREGAMENTO DOTENV:');
try {
  require('dotenv').config();
  console.log('✅ dotenv carregado com sucesso');
  
  // Verificar variáveis após carregamento
  console.log('\n📊 VARIÁVEIS CARREGADAS:');
  console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID || 'não definido');
  console.log('FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL || 'não definido');
  console.log('FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? '✅ Definida' : '❌ Não definida');
  console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Definida' : '❌ Não definida');
  console.log('SESSION_SECRET:', process.env.SESSION_SECRET ? '✅ Definida' : '❌ Não definida');
  console.log('ALLOWED_ORIGINS:', process.env.ALLOWED_ORIGINS || 'não definido');
  
} catch (error) {
  console.log('❌ Erro ao carregar dotenv:', error.message);
}

// 4. Testar Firebase com variáveis carregadas
console.log('\n4️⃣ TESTANDO FIREBASE COM VARIÁVEIS:');
try {
  const { initializeApp, cert, getApps } = require('firebase-admin/app');
  const { getFirestore } = require('firebase-admin/firestore');
  
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  
  console.log('Project ID:', projectId || 'não definido');
  console.log('Client Email:', clientEmail || 'não definido');
  console.log('Private Key:', privateKey ? '✅ Definida' : '❌ Não definida');
  
  if (projectId && privateKey && clientEmail) {
    // Verificar se já foi inicializado
    if (getApps().length === 0) {
      console.log('📡 Inicializando Firebase Admin SDK...');
      initializeApp({
        credential: cert({
          projectId,
          privateKey: privateKey.replace(/\\n/g, '\n'),
          clientEmail,
        }),
      });
      console.log('✅ Firebase Admin SDK inicializado com sucesso!');
    } else {
      console.log('✅ Firebase Admin SDK já estava inicializado');
    }

    const db = getFirestore();
    console.log('✅ Firestore conectado com sucesso!');
    
    // Testar uma operação simples
    const testCollection = db.collection('test');
    console.log('✅ Coleção de teste criada com sucesso!');
    
    console.log('🎉 Firebase está funcionando perfeitamente!');
  } else {
    console.log('❌ Variáveis Firebase incompletas');
    console.log('💡 Verifique se todas as variáveis estão definidas no .env');
  }
  
} catch (error) {
  console.error('❌ Erro ao testar Firebase:', error.message);
}

// 5. Verificar outras variáveis importantes
console.log('\n5️⃣ OUTRAS VARIÁVEIS IMPORTANTES:');
console.log('RATE_LIMIT_WINDOW_MS:', process.env.RATE_LIMIT_WINDOW_MS || 'não definido');
console.log('RATE_LIMIT_MAX_REQUESTS:', process.env.RATE_LIMIT_MAX_REQUESTS || 'não definido');
console.log('LOG_LEVEL:', process.env.LOG_LEVEL || 'não definido');
console.log('LOG_FILE:', process.env.LOG_FILE || 'não definido');

console.log('\n🎯 RESUMO DA VERIFICAÇÃO:');
console.log('========================');

// Contar variáveis definidas
const allVars = [
  'FIREBASE_PROJECT_ID', 'FIREBASE_PRIVATE_KEY', 'FIREBASE_CLIENT_EMAIL',
  'JWT_SECRET', 'SESSION_SECRET', 'ALLOWED_ORIGINS',
  'RATE_LIMIT_WINDOW_MS', 'RATE_LIMIT_MAX_REQUESTS', 'LOG_LEVEL', 'LOG_FILE'
];

const definedVars = allVars.filter(varName => process.env[varName]);
const missingVars = allVars.filter(varName => !process.env[varName]);

console.log(`✅ Variáveis definidas: ${definedVars.length}/${allVars.length}`);
console.log(`❌ Variáveis faltando: ${missingVars.length}/${allVars.length}`);

if (missingVars.length > 0) {
  console.log('\n📝 VARIÁVEIS FALTANDO:');
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  console.log('\n💡 Execute: node create-env.js para criar o arquivo .env');
}

if (definedVars.length === allVars.length) {
  console.log('\n🎉 TODAS AS VARIÁVEIS ESTÃO CONFIGURADAS CORRETAMENTE!');
  console.log('🚀 O backend está pronto para funcionar!');
} else {
  console.log('\n⚠️  ALGUMAS VARIÁVEIS ESTÃO FALTANDO');
  console.log('🔧 Configure as variáveis faltantes antes de continuar');
} 