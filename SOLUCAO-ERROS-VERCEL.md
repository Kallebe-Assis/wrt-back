# 🔧 SOLUÇÃO PARA ERROS NO VERCEL

## ❌ PROBLEMAS IDENTIFICADOS:

### 1. **Erro 500 no Backend**
- Status: `500 Internal Server Error`
- Mensagem: `A server error has occurred`
- Causa: Variáveis de ambiente do Firebase não configuradas

### 2. **Erro CORS**
- Status: Headers CORS ausentes
- Causa: Servidor não está respondendo corretamente devido ao erro 500

### 3. **Erro de Rede no Frontend**
- Status: `Failed to fetch`
- Causa: Backend não está funcionando

## ✅ SOLUÇÃO COMPLETA:

### **PASSO 1: Configurar Variáveis de Ambiente no Vercel**

1. **Acesse o Vercel Dashboard:**
   - URL: https://vercel.com/dashboard
   - Selecione o projeto: `wrt-back`

2. **Vá para Environment Variables:**
   - Settings > Environment Variables

3. **Adicione as seguintes variáveis:**

#### **FIREBASE_PROJECT_ID**
```
wrtmind
```

#### **FIREBASE_PRIVATE_KEY**
```
-----BEGIN PRIVATE KEY-----
MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCY6XsUpC8emqea
qv/+QCafDlPdp96McB+432ydihx5pKMEh6/sOEFAS3KTPHxMdjL3vGj9uUE66OJr
g3rvzQLmoKQI8zUYVibOA6gM0brSwUnmvimUZsLGDOXL4Eguip4zjS+Hbub0RyEj
6z3MvBO5rplJ4F6Yfl981XB3Ko5OyB9sqdz2I8XycTDxR+SXjfUAZuJfz8nO+kPu
YZc07FnWSoYgdv/4Ah4xyRPus93vFd5K0HIs8lp4hRFIK/nk++iPZlIi6zg9ZyCM
sR+zBTiH/6fX6wfPv271jy4sVSDn1v3iyub56qsULp21yHBiMN2WdKzRlsFEwnOA
lv0qtB6lAgMBAAECggEAFGyyCdaeYUjzaeI9EbHG7DLxOn0MPxemR77hgVor0IcQ
Vpq7LGMdOssjxuKVkG8ErXjnUJCt/leSEB3+o0jv12y4obtpVFKu7ztSIe2NC06n
IjY0qUO1Ri1TL9F0Qsc1jMQ8h4C67QESk6YohJAmAFoqfnwvlns2zPQDiDSmeoOQ
Fapuh/GG78zjtQ+q5N4de2yE9wanVr94JQUPa3WpQjGUP/UqjeQLuGLtcG8vUBF4
clcKiRsLo/uEkJEABMrE5hSoOpb0HIkE3P/WBH2lVQIXsKDpPAtLuUX9yAqrA2Lt
n2dig4YuFZxOihnifByBw1fNATQrWE5BEVmdCTfz1wKBgQDJkdzN5luZsFii+jFk
kQIRQkxlc9VOrtgBuPQreyPsHIO67hDvcK5zJRKENAi5xDf4woWwQBVezDNEVSvj
m607kr0Q4/k90i2/UUh7pSoiitj/9d9Gc0pet+2IlouBj3mf3s8/fAMgDYO8Q9Vd
bYKxHtyKMfRBfA3WrV3nf8/krwKBgQDCNAAoVRgbJANx3iGq+YcPF18qqnj4tVvP
Sx2oneBoT1s12tB6vgt/6VA8Wk4I48P5197+7LRyuJo2ic09CUr2A7KZYE7Du3Y+
v2Hxggds7EJ9mBbD0ukaG9LVjLprLTOo4Y6uu4HBR8h+8rHsxwU83O3L3YF8WniS
o+BA4YZu6wKBgQCRrP0rQYSJ+kzU3IS97Z7U4llcKO7MQsiR1h2BHynDBoidnFhY
89LgHLbZHNIBj7Hz8oGz81x+eo3CoNtrT6NPHqnNfzUuXKv7TL9ZvPBKrpZNxmBr
Bf+FnN/qiwKfzBVWWSzm8LVBgQLoGQ4my3Jcl7VDmv6wJPvLXtgy6shQuQKBgQCP
Y5++J95No9CbUZzgRa9QGDyfHxGE6TtpmhfC+RbJTdaVtAN8rTeGcTlZ5n95ltqL
bbVr2k/96ImMvUB50ZO0g9Rp5K8jXBWZjOt/Sze6V9NcMmCUo/SS33pTTL4UBmL/
TdNw9md+00aZXQ68OdKHNsSpYtqJe69M7ozUuu/skwKBgQCVRE8ZzHN7N2sZfhDT
oPiMMdirkw418Yt6b3xqu8U3XME8K2bapZaJRGTrS4mGaQq82juHzUYnVT8q68Md
AsUd4+EFRjt7XiSq4joWYTwb0WdiDmEebr2qvCdSacQPs9JgDCDgSC4jRChGphu/
ql36l0guntKJPBpGzHWZQzx9iA==
-----END PRIVATE KEY-----
```

#### **FIREBASE_CLIENT_EMAIL**
```
firebase-adminsdk-fbsvc@wrtmind.iam.gserviceaccount.com
```

#### **JWT_SECRET**
```
wrtmind-jwt-secret-2024-super-secure-key-change-this-in-production
```

#### **SESSION_SECRET**
```
wrtmind-session-secret-2024-super-secure-key-change-this-in-production
```

#### **ALLOWED_ORIGINS**
```
http://localhost:3000,https://wrtmind.vercel.app,https://wrt-frontend.vercel.app
```

#### **RATE_LIMIT_WINDOW_MS**
```
900000
```

#### **RATE_LIMIT_MAX_REQUESTS**
```
100
```

#### **LOG_LEVEL**
```
info
```

#### **LOG_FILE**
```
logs/app.log
```

### **PASSO 2: Redeploy do Projeto**

1. **Após adicionar todas as variáveis:**
   - Vá para: Deployments
   - Clique em "Redeploy" no último deployment
   - Aguarde o processo completar

### **PASSO 3: Verificar se Funcionou**

1. **Execute o script de verificação:**
   ```bash
   node verificar-status-vercel.js
   ```

2. **Resultado esperado:**
   - Status: `200 OK`
   - Headers CORS presentes
   - Resposta JSON válida

### **PASSO 4: Testar Frontend**

1. **Acesse o frontend:**
   - URL: https://wrtmind.vercel.app

2. **Verifique o console do navegador:**
   - Não deve haver erros de CORS
   - Requisições devem retornar status 200

## 🔍 VERIFICAÇÃO ADICIONAL:

### **Se ainda houver problemas:**

1. **Verificar logs do Vercel:**
   - Vá para: Deployments > Último deployment > Functions
   - Verifique se há erros nos logs

2. **Testar endpoints individualmente:**
   - https://wrt-back.vercel.app/api/health
   - https://wrt-back.vercel.app/api/debug
   - https://wrt-back.vercel.app/api/test

3. **Verificar configuração CORS:**
   - O middleware CORS deve estar funcionando
   - Headers devem estar sendo enviados

## 📋 CHECKLIST FINAL:

- [ ] Todas as variáveis de ambiente configuradas
- [ ] Redeploy realizado com sucesso
- [ ] Backend respondendo com status 200
- [ ] Headers CORS presentes
- [ ] Frontend conectando sem erros
- [ ] Console do navegador limpo

## 🎯 RESULTADO ESPERADO:

Após seguir todos os passos, o sistema deve funcionar corretamente:
- ✅ Backend no Vercel funcionando
- ✅ Frontend conectando sem erros
- ✅ CORS configurado corretamente
- ✅ Firebase conectado
- ✅ API respondendo normalmente 