# 🔧 Configuração do WRTmind Backend

## **📋 Pré-requisitos**

- Node.js (versão 16 ou superior)
- npm ou yarn
- Conta no Firebase
- Editor de código (VS Code recomendado)

## **🚀 Instalação**

### **1. Clone o repositório**
```bash
git clone <url-do-repositorio>
cd WRT-Back
```

### **2. Instale as dependências**
```bash
npm install
```

### **3. Configure as credenciais**

#### **A. Firebase Service Account**
1. Vá para o [Console do Firebase](https://console.firebase.google.com/)
2. Selecione seu projeto
3. Vá em **Configurações do Projeto** > **Contas de serviço**
4. Clique em **Gerar nova chave privada**
5. Baixe o arquivo JSON
6. Renomeie para `wrtmin-service-account.json`
7. Coloque na raiz do projeto

#### **B. Variáveis de Ambiente**
1. Copie o arquivo de exemplo:
```bash
cp config.example.env config.env
```

2. Edite o arquivo `config.env` com suas configurações:
```env
# Configurações do Servidor
PORT=3001
NODE_ENV=development

# Configurações do Firebase
FIREBASE_PROJECT_ID=seu-projeto-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSUA_CHAVE_PRIVADA_AQUI\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@seu-projeto-id.iam.gserviceaccount.com

# Configurações de Segurança
JWT_SECRET=sua-chave-secreta-jwt
SESSION_SECRET=sua-chave-secreta-sessao
```

### **4. Execute o projeto**
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## **🔐 Segurança**

### **Arquivos que NUNCA devem ser commitados:**
- ✅ `wrtmin-service-account.json` (credenciais reais)
- ✅ `config.env` (variáveis de ambiente reais)
- ✅ `*.key` (chaves privadas)
- ✅ `*.pem` (certificados)
- ✅ `secrets.json` (segredos)

### **Arquivos que DEVEM ser commitados:**
- ✅ `wrtmin-service-account.example.json` (exemplo)
- ✅ `config.example.env` (exemplo)
- ✅ `.gitignore` (configuração)
- ✅ `README.md` (documentação)

## **📁 Estrutura de Arquivos**

```
WRT-Back/
├── config/
│   └── firebase.js          # Configuração do Firebase
├── models/                  # Modelos de dados
├── routes/                  # Rotas da API
├── services/                # Serviços
├── middleware/              # Middlewares
├── scripts/                 # Scripts utilitários
├── wrtmin-service-account.json     # ❌ NÃO COMMITAR
├── wrtmin-service-account.example.json  # ✅ COMMITAR
├── config.env               # ❌ NÃO COMMITAR
├── config.example.env       # ✅ COMMITAR
├── .gitignore               # ✅ COMMITAR
├── package.json             # ✅ COMMITAR
└── README.md                # ✅ COMMITAR
```

## **🚨 Troubleshooting**

### **Erro: "Firebase service account not found"**
- Verifique se o arquivo `wrtmin-service-account.json` existe
- Confirme se o caminho está correto em `config/firebase.js`

### **Erro: "Invalid private key"**
- Verifique se a chave privada está correta no arquivo JSON
- Certifique-se de que não há espaços extras

### **Erro: "Project ID not found"**
- Verifique se o `project_id` no arquivo JSON está correto
- Confirme se o projeto existe no Firebase Console

## **📞 Suporte**

Se encontrar problemas:
1. Verifique se todas as credenciais estão corretas
2. Confirme se o Firebase está configurado
3. Verifique os logs do servidor
4. Abra uma issue no repositório

---

**⚠️ IMPORTANTE: Nunca commite credenciais reais no GitHub!** 