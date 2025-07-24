const admin = require('firebase-admin');

// Configurar Firebase Admin
const serviceAccount = require('../../wrtmind-firebase-adminsdk-fbsvc-f96a42c84b.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

// Simular o método buscarFavoritas
async function buscarFavoritas(userId) {
  try {
    console.log('🔍 buscandoFavoritas para userId:', userId);
    
    // Buscar todas as notas do usuário com favorito = true
    const snapshot = await db.collection('notas')
      .where('userId', '==', userId)
      .where('favorito', '==', true)
      .get();
    
    console.log('📊 Documentos encontrados:', snapshot.size);
    
    const notas = [];
    snapshot.forEach(doc => {
      const nota = {
        id: doc.id,
        ...doc.data()
      };
      notas.push(nota);
      console.log('📝 Nota favorita:', nota.titulo);
    });
    
    return notas;
  } catch (error) {
    console.error('❌ Erro em buscarFavoritas:', error);
    throw error;
  }
}

async function testar() {
  try {
    console.log('🧪 Testando buscarFavoritas...');
    
    const userId = 'azphyIqxyYa9YKOGvNae';
    const favoritas = await buscarFavoritas(userId);
    
    console.log('✅ Resultado final:', favoritas);
    console.log('📊 Total de favoritas:', favoritas.length);
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  }
}

testar()
  .then(() => {
    console.log('✅ Teste concluído');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erro:', error);
    process.exit(1);
  }); 