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
[SUA_CHAVE_PRIVADA_AQUI]
```

#### **FIREBASE_CLIENT_EMAIL**
```
firebase-adminsdk-fbsvc@wrtmind.iam.gserviceaccount.com
```

#### **JWT_SECRET**
```
[SUA_CHAVE_JWT_AQUI]
```

#### **SESSION_SECRET**
```
[SUA_CHAVE_SESSAO_AQUI]
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