# Correção do Erro Firebase no Vercel

## ❌ Problema Identificado

```
❌ Erro ao inicializar Firebase Admin SDK: Cannot find module '/var/task/wrtmin-service-account.json'
```

## ✅ Soluções Implementadas

### 1. Configuração Centralizada do Firebase
Criado arquivo `api/firebase-config.js`:
```javascript
const admin = require('firebase-admin');
const path = require('path');

if (!admin.apps.length) {
  try {
    const serviceAccount = require(path.join(process.cwd(), 'wrtmin-service-account.json'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('✅ Firebase inicializado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao inicializar Firebase:', error.message);
    throw error;
  }
}

const db = admin.firestore();
module.exports = { admin, db };
```

### 2. Correção dos Caminhos
- ❌ **Antes**: `require('../../wrtmin-service-account.json')`
- ✅ **Depois**: `require(path.join(process.cwd(), 'wrtmin-service-account.json'))`

### 3. Arquivos Atualizados
- ✅ `api/auth/login.js` - Usa configuração centralizada
- ✅ `api/notas.js` - Usa configuração centralizada
- ✅ `api/test-firebase.js` - Novo endpoint para testar Firebase

## 🚀 Como Fazer o Deploy

### 1. Instalar Vercel CLI
```bash
npm install -g vercel
```

### 2. Fazer Deploy
```bash
vercel --prod
```

### 3. Verificar Deploy
Testar os endpoints:
- `https://wrt-back.vercel.app/api/test` - Teste básico
- `https://wrt-back.vercel.app/api/test-firebase` - Teste Firebase
- `https://wrt-back.vercel.app/api/auth/login` - Login

## 📁 Estrutura Final

```
WRT-Back-Clean/
├── api/
│   ├── firebase-config.js    # ✅ Configuração centralizada
│   ├── test.js              # ✅ Teste básico
│   ├── test-firebase.js     # ✅ Teste Firebase
│   ├── auth/
│   │   └── login.js         # ✅ Login corrigido
│   └── notas.js             # ✅ Notas corrigido
├── wrtmin-service-account.json  # ✅ Credenciais na raiz
└── vercel.json              # ✅ Config Vercel
```

## ✅ Verificações

- ✅ Arquivo `wrtmin-service-account.json` na raiz
- ✅ Caminhos corrigidos com `process.cwd()`
- ✅ Configuração centralizada do Firebase
- ✅ CORS configurado em todos os endpoints
- ✅ Tratamento de erros melhorado

## 🎯 Resultado Esperado

Após o deploy, o Firebase deve funcionar corretamente no Vercel sem erros de caminho. 