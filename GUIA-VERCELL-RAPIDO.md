# 🚀 GUIA RÁPIDO - Configurar Vercel

## ❌ Problema Atual
- Firebase: "not_configured" no Vercel
- Faltam variáveis: `FIREBASE_PRIVATE_KEY` e `FIREBASE_CLIENT_EMAIL`

## ✅ Solução

### 1️⃣ Acesse o Vercel
```
https://vercel.com/dashboard
```

### 2️⃣ Selecione o Projeto
- Projeto: `wrt-back`

### 3️⃣ Vá para Environment Variables
- Settings > Environment Variables

### 4️⃣ Adicione as Variáveis

#### 🔥 FIREBASE_PROJECT_ID
```
wrtmind
```

#### 🔑 FIREBASE_PRIVATE_KEY
```
[SUA_CHAVE_PRIVADA_AQUI]
```

#### 📧 FIREBASE_CLIENT_EMAIL
```
firebase-adminsdk-fbsvc@wrtmind.iam.gserviceaccount.com
```

#### 🔐 JWT_SECRET
```
[SUA_CHAVE_JWT_AQUI]
```

#### 🛡️ SESSION_SECRET
```
[SUA_CHAVE_SESSAO_AQUI]
```

#### 🌐 ALLOWED_ORIGINS
```
http://localhost:3000,https://wrtmind.vercel.app,https://wrt-frontend.vercel.app
```

### 5️⃣ Salve e Faça Redeploy
- Clique "Save" após cada variável
- Vá em: Deployments > Redeploy
- Aguarde 2-5 minutos

### 6️⃣ Teste
```
https://wrt-back.vercel.app/api/status
```

**Resultado esperado:**
```json
{
  "firebase": "configured",
  "status": "ok"
}
```

## ⚠️ Importante
- Copie exatamente como está
- Não adicione espaços extras
- A chave privada já está formatada corretamente

## 🎯 Resultado Final
- ✅ Firebase: "configured"
- ✅ API funcionando
- ✅ Conexão com banco estabelecida 