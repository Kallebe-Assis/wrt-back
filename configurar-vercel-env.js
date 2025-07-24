console.log('🔧 CONFIGURAÇÃO DAS VARIÁVEIS DE AMBIENTE NO VERCEL');
console.log('==================================================\n');

console.log('❌ PROBLEMA IDENTIFICADO:');
console.log('O backend no Vercel está retornando erro 500 porque as variáveis de ambiente do Firebase não estão configuradas.\n');

console.log('✅ SOLUÇÃO:');
console.log('Configure as seguintes variáveis no Vercel:\n');

const variaveis = {
  'FIREBASE_PROJECT_ID': 'wrtmind',
  'FIREBASE_PRIVATE_KEY': '-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCY6XsUpC8emqea\nqv/+QCafDlPdp96McB+432ydihx5pKMEh6/sOEFAS3KTPHxMdjL3vGj9uUE66OJr\ng3rvzQLmoKQI8zUYVibOA6gM0brSwUnmvimUZsLGDOXL4Eguip4zjS+Hbub0RyEj\n6z3MvBO5rplJ4F6Yfl981XB3Ko5OyB9sqdz2I8XycTDxR+SXjfUAZuJfz8nO+kPu\nYZc07FnWSoYgdv/4Ah4xyRPus93vFd5K0HIs8lp4hRFIK/nk++iPZlIi6zg9ZyCM\nsR+zBTiH/6fX6wfPv271jy4sVSDn1v3iyub56qsULp21yHBiMN2WdKzRlsFEwnOA\nlv0qtB6lAgMBAAECggEAFGyyCdaeYUjzaeI9EbHG7DLxOn0MPxemR77hgVor0IcQ\nVpq7LGMdOssjxuKVkG8ErXjnUJCt/leSEB3+o0jv12y4obtpVFKu7ztSIe2NC06n\nIjY0qUO1Ri1TL9F0Qsc1jMQ8h4C67QESk6YohJAmAFoqfnwvlns2zPQDiDSmeoOQ\nFapuh/GG78zjtQ+q5N4de2yE9wanVr94JQUPa3WpQjGUP/UqjeQLuGLtcG8vUBF4\nclcKiRsLo/uEkJEABMrE5hSoOpb0HIkE3P/WBH2lVQIXsKDpPAtLuUX9yAqrA2Lt\nn2dig4YuFZxOihnifByBw1fNATQrWE5BEVmdCTfz1wKBgQDJkdzN5luZsFii+jFk\nkQIRQkxlc9VOrtgBuPQreyPsHIO67hDvcK5zJRKENAi5xDf4woWwQBVezDNEVSvj\nm607kr0Q4/k90i2/UUh7pSoiitj/9d9Gc0pet+2IlouBj3mf3s8/fAMgDYO8Q9Vd\nbYKxHtyKMfRBfA3WrV3nf8/krwKBgQDCNAAoVRgbJANx3iGq+YcPF18qqnj4tVvP\nSx2oneBoT1s12tB6vgt/6VA8Wk4I48P5197+7LRyuJo2ic09CUr2A7KZYE7Du3Y+\nv2Hxggds7EJ9mBbD0ukaG9LVjLprLTOo4Y6uu4HBR8h+8rHsxwU83O3L3YF8WniS\no+BA4YZu6wKBgQCRrP0rQYSJ+kzU3IS97Z7U4llcKO7MQsiR1h2BHynDBoidnFhY\n89LgHLbZHNIBj7Hz8oGz81x+eo3CoNtrT6NPHqnNfzUuXKv7TL9ZvPBKrpZNxmBr\nBf+FnN/qiwKfzBVWWSzm8LVBgQLoGQ4my3Jcl7VDmv6wJPvLXtgy6shQuQKBgQCP\nY5++J95No9CbUZzgRa9QGDyfHxGE6TtpmhfC+RbJTdaVtAN8rTeGcTlZ5n95ltqL\nbbVr2k/96ImMvUB50ZO0g9Rp5K8jXBWZjOt/Sze6V9NcMmCUo/SS33pTTL4UBmL/\nTdNw9md+00aZXQ68OdKHNsSpYtqJe69M7ozUuu/skwKBgQCVRE8ZzHN7N2sZfhDT\noPiMMdirkw418Yt6b3xqu8U3XME8K2bapZaJRGTrS4mGaQq82juHzUYnVT8q68Md\nAsUd4+EFRjt7XiSq4joWYTwb0WdiDmEebr2qvCdSacQPs9JgDCDgSC4jRChGphu/\nql36l0guntKJPBpGzHWZQzx9iA==\n-----END PRIVATE KEY-----\n',
  'FIREBASE_CLIENT_EMAIL': 'firebase-adminsdk-fbsvc@wrtmind.iam.gserviceaccount.com',
  'JWT_SECRET': 'wrtmind-jwt-secret-2024-super-secure-key-change-this-in-production',
  'SESSION_SECRET': 'wrtmind-session-secret-2024-super-secure-key-change-this-in-production',
  'ALLOWED_ORIGINS': 'http://localhost:3000,https://wrtmind.vercel.app,https://wrt-frontend.vercel.app',
  'RATE_LIMIT_WINDOW_MS': '900000',
  'RATE_LIMIT_MAX_REQUESTS': '100',
  'LOG_LEVEL': 'info',
  'LOG_FILE': 'logs/app.log'
};

console.log('📋 VARIÁVEIS NECESSÁRIAS:\n');

Object.entries(variaveis).forEach(([chave, valor]) => {
  console.log(`${chave}:`);
  if (chave === 'FIREBASE_PRIVATE_KEY') {
    console.log(`   Valor: ${valor.substring(0, 50)}...${valor.substring(valor.length - 20)}`);
  } else {
    console.log(`   Valor: ${valor}`);
  }
  console.log('');
});

console.log('🚀 COMO CONFIGURAR NO VERCEL:');
console.log('1. Acesse: https://vercel.com/dashboard');
console.log('2. Selecione o projeto: wrt-back');
console.log('3. Vá para: Settings > Environment Variables');
console.log('4. Adicione cada variável acima (uma por uma)');
console.log('5. Clique em "Save" após cada uma');
console.log('6. Vá em: Deployments > Redeploy');
console.log('7. Aguarde o redeploy completar');

console.log('\n⚠️ IMPORTANTE:');
console.log('- A FIREBASE_PRIVATE_KEY deve ser copiada EXATAMENTE como está');
console.log('- Não adicione aspas extras ao redor dos valores');
console.log('- Após adicionar todas as variáveis, faça redeploy do projeto');

console.log('\n🔍 APÓS CONFIGURAR:');
console.log('Execute: node verificar-status-vercel.js');
console.log('Para verificar se o backend está funcionando corretamente'); 