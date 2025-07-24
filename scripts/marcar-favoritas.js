const admin = require('firebase-admin');

// Configurar Firebase Admin
const serviceAccount = require('../../wrtmind-firebase-adminsdk-fbsvc-f96a42c84b.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function marcarFavoritas() {
  try {
    console.log('🔥 Marcando algumas notas como favoritas...');
    
    // Buscar todas as notas
    const snapshot = await db.collection('notas').get();
    
    if (snapshot.empty) {
      console.log('📝 Nenhuma nota encontrada');
      return;
    }
    
    console.log(`📊 Encontradas ${snapshot.size} notas`);
    
    let marcadas = 0;
    
    // Marcar a primeira nota como favorita
    const docs = snapshot.docs;
    if (docs.length > 0) {
      const primeiraNota = docs[0];
      const nota = primeiraNota.data();
      
      console.log(`📝 Marcando como favorita: ${nota.titulo || 'Sem título'}`);
      console.log(`👤 UserId da nota: ${nota.userId}`);
      
      await primeiraNota.ref.update({
        favorito: true,
        dataAtualizacao: new Date().toISOString()
      });
      
      marcadas++;
      console.log(`✅ Nota marcada como favorita`);
    }
    
    // Marcar a segunda nota como favorita (se existir)
    if (docs.length > 1) {
      const segundaNota = docs[1];
      const nota = segundaNota.data();
      
      console.log(`📝 Marcando como favorita: ${nota.titulo || 'Sem título'}`);
      console.log(`👤 UserId da nota: ${nota.userId}`);
      
      await segundaNota.ref.update({
        favorito: true,
        dataAtualizacao: new Date().toISOString()
      });
      
      marcadas++;
      console.log(`✅ Nota marcada como favorita`);
    }
    
    console.log(`\n📊 Resumo:`);
    console.log(`   ➕ Notas marcadas como favoritas: ${marcadas}`);
    
    // Verificar o resultado
    console.log('\n🔍 Verificando resultado...');
    const favoritas = await db.collection('notas')
      .where('favorito', '==', true)
      .get();
    
    console.log(`📊 Total de favoritas: ${favoritas.size}`);
    favoritas.forEach(doc => {
      const nota = doc.data();
      console.log(`❤️ Favorita: ${nota.titulo || 'Sem título'} - UserId: ${nota.userId}`);
    });
    
  } catch (error) {
    console.error('❌ Erro:', error);
    throw error;
  }
}

// Executar
marcarFavoritas()
  .then(() => {
    console.log('✅ Script concluído');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erro no script:', error);
    process.exit(1);
  }); 