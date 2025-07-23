# 🔧 WRTmind Backend

Backend API para o projeto WRTmind com autenticação Firebase e sistema de notas/links.

## 🚀 Setup Rápido

### **1. Clone e Instale**
```bash
git clone <seu-repositorio>
cd WRT-Back
npm install
```

### **2. Configure as Credenciais**
```bash
npm run setup
```

O script irá te guiar para configurar:
- ✅ Firebase Service Account
- ✅ Variáveis de ambiente
- ✅ Chaves de segurança

### **3. Execute o Projeto**
```bash
npm start
```

Acesse: http://localhost:3001

## 🔐 Configuração Manual

Se preferir configurar manualmente:

### **A. Firebase Service Account**
1. Vá para [Console do Firebase](https://console.firebase.google.com/)
2. Selecione seu projeto
3. **Configurações** > **Contas de serviço**
4. **Gerar nova chave privada**
5. Baixe e renomeie para `wrtmin-service-account.json`
6. Coloque na raiz do projeto

### **B. Variáveis de Ambiente**
```bash
cp config.example.env config.env
```

Edite `config.env`:
```env
PORT=3001
NODE_ENV=development
FIREBASE_PROJECT_ID=seu-projeto-id
FIREBASE_PRIVATE_KEY="sua-chave-privada"
FIREBASE_CLIENT_EMAIL=seu-email@projeto.iam.gserviceaccount.com
JWT_SECRET=sua-chave-jwt
SESSION_SECRET=sua-chave-sessao
```

## 📁 Estrutura do Projeto

```
WRT-Back/
├── config/
│   └── firebase.js          # Configuração Firebase
├── models/                  # Modelos de dados
│   ├── NotaFirebase.js
│   ├── LinkFirebase.js
│   └── UserFirebase.js
├── routes/                  # Rotas da API
│   ├── auth.js
│   ├── notas.js
│   ├── links.js
│   └── topicos.js
├── middleware/              # Middlewares
├── scripts/                 # Scripts utilitários
├── setup-credentials.js     # Script de configuração
├── config.example.env       # Exemplo de variáveis
├── wrtmin-service-account.example.json  # Exemplo de credenciais
└── .gitignore              # Arquivos ignorados
```

## 🔌 Endpoints da API

### **Autenticação**
- `POST /auth/register` - Registrar usuário
- `POST /auth/login` - Login
- `POST /auth/logout` - Logout

### **Notas**
- `GET /notas` - Listar notas
- `POST /notas` - Criar nota
- `PUT /notas/:id` - Atualizar nota
- `DELETE /notas/:id` - Deletar nota

### **Links**
- `GET /links` - Listar links
- `POST /links` - Criar link
- `PUT /links/:id` - Atualizar link
- `DELETE /links/:id` - Deletar link

### **Tópicos**
- `GET /topicos` - Listar tópicos
- `POST /topicos` - Criar tópico
- `PUT /topicos/:id` - Atualizar tópico
- `DELETE /topicos/:id` - Deletar tópico

## 🛠️ Scripts Disponíveis

```bash
npm run setup          # Configurar credenciais
npm run dev           # Desenvolvimento com nodemon
npm start             # Produção
npm run migrate       # Migrar dados para Firebase
npm run test:firebase # Testar conexão Firebase
```

## 🔒 Segurança

### **Arquivos Protegidos (.gitignore)**
- ❌ `wrtmin-service-account.json` (credenciais reais)
- ❌ `config.env` (variáveis reais)
- ❌ `*.key`, `*.pem` (chaves privadas)
- ❌ `node_modules/` (dependências)

### **Arquivos Seguros (commitados)**
- ✅ `wrtmin-service-account.example.json` (exemplo)
- ✅ `config.example.env` (exemplo)
- ✅ Código fonte
- ✅ Documentação

## 🚨 Troubleshooting

### **Erro: "Firebase service account not found"**
```bash
npm run setup
```

### **Erro: "Invalid private key"**
- Verifique se a chave está correta
- Certifique-se de incluir as aspas

### **Erro: "Project ID not found"**
- Confirme o ID do projeto no Firebase Console
- Verifique se o projeto existe

### **Erro: "Permission denied"**
- Verifique as regras do Firestore
- Confirme se o service account tem permissões

## 📞 Suporte

1. Execute `npm run setup` para configuração automática
2. Verifique os logs do servidor
3. Confirme se o Firebase está configurado
4. Abra uma issue no repositório

## 🔄 Deploy

### **Local**
```bash
npm install
npm run setup
npm start
```

### **Produção**
```bash
npm install --production
# Configure variáveis de ambiente
npm start
```

---

**⚠️ IMPORTANTE: Nunca commite credenciais reais no GitHub!**

**🎉 Agora seu projeto funciona em qualquer computador com as credenciais configuradas!** 