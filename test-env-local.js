require('dotenv').config();

console.log('🔍 Testando variáveis de ambiente LOCAIS:');
console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID);
console.log('FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL);
console.log('FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? '✅ Definido' : '❌ Não definido');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Definido' : '❌ Não definido');
console.log('SESSION_SECRET:', process.env.SESSION_SECRET ? '✅ Definido' : '❌ Não definido');

// Testar configuração do Firebase
const { connectToFirebase } = require('./src/config/database.js');
const firebaseDB = connectToFirebase();

if (firebaseDB) {
  console.log('✅ Firebase conectado com sucesso!');
} else {
  console.log('❌ Firebase não conseguiu conectar');
} 