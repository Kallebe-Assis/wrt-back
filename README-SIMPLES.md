# WRTmind Backend - Versão Simples

Backend extremamente simples e funcional para o WRTmind.

## Como usar

### 1. Instalar dependências
```bash
npm install
```

### 2. Rodar localmente
```bash
npm start
```

### 3. Deploy no Vercel
```bash
vercel --prod
```

## Endpoints

### Teste
- `GET /api/test` - Testa se a API está funcionando

### Autenticação
- `POST /api/auth/login` - Fazer login
- `POST /api/auth/register` - Cadastrar usuário

### Notas
- `GET /api/notas?userId=123` - Buscar notas do usuário
- `POST /api/notas` - Criar nota
- `PUT /api/notas?id=123` - Atualizar nota
- `DELETE /api/notas?id=123` - Deletar nota

## Estrutura

```
WRT-Back-Clean/
├── server.js              # Servidor local
├── api/
│   ├── test.js           # Endpoint de teste
│   ├── auth/
│   │   └── login.js      # Login
│   └── notas.js          # CRUD de notas
├── wrtmin-service-account.json  # Credenciais Firebase
└── vercel.json           # Configuração Vercel
```

## Firebase

O backend usa Firebase Firestore para armazenar dados:
- Coleção `users` - Usuários
- Coleção `notas` - Notas dos usuários

## Deploy

1. Certifique-se de que o arquivo `wrtmin-service-account.json` está na raiz
2. Execute `vercel --prod`
3. Configure as variáveis de ambiente no Vercel se necessário

## Simplicidade

Este backend foi feito para ser:
- ✅ Fácil de entender
- ✅ Fácil de modificar
- ✅ Fácil de debugar
- ✅ Funcional
- ❌ Sem complicações desnecessárias 