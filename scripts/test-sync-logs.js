const { addSyncLog, getSyncLogs, clearSyncLogs, manualSync } = require('../services/syncLinks');

async function testSyncLogs() {
  try {
    console.log('🧪 Testando sistema de logs de sincronização...\n');

    // Limpar logs existentes
    console.log('1️⃣ Limpando logs existentes...');
    clearSyncLogs();
    
    // Adicionar alguns logs de teste
    console.log('2️⃣ Adicionando logs de teste...');
    addSyncLog('info', 'Sistema de sincronização iniciado');
    addSyncLog('success', 'Firebase → Local: 2 criados, 1 atualizado', {
      criados: 2,
      atualizados: 1,
      totalFirebase: 5,
      totalLocal: 3
    });
    addSyncLog('success', 'Local → Firebase: 1 criado, 0 atualizados', {
      criados: 1,
      atualizados: 0,
      totalLocal: 4,
      totalFirebase: 5
    });
    addSyncLog('error', 'Erro na conexão com Firebase', {
      error: 'Connection timeout',
      stack: 'Error: Connection timeout\n    at Firebase.connect'
    });
    addSyncLog('info', 'Sincronização periódica ativada a cada 60 segundos');

    // Buscar logs
    console.log('3️⃣ Buscando logs...');
    const logs = getSyncLogs();
    console.log(`✅ ${logs.length} logs encontrados:`);
    
    logs.forEach((log, index) => {
      console.log(`   ${index + 1}. [${log.type.toUpperCase()}] ${log.message}`);
      if (log.details && Object.keys(log.details).length > 0) {
        console.log(`      Detalhes: ${JSON.stringify(log.details)}`);
      }
    });

    // Testar sincronização manual
    console.log('\n4️⃣ Testando sincronização manual...');
    await manualSync();

    // Verificar logs após sincronização
    console.log('\n5️⃣ Verificando logs após sincronização...');
    const logsAfterSync = getSyncLogs();
    console.log(`✅ ${logsAfterSync.length} logs após sincronização`);

    console.log('\n🎉 Teste de logs de sincronização concluído com sucesso!');
    console.log('\n📋 Próximos passos:');
    console.log('1. Reinicie o servidor: npm run dev');
    console.log('2. Acesse a tela de Configurações');
    console.log('3. Vá para a aba "Sincronização"');
    console.log('4. Clique em "Ver Logs de Sincronização"');
    console.log('5. Verifique se os logs aparecem no modal');

  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  testSyncLogs();
}

module.exports = testSyncLogs; 