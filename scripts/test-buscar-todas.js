const admin = require('firebase-admin');

// Configurar Firebase Admin
const serviceAccount = require('../../wrtmind-firebase-adminsdk-fbsvc-f96a42c84b.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

// Simular o método buscarTodasPorUsuario
async function buscarTodasPorUsuario(userId, filtros = {}) {
  try {
    console.log('🔥 Firebase - Iniciando busca de notas para usuário:', userId);
    console.log('🔍 Firebase - Filtros aplicados:', filtros);
    
    let query = db.collection('notas')
      .where('userId', '==', userId);

    // Aplicar filtro de ativo apenas se especificado
    if (filtros.ativo !== undefined) {
      query = query.where('ativo', '==', filtros.ativo);
      console.log('🔍 Firebase - Filtro ativo aplicado:', filtros.ativo);
    }

    // Aplicar filtros
    if (filtros.topico) {
      query = query.where('topico', '==', filtros.topico);
      console.log('🔍 Firebase - Filtro tópico aplicado:', filtros.topico);
    }
    if (filtros.favorito !== undefined) {
      query = query.where('favorito', '==', filtros.favorito);
      console.log('🔍 Firebase - Filtro favorito aplicado:', filtros.favorito);
    }
    if (filtros.fixado !== undefined) {
      query = query.where('fixado', '==', filtros.fixado);
      console.log('🔍 Firebase - Filtro fixado aplicado:', filtros.fixado);
    }

    console.log('🔥 Firebase - Executando query no Firestore...');
    const snapshot = await query.get();
    console.log('✅ Firebase - Query executada com sucesso');
    console.log('📊 Firebase - Total de documentos encontrados:', snapshot.size);
    
    const notas = [];
    snapshot.forEach(doc => {
      const nota = {
        id: doc.id,
        ...doc.data()
      };
      notas.push(nota);
      console.log('📝 Firebase - Nota encontrada:', { id: doc.id, titulo: nota.titulo });
    });

    console.log('📊 Firebase - Total de notas processadas:', notas.length);
    return notas;
  } catch (error) {
    console.error('❌ Firebase - Erro ao buscar notas do usuário:', error.message);
    console.error('❌ Firebase - Stack trace:', error.stack);
    throw error;
  }
}

async function testarBusca() {
  try {
    console.log('🧪 Testando busca de notas...');
    
    const userId = 'azphyIqxyYa9YKOGvNae';
    
    // Teste 1: Buscar todas as notas do usuário
    console.log('\n📋 Teste 1: Todas as notas do usuário');
    const todasNotas = await buscarTodasPorUsuario(userId);
    console.log(`✅ Encontradas ${todasNotas.length} notas`);
    
    // Teste 2: Buscar apenas favoritas
    console.log('\n❤️ Teste 2: Apenas favoritas');
    const favoritas = await buscarTodasPorUsuario(userId, { favorito: true });
    console.log(`✅ Encontradas ${favoritas.length} favoritas`);
    
    // Teste 3: Buscar apenas não favoritas
    console.log('\n💔 Teste 3: Apenas não favoritas');
    const naoFavoritas = await buscarTodasPorUsuario(userId, { favorito: false });
    console.log(`✅ Encontradas ${naoFavoritas.length} não favoritas`);
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  }
}

// Executar teste
testarBusca()
  .then(() => {
    console.log('✅ Teste concluído');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erro:', error);
    process.exit(1);
  }); 