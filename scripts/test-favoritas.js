const admin = require('firebase-admin');

// Configurar Firebase Admin
const serviceAccount = require('../../wrtmind-firebase-adminsdk-fbsvc-f96a42c84b.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function testarFavoritas() {
  try {
    console.log('🔥 Testando busca de notas favoritas...');
    
    // Primeiro, vamos ver todas as notas
    const todasNotas = await db.collection('notas').get();
    console.log(`📊 Total de notas no banco: ${todasNotas.size}`);
    
    todasNotas.forEach(doc => {
      const nota = doc.data();
      console.log(`📝 Nota: ${nota.titulo || 'Sem título'} - Favorito: ${nota.favorito} - UserId: ${nota.userId}`);
    });
    
    // Agora vamos testar a query de favoritas
    console.log('\n🔍 Testando query de favoritas...');
    
    // Buscar todas as notas com favorito = true
    const favoritasQuery = await db.collection('notas')
      .where('favorito', '==', true)
      .get();
    
    console.log(`📊 Notas favoritas encontradas: ${favoritasQuery.size}`);
    
    favoritasQuery.forEach(doc => {
      const nota = doc.data();
      console.log(`❤️ Favorita: ${nota.titulo || 'Sem título'} - UserId: ${nota.userId}`);
    });
    
    // Testar com um userId específico
    console.log('\n👤 Testando com userId específico...');
    const userId = 'test-user'; // ou um userId real que você tenha
    
    const favoritasPorUsuario = await db.collection('notas')
      .where('userId', '==', userId)
      .where('favorito', '==', true)
      .get();
    
    console.log(`📊 Favoritas do usuário ${userId}: ${favoritasPorUsuario.size}`);
    
    favoritasPorUsuario.forEach(doc => {
      const nota = doc.data();
      console.log(`❤️ Favorita do usuário: ${nota.titulo || 'Sem título'}`);
    });
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
    throw error;
  }
}

// Executar o teste
testarFavoritas()
  .then(() => {
    console.log('✅ Teste concluído');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erro no teste:', error);
    process.exit(1);
  }); 