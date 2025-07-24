# 🚨 RESUMO: SOLUÇÃO PARA ERROS NO VERCEL

## ❌ PROBLEMA ATUAL:
- **Backend retornando erro 500** no Vercel
- **Erros de CORS** no frontend
- **Falhas de rede** (`Failed to fetch`)

## 🔍 DIAGNÓSTICO:
O problema é que as **variáveis de ambiente do Firebase não estão configuradas** no Vercel, causando erro 500 no servidor.

## ✅ SOLUÇÃO RÁPIDA:

### **1. Configure as Variáveis no Vercel:**

Acesse: https://vercel.com/dashboard
- Projeto: `wrt-back`
- Settings > Environment Variables

### **2. Adicione estas variáveis:**

```
FIREBASE_PROJECT_ID = wrtmind

FIREBASE_PRIVATE_KEY = [SUA_CHAVE_PRIVADA_AQUI]

FIREBASE_CLIENT_EMAIL = firebase-adminsdk-fbsvc@wrtmind.iam.gserviceaccount.com

JWT_SECRET = [SUA_CHAVE_JWT_AQUI]

SESSION_SECRET = [SUA_CHAVE_SESSAO_AQUI]

ALLOWED_ORIGINS = http://localhost:3000,https://wrtmind.vercel.app,https://wrt-frontend.vercel.app

RATE_LIMIT_WINDOW_MS = 900000

RATE_LIMIT_MAX_REQUESTS = 100

LOG_LEVEL = info

LOG_FILE = logs/app.log
```

### **3. Redeploy:**
- Deployments > Redeploy
- Aguarde completar

### **4. Verificar:**
```bash
node verificar-status-vercel.js
```

## 🎯 RESULTADO ESPERADO:
- ✅ Backend funcionando (status 200)
- ✅ CORS configurado
- ✅ Frontend conectando sem erros

## 📞 SE PRECISAR DE AJUDA:
- Verifique os logs do Vercel
- Execute o script de verificação
- Consulte o arquivo `SOLUCAO-ERROS-VERCEL.md` para detalhes completos 