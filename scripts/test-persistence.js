const LinkPersistent = require('../models/LinkPersistent');

async function testPersistence() {
  try {
    console.log('🧪 Testando persistência de dados...\n');
    
    // Criar instância do modelo
    const linkModel = new LinkPersistent(true); // Carregar dados automaticamente para o teste
    
    // 1. Verificar dados iniciais
    console.log('1️⃣ Verificando dados iniciais...');
    const linksIniciais = await linkModel.buscarTodos();
    console.log(`   📊 ${linksIniciais.length} links encontrados`);
    linksIniciais.forEach(link => {
      console.log(`   - ${link.nome} (posição: ${link.posicao})`);
    });
    
    // 2. Criar um novo link
    console.log('\n2️⃣ Criando novo link de teste...');
    const novoLink = await linkModel.criar({
      nome: 'Teste Persistência',
      urlIcone: 'https://example.com/favicon.ico',
      urlDestino: 'https://example.com',
      posicao: 10
    });
    console.log(`   ✅ Link criado: ${novoLink.nome} (ID: ${novoLink.id})`);
    
    // 3. Verificar se o link foi salvo
    console.log('\n3️⃣ Verificando se o link foi salvo...');
    const linksAposCriar = await linkModel.buscarTodos();
    console.log(`   📊 ${linksAposCriar.length} links encontrados`);
    
    // 4. Atualizar o link
    console.log('\n4️⃣ Atualizando o link...');
    const linkAtualizado = await linkModel.atualizar(novoLink.id, {
      nome: 'Teste Persistência - Atualizado',
      urlIcone: 'https://example.com/favicon.ico',
      urlDestino: 'https://example.com/updated',
      posicao: 15
    });
    console.log(`   ✅ Link atualizado: ${linkAtualizado.nome}`);
    
    // 5. Reordenar links
    console.log('\n5️⃣ Testando reordenação...');
    const linksParaReordenar = linksAposCriar.map(link => ({
      id: link.id,
      posicao: link.posicao + 100
    }));
    await linkModel.atualizarPosicoes(linksParaReordenar);
    console.log('   ✅ Links reordenados');
    
    // 6. Verificar dados finais
    console.log('\n6️⃣ Verificando dados finais...');
    const linksFinais = await linkModel.buscarTodos();
    console.log(`   📊 ${linksFinais.length} links encontrados`);
    linksFinais.forEach(link => {
      console.log(`   - ${link.nome} (posição: ${link.posicao})`);
    });
    
    // 7. Criar backup
    console.log('\n7️⃣ Criando backup...');
    const backupFile = await linkModel.backup();
    console.log(`   ✅ Backup criado: ${backupFile}`);
    
    console.log('\n🎉 Teste de persistência concluído com sucesso!');
    console.log('\n📋 Próximos passos:');
    console.log('1. Reinicie o servidor: npm run dev');
    console.log('2. Verifique se os dados persistiram');
    console.log('3. Teste no frontend para confirmar');
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
    process.exit(1);
  }
}

// Executar teste se chamado diretamente
if (require.main === module) {
  testPersistence();
}

module.exports = testPersistence; 