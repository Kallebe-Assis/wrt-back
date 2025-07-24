const admin = require('firebase-admin');

// Configurar Firebase Admin
const serviceAccount = require('../../wrtmind-firebase-adminsdk-fbsvc-f96a42c84b.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

// Simular exatamente o que a rota faz
async function testarRotaFavoritas() {
  try {
    console.log('🧪 Testando rota /favoritas...');
    
    const userId = 'azphyIqxyYa9YKOGvNae';
    
    // Simular o método buscarFavoritas
    console.log('🔍 Chamando buscarFavoritas...');
    const notas = await buscarFavoritas(userId);
    
    console.log('✅ Resultado:', notas);
    console.log('📊 Total de favoritas:', notas.length);
    
    // Simular a resposta da API
    const response = { notas };
    console.log('📦 Resposta da API:', JSON.stringify(response, null, 2));
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

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

testarRotaFavoritas()
  .then(() => {
    console.log('✅ Teste concluído');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erro:', error);
    process.exit(1);
  }); 