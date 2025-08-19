const fetch = require('node-fetch');

async function testFavoritar() {
  console.log('🧪 Testando funcionalidade de favoritar...\n');

  const userId = 'test-user-123';
  const baseUrl = 'https://wrt-back.vercel.app/api';

  try {
    // 1. Criar uma nota para testar
    console.log('📝 1. Criando nota para teste...');
    const createResponse = await fetch(`${baseUrl}/notas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'user-id': userId
      },
      body: JSON.stringify({
        titulo: 'Nota para Teste de Favoritar',
        conteudo: 'Conteúdo de teste',
        userId: userId
      })
    });

    if (!createResponse.ok) {
      throw new Error(`Erro ao criar nota: ${createResponse.status}`);
    }

    const createData = await createResponse.json();
    const notaId = createData.nota.id;
    console.log(`✅ Nota criada com ID: ${notaId}`);

    // 2. Testar favoritar a nota
    console.log('\n⭐ 2. Testando favoritar nota...');
    const favoritarResponse = await fetch(`${baseUrl}/notas/${notaId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'user-id': userId
      },
      body: JSON.stringify({ favorita: true })
    });

    console.log(`📊 Status: ${favoritarResponse.status}`);
    
    if (!favoritarResponse.ok) {
      const errorText = await favoritarResponse.text();
      console.error(`❌ Erro ao favoritar: ${errorText}`);
      return;
    }

    const favoritarData = await favoritarResponse.json();
    console.log('📄 Resposta:', JSON.stringify(favoritarData, null, 2));

    // 3. Testar desfavoritar a nota
    console.log('\n⭐ 3. Testando desfavoritar nota...');
    const desfavoritarResponse = await fetch(`${baseUrl}/notas/${notaId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'user-id': userId
      },
      body: JSON.stringify({ favorita: false })
    });

    console.log(`📊 Status: ${desfavoritarResponse.status}`);
    
    if (!desfavoritarResponse.ok) {
      const errorText = await desfavoritarResponse.text();
      console.error(`❌ Erro ao desfavoritar: ${errorText}`);
      return;
    }

    const desfavoritarData = await desfavoritarResponse.json();
    console.log('📄 Resposta:', JSON.stringify(desfavoritarData, null, 2));

    // 4. Verificar se a nota foi atualizada
    console.log('\n🔍 4. Verificando estado da nota...');
    const getResponse = await fetch(`${baseUrl}/notas?userId=${userId}`);
    
    if (getResponse.ok) {
      const getData = await getResponse.json();
      const nota = getData.notas.find(n => n.id === notaId);
      if (nota) {
        console.log(`📊 Nota favorita: ${nota.favorita}`);
      }
    }

    // 5. Limpar - deletar a nota de teste
    console.log('\n🧹 5. Limpando nota de teste...');
    await fetch(`${baseUrl}/notas/${notaId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'user-id': userId
      }
    });

    console.log('\n✅ Teste de favoritar concluído com sucesso!');

  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

testFavoritar();
