require('dotenv').config();

console.log('🔍 Testando variáveis de ambiente:');
console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? '✅ Definido' : '❌ Não definido');
console.log('FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? '✅ Definido' : '❌ Não definido');
console.log('FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL ? '✅ Definido' : '❌ Não definido');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Definido' : '❌ Não definido');
console.log('SESSION_SECRET:', process.env.SESSION_SECRET ? '✅ Definido' : '❌ Não definido');
console.log('ALLOWED_ORIGINS:', process.env.ALLOWED_ORIGINS ? '✅ Definido' : '❌ Não definido');

// Testar configuração do Firebase
const { connectToFirebase } = require('./src/config/database');
const firebaseDB = connectToFirebase();

if (firebaseDB) {
  console.log('✅ Firebase conectado com sucesso!');
} else {
  console.log('❌ Firebase não conseguiu conectar');
} 