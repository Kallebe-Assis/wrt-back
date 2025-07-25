# Correção do Erro de Login - 500 Internal Server Error

## Problema Identificado

O erro de login estava ocorrendo devido a problemas de configuração do Firebase no ambiente Vercel:

1. **Arquivo de credenciais não encontrado**: O código estava procurando por `wrtmin-service-account.json`, mas o arquivo existia com nome diferente
2. **Arquivo ignorado no deploy**: O arquivo de credenciais estava no `.vercelignore`, impedindo o upload para o Vercel
3. **Configuração inconsistente**: O arquivo `config/firebase.js` estava usando o nome antigo do arquivo

## Correções Realizadas

### 1. Arquivo de Credenciais
- ✅ Copiado `wrtmind-firebase-adminsdk-fbsvc-f96a42c84b.json` para `wrtmin-service-account.json`
- ✅ Corrigido o caminho no arquivo `config/firebase.js`

### 2. Configuração do Vercel
- ✅ Removido `wrtmin-service-account.json` do `.vercelignore`
- ✅ Criado arquivo `vercel-env-setup.md` com instruções de configuração

### 3. Melhorias no Código
- ✅ Adicionados logs detalhados para debug
- ✅ Melhorado tratamento de erros
- ✅ Criado endpoint de teste `/api/test-firebase.js`
- ✅ Criado script de teste local `test-firebase-local.js`

### 4. Testes Realizados
- ✅ Firebase funcionando localmente
- ✅ Conexão com Firestore estabelecida
- ✅ 3 usuários encontrados no banco

## Próximos Passos para Deploy

### 1. Configurar Variáveis de Ambiente no Vercel
Acesse o painel do Vercel e configure as seguintes variáveis:

```
GOOGLE_APPLICATION_CREDENTIALS=./wrtmin-service-account.json
FIREBASE_PROJECT_ID=wrtmind
NODE_ENV=production
```

### 2. Fazer Deploy
```bash
vercel --prod
```

### 3. Testar o Endpoint
Após o deploy, teste o endpoint:
```
https://wrt-back.vercel.app/api/test-firebase
```

### 4. Testar o Login
Teste o login com um usuário existente no banco.

## Arquivos Modificados

- `config/firebase.js` - Corrigido caminho do arquivo de credenciais
- `api/auth/login.js` - Adicionados logs e melhor tratamento de erros
- `.vercelignore` - Removido arquivo de credenciais da lista de ignorados
- `wrtmin-service-account.json` - Criado (cópia do arquivo original)
- `api/test-firebase.js` - Novo endpoint de teste
- `test-firebase-local.js` - Novo script de teste local
- `vercel-env-setup.md` - Guia de configuração

## Status

- ✅ Problema identificado
- ✅ Correções implementadas
- ✅ Testes locais passando
- ⏳ Aguardando deploy no Vercel
- ⏳ Aguardando configuração de variáveis de ambiente 