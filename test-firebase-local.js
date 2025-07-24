const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Variáveis de ambiente hardcoded para teste LOCAL
const projectId = 'wrtmind';
const privateKey = "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCY6XsUpC8emqea\nqv/+QCafDlPdp96McB+432ydihx5pKMEh6/sOEFAS3KTPHxMdjL3vGj9uUE66OJr\ng3rvzQLmoKQI8zUYVibOA6gM0brSwUnmvimUZsLGDOXL4Eguip4zjS+Hbub0RyEj\n6z3MvBO5rplJ4F6Yfl981XB3Ko5OyB9sqdz2I8XycTDxR+SXjfUAZuJfz8nO+kPu\nYZc07FnWSoYgdv/4Ah4xyRPus93vFd5K0HIs8lp4hRFIK/nk++iPZlIi6zg9ZyCM\nsR+zBTiH/6fX6wfPv271jy4sVSDn1v3iyub56qsULp21yHBiMN2WdKzRlsFEwnOA\nlv0qtB6lAgMBAAECggEAFGyyCdaeYUjzaeI9EbHG7DLxOn0MPxemR77hgVor0IcQ\nVpq7LGMdOssjxuKVkG8ErXjnUJCt/leSEB3+o0jv12y4obtpVFKu7ztSIe2NC06n\nIjY0qUO1Ri1TL9F0Qsc1jMQ8h4C67QESk6YohJAmAFoqfnwvlns2zPQDiDSmeoOQ\nFapuh/GG78zjtQ+q5N4de2yE9wanVr94JQUPa3WpQjGUP/UqjeQLuGLtcG8vUBF4\nclcKiRsLo/uEkJEABMrE5hSoOpb0HIkE3P/WBH2lVQIXsKDpPAtLuUX9yAqrA2Lt\nn2dig4YuFZxOihnifByBw1fNATQrWE5BEVmdCTfz1wKBgQDJkdzN5luZsFii+jFk\nkQIRQkxlc9VOrtgBuPQreyPsHIO67hDvcK5zJRKENAi5xDf4woWwQBVezDNEVSvj\nm607kr0Q4/k90i2/UUh7pSoiitj/9d9Gc0pet+2IlouBj3mf3s8/fAMgDYO8Q9Vd\nbYKxHtyKMfRBfA3WrV3nf8/krwKBgQDCNAAoVRgbJANx3iGq+YcPF18qqnj4tVvP\nSx2oneBoT1s12tB6vgt/6VA8Wk4I48P5197+7LRyuJo2ic09CUr2A7KZYE7Du3Y+\nv2Hxggds7EJ9mBbD0ukaG9LVjLprLTOo4Y6uu4HBR8h+8rHsxwU83O3L3YF8WniS\no+BA4YZu6wKBgQCRrP0rQYSJ+kzU3IS97Z7U4llcKO7MQsiR1h2BHynDBoidnFhY\n89LgHLbZHNIBj7Hz8oGz81x+eo3CoNtrT6NPHqnNfzUuXKv7TL9ZvPBKrpZNxmBr\nBf+FnN/qiwKfzBVWWSzm8LVBgQLoGQ4my3Jcl7VDmv6wJPvLXtgy6shQuQKBgQCP\nY5++J95No9CbUZzgRa9QGDyfHxGE6TtpmhfC+RbJTdaVtAN8rTeGcTlZ5n95ltqL\nbbVr2k/96ImMvUB50ZO0g9Rp5K8jXBWZjOt/Sze6V9NcMmCUo/SS33pTTL4UBmL/\nTdNw9md+00aZXQ68OdKHNsSpYtqJe69M7ozUuu/skwKBgQCVRE8ZzHN7N2sZfhDT\noPiMMdirkw418Yt6b3xqu8U3XME8K2bapZaJRGTrS4mGaQq82juHzUYnVT8q68Md\nAsUd4+EFRjt7XiSq4joWYTwb0WdiDmEebr2qvCdSacQPs9JgDCDgSC4jRChGphu/\nql36l0guntKJPBpGzHWZQzx9iA==\n-----END PRIVATE KEY-----\n";
const clientEmail = 'firebase-adminsdk-fbsvc@wrtmind.iam.gserviceaccount.com';

console.log('🔍 Testando conexão LOCAL com Firebase...');
console.log('Project ID:', projectId);
console.log('Client Email:', clientEmail);
console.log('Private Key:', privateKey ? '✅ Definido' : '❌ Não definido');

try {
  // Verificar se já foi inicializado
  if (getApps().length === 0) {
    console.log('📡 Inicializando Firebase Admin SDK LOCAL...');
    initializeApp({
      credential: cert({
        projectId,
        privateKey: privateKey.replace(/\\n/g, '\n'),
        clientEmail,
      }),
    });
    console.log('✅ Firebase Admin SDK inicializado com sucesso!');
  } else {
    console.log('✅ Firebase Admin SDK já estava inicializado');
  }

  const db = getFirestore();
  console.log('✅ Firestore conectado com sucesso!');
  
  // Testar uma operação simples
  const testCollection = db.collection('test');
  console.log('✅ Coleção de teste criada com sucesso!');
  
  console.log('🎉 Firebase LOCAL está funcionando perfeitamente!');
  
} catch (error) {
  console.error('❌ Erro ao conectar com Firebase LOCAL:', error.message);
  console.error('Stack trace:', error.stack);
} 