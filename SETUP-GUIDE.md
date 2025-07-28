# 🚀 Guia de Configuração Rápida - WRTmind

## ⚡ Setup em 5 Minutos

### 1. Pré-requisitos
- ✅ Node.js 16+ instalado
- ✅ Conta Firebase criada
- ✅ Git instalado

### 2. Clone e Instale

```bash
# Clone o repositório
git clone <seu-repositorio>
cd WRTmind

# Backend
cd WRT-Back-Clean
npm install

# Frontend
cd ../WRT-Front
npm install
```

### 3. Configure o Firebase

#### A. Criar Projeto Firebase
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Digite o nome: `wrtmind-app`
4. Ative o Google Analytics (opcional)
5. Clique em "Criar projeto"

#### B. Configurar Firestore
1. No menu lateral, clique em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Modo de teste" (para desenvolvimento)
4. Escolha a localização mais próxima
5. Clique em "Concluir"

#### C. Configurar Autenticação
1. No menu lateral, clique em "Authentication"
2. Clique em "Começar"
3. Em "Sign-in method", ative "Email/Password"
4. Clique em "Salvar"

#### D. Obter Credenciais
1. No menu lateral, clique em "Configurações" (ícone de engrenagem)
2. Clique em "Configurações do projeto"
3. Vá para a aba "Contas de serviço"
4. Clique em "Gerar nova chave privada"
5. Baixe o arquivo JSON

### 4. Configurar Backend

```bash
cd WRT-Back-Clean

# Copiar arquivo de exemplo
cp config.example.env config.env
```

**Editar `config.env`:**
```env
# Firebase Configuration
FIREBASE_PROJECT_ID=wrtmind-app
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSua chave privada aqui\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@wrtmind-app.iam.gserviceaccount.com

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret (gerar uma chave aleatória)
JWT_SECRET=sua-chave-jwt-super-segura-aqui
```

### 5. Configurar Frontend

```bash
cd ../WRT-Front

# Editar src/config/environment.js
```

**Editar `src/config/environment.js`:**
```javascript
export const getApiUrl = (endpoint) => {
  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  return `${baseUrl}/api${endpoint}`;
};
```

### 6. Iniciar o Sistema

**Terminal 1 - Backend:**
```bash
cd WRT-Back-Clean
npm start
```

**Terminal 2 - Frontend:**
```bash
cd WRT-Front
npm start
```

### 7. Acessar o Sistema

- 🌐 **Frontend**: http://localhost:3000
- 🔌 **Backend**: http://localhost:5000
- 📊 **Firebase Console**: https://console.firebase.google.com

## 🔧 Configurações Avançadas

### Variáveis de Ambiente (Frontend)

Criar arquivo `.env` na pasta `WRT-Front`:
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_FIREBASE_API_KEY=sua-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=wrtmind-app.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=wrtmind-app
```

### Regras do Firestore

No Firebase Console > Firestore > Regras:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir acesso apenas para usuários autenticados
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Configuração de CORS

O backend já está configurado para aceitar requisições do frontend. Se precisar ajustar:

```javascript
// Em backend-zero.js
app.use(cors({
  origin: ['http://localhost:3000', 'https://seu-dominio.com'],
  credentials: true
}));
```

## 🐛 Solução de Problemas

### Erro: "Firebase service account not found"
```bash
# Verificar se o arquivo config.env existe
ls -la config.env

# Verificar se as credenciais estão corretas
cat config.env
```

### Erro: "CORS policy"
```bash
# Verificar se o backend está rodando na porta 5000
netstat -an | grep 5000

# Verificar se o frontend está configurado corretamente
cat WRT-Front/src/config/environment.js
```

### Erro: "JWT_SECRET not defined"
```bash
# Gerar uma nova chave JWT
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Adicionar ao config.env
echo "JWT_SECRET=sua-nova-chave" >> config.env
```

### Erro: "Cannot connect to Firebase"
1. Verificar se o projeto Firebase existe
2. Verificar se as credenciais estão corretas
3. Verificar se o Firestore está ativo
4. Verificar as regras do Firestore

## 📊 Verificação do Sistema

### Teste de Conectividade

```bash
# Testar backend
curl http://localhost:5000/api/health

# Testar frontend
curl http://localhost:3000
```

### Teste de Autenticação

1. Acesse http://localhost:3000
2. Clique em "Registrar"
3. Crie uma conta
4. Faça login
5. Verifique se consegue criar uma nota

### Teste de Banco de Dados

1. Crie uma nota no frontend
2. Verifique no Firebase Console > Firestore
3. Confirme se os dados foram salvos

## 🚀 Deploy para Produção

### Backend (Vercel)

1. Instalar Vercel CLI:
```bash
npm i -g vercel
```

2. Fazer deploy:
```bash
cd WRT-Back-Clean
vercel --prod
```

3. Configurar variáveis de ambiente no Vercel Dashboard

### Frontend (Vercel)

1. Fazer build:
```bash
cd WRT-Front
npm run build
```

2. Fazer deploy:
```bash
vercel --prod
```

## 📝 Checklist Final

- ✅ Node.js instalado
- ✅ Projeto Firebase criado
- ✅ Firestore ativo
- ✅ Autenticação configurada
- ✅ Credenciais configuradas
- ✅ Backend rodando na porta 5000
- ✅ Frontend rodando na porta 3000
- ✅ Sistema acessível via navegador
- ✅ Registro de usuário funcionando
- ✅ Criação de notas funcionando

## 🎉 Pronto!

Seu sistema WRTmind está configurado e funcionando! 

**Próximos passos:**
1. Explore as funcionalidades
2. Personalize o design
3. Adicione novas features
4. Configure backup automático
5. Monitore o uso

---

**💡 Dica**: Mantenha suas credenciais seguras e nunca as commite no GitHub! 