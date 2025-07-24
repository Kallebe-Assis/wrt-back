const admin = require('firebase-admin');
const path = require('path');

// Configurar Firebase Admin
const serviceAccount = require('../../wrtmind-firebase-adminsdk-fbsvc-f96a42c84b.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function adicionarCampoFavorito() {
  try {
    console.log('🔥 Iniciando migração para adicionar campo favorito...');
    
    // Buscar todas as notas
    const snapshot = await db.collection('notas').get();
    
    if (snapshot.empty) {
      console.log('📝 Nenhuma nota encontrada no banco');
      return;
    }
    
    console.log(`📊 Encontradas ${snapshot.size} notas para processar`);
    
    let processadas = 0;
    let atualizadas = 0;
    let comFavorito = 0;
    
    // Processar cada nota
    for (const doc of snapshot.docs) {
      const nota = doc.data();
      processadas++;
      
      console.log(`📝 Processando nota ${processadas}/${snapshot.size}: ${nota.titulo || 'Sem título'}`);
      
      // Verificar se já tem o campo favorito
      if (nota.favorito !== undefined) {
        console.log(`   ✅ Já possui campo favorito: ${nota.favorito}`);
        comFavorito++;
        continue;
      }
      
      // Adicionar campo favorito como false por padrão
      await doc.ref.update({
        favorito: false,
        dataAtualizacao: new Date().toISOString()
      });
      
      console.log(`   ➕ Campo favorito adicionado como false`);
      atualizadas++;
    }
    
    console.log('\n📊 Resumo da migração:');
    console.log(`   📝 Total de notas processadas: ${processadas}`);
    console.log(`   ✅ Notas que já tinham campo favorito: ${comFavorito}`);
    console.log(`   ➕ Notas atualizadas com campo favorito: ${atualizadas}`);
    console.log('🎉 Migração concluída com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    throw error;
  }
}

// Executar a migração
adicionarCampoFavorito()
  .then(() => {
    console.log('✅ Script executado com sucesso');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erro ao executar script:', error);
    process.exit(1);
  }); 