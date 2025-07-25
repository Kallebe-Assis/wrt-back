# Solução para Erro 500 no Login - Vercel

## Problema Identificado

O erro `Cannot find.../var/task/api/auth/Login.js` indica um problema de **case sensitivity** no Vercel:

1. **Case Sensitivity**: O Vercel (Linux) é case-sensitive, enquanto o Windows não
2. **Arquivo não encontrado**: O sistema está procurando por `Login.js` (maiúsculo) mas o arquivo é `login.js` (minúsculo)
3. **Problema de deploy**: O arquivo pode não estar sendo enviado corretamente

## Soluções Implementadas

### 1. Verificação de Arquivos
- ✅ Arquivo `login.js` existe em `api/auth/`
- ✅ Nome do arquivo está correto (minúsculo)
- ✅ Estrutura de diretórios está correta

### 2. Correções Realizadas
- ✅ Arquivo de credenciais copiado para `wrtmin-service-account.json`
- ✅ Removido do `.vercelignore`
- ✅ Configuração do Firebase corrigida
- ✅ Logs detalhados adicionados

### 3. Endpoints de Teste Criados
- ✅ `/api/test-simple.js` - Teste básico sem Firebase
- ✅ `/api/test-firebase.js` - Teste específico do Firebase

## Próximos Passos

### 1. Fazer Deploy Limpo
```bash
# Remover cache do Vercel
vercel --force

# Fazer deploy de produção
vercel --prod
```

### 2. Configurar Variáveis de Ambiente
No painel do Vercel, adicionar:
```
GOOGLE_APPLICATION_CREDENTIALS=./wrtmin-service-account.json
FIREBASE_PROJECT_ID=wrtmind
NODE_ENV=production
```

### 3. Testar Endpoints
1. Teste simples: `https://wrt-back.vercel.app/api/test-simple`
2. Teste Firebase: `https://wrt-back.vercel.app/api/test-firebase`
3. Teste login: `https://wrt-back.vercel.app/api/auth/login`

### 4. Verificar Logs
- Acessar logs do Vercel para ver erros detalhados
- Verificar se o arquivo está sendo carregado corretamente

## Possíveis Causas do Erro

1. **Cache do Vercel**: Deploy anterior pode ter cacheado configuração incorreta
2. **Arquivo não enviado**: Arquivo pode não estar sendo incluído no deploy
3. **Case sensitivity**: Alguma referência com maiúscula em algum lugar
4. **Dependências**: Problema com `firebase-admin` ou outras dependências

## Solução Alternativa

Se o problema persistir, criar um novo endpoint com nome diferente:
```javascript
// api/auth/login-v2.js
// Copiar conteúdo do login.js atual
```

## Status

- ✅ Problema identificado (case sensitivity)
- ✅ Correções implementadas
- ✅ Endpoints de teste criados
- ⏳ Aguardando deploy limpo
- ⏳ Aguardando configuração de variáveis 