# 🚀 WRTmind - Sistema de Gerenciamento de Notas e Links

## 📋 Visão Geral

O WRTmind é um sistema completo de gerenciamento de notas e links pessoais, desenvolvido com **Node.js/Express** no backend e **React** no frontend, utilizando **Firebase** como banco de dados.

## 🏗️ Arquitetura do Sistema

### Backend (WRT-Back-Clean)
- **Framework**: Node.js + Express
- **Banco de Dados**: Firebase Firestore
- **Autenticação**: JWT + Firebase Auth
- **Porta**: 5000 (desenvolvimento)

### Frontend (WRT-Front)
- **Framework**: React 18
- **Estilização**: Styled Components
- **Ícones**: FontAwesome
- **Porta**: 3000 (desenvolvimento)

## 📁 Estrutura do Projeto

```
WRTmind/
├── WRT-Back-Clean/          # Backend principal
│   ├── backend-zero.js      # Servidor principal
│   ├── api/                 # Rotas da API
│   ├── models/              # Modelos de dados
│   ├── middleware/          # Middlewares
│   ├── config/              # Configurações
│   └── firebase/            # Configuração Firebase
└── WRT-Front/              # Frontend React
    ├── src/
    │   ├── components/      # Componentes React
    │   ├── context/         # Context API
    │   ├── hooks/           # Custom Hooks
    │   ├── config/          # Configurações
    │   └── styles/          # Estilos globais
    └── public/              # Arquivos estáticos
```

## 🚀 Como Executar o Sistema

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn
- Conta Firebase (para banco de dados)

### 1. Configuração do Backend

```bash
# Navegar para o backend
cd WRT-Back-Clean

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp config.example.env config.env
```

**Editar `config.env`:**
```env
# Firebase Configuration
FIREBASE_PROJECT_ID=seu-projeto-firebase
FIREBASE_PRIVATE_KEY="sua-chave-privada"
FIREBASE_CLIENT_EMAIL=seu-email@projeto.iam.gserviceaccount.com

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret
JWT_SECRET=seu-jwt-secret-super-seguro
```

### 2. Configuração do Frontend

```bash
# Navegar para o frontend
cd WRT-Front

# Instalar dependências
npm install

# Configurar API URL
# Editar src/config/environment.js
```

**Editar `src/config/environment.js`:**
```javascript
export const getApiUrl = (endpoint) => {
  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  return `${baseUrl}/api${endpoint}`;
};
```

### 3. Iniciar o Sistema

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

## 🔧 Funcionalidades Principais

### 📝 Sistema de Notas
- ✅ Criar, editar, excluir notas
- ✅ Categorização de notas
- ✅ Tópicos para organização
- ✅ Busca e filtros
- ✅ Lixeira com restauração
- ✅ Auto-save (desabilitado por padrão)

### 🔗 Sistema de Links
- ✅ Gerenciamento de links favoritos
- ✅ Categorização de links
- ✅ Interface de atalhos na tela inicial
- ✅ Drag & drop para reordenação
- ✅ Sincronização automática

### 👤 Sistema de Usuários
- ✅ Registro e login
- ✅ Autenticação JWT
- ✅ Perfis de usuário
- ✅ Dados isolados por usuário

### 🎨 Interface
- ✅ Design responsivo
- ✅ Tema escuro/claro
- ✅ Modal de tela cheia
- ✅ Menu lateral retrátil
- ✅ Animações suaves

## 📊 Estrutura de Dados

### Nota
```javascript
{
  id: string,
  titulo: string,        // Título da nota
  conteudo: string,      // Conteúdo da nota
  topico: string,        // Tópico (opcional)
  categoria: string,     // Categoria (opcional)
  userId: string,        // ID do usuário
  ativo: boolean,        // Soft delete
  dataCriacao: string,   // ISO date
  dataModificacao: string // ISO date
}
```

### Link
```javascript
{
  id: string,
  nome: string,          // Nome do link
  url: string,           // URL do link
  urlImagem: string,     // URL da imagem
  categoria: string,     // Categoria
  userId: string,        // ID do usuário
  posicao: number,       // Posição na tela inicial
  ativo: boolean         // Soft delete
}
```

## 🔌 APIs Principais

### Notas
- `GET /api/notas` - Listar notas
- `POST /api/notas` - Criar nota
- `PUT /api/notas/:id` - Atualizar nota
- `DELETE /api/notas/:id` - Excluir nota

### Links
- `GET /api/links` - Listar links
- `POST /api/links` - Criar link
- `PUT /api/links/:id` - Atualizar link
- `DELETE /api/links/:id` - Excluir link

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

## 🛠️ Desenvolvimento

### Scripts Disponíveis

**Backend:**
```bash
npm start          # Iniciar servidor
npm run dev        # Modo desenvolvimento (nodemon)
```

**Frontend:**
```bash
npm start          # Iniciar servidor de desenvolvimento
npm run build      # Build para produção
npm test           # Executar testes
```

### Estrutura de Desenvolvimento

1. **Backend**: Desenvolvido em `backend-zero.js` (arquivo único)
2. **Frontend**: Componentes modulares em React
3. **Banco**: Firebase Firestore para persistência
4. **Autenticação**: JWT + Firebase Auth

## 🔒 Segurança

- ✅ Autenticação JWT
- ✅ Validação de dados
- ✅ Isolamento de dados por usuário
- ✅ Sanitização de inputs
- ✅ Headers de segurança
- ✅ Rate limiting (configurável)

## 📈 Performance

- ✅ Lazy loading de componentes
- ✅ Otimização de imagens
- ✅ Cache de dados
- ✅ Compressão de respostas
- ✅ Paginação de resultados

## 🐛 Troubleshooting

### Problemas Comuns

1. **Erro de conexão com Firebase**
   - Verificar credenciais no `config.env`
   - Verificar regras do Firestore

2. **Erro de CORS**
   - Verificar configuração no backend
   - Verificar URL da API no frontend

3. **Erro de autenticação**
   - Verificar JWT_SECRET
   - Verificar token no localStorage

4. **Notas não salvando**
   - Verificar estrutura de dados
   - Verificar validações no backend

### Logs e Debug

```bash
# Backend logs
tail -f logs/combined.log

# Frontend logs
# Verificar console do navegador
```

## 🚀 Deploy

### Backend (Vercel)
```bash
# Configurar vercel.json
vercel --prod
```

### Frontend (Vercel/Netlify)
```bash
npm run build
# Fazer upload da pasta build
```

## 📝 Changelog

### v2.0.0 (Atual)
- ✅ Sistema de notas completo
- ✅ Sistema de links completo
- ✅ Autenticação JWT
- ✅ Interface moderna
- ✅ Responsividade
- ✅ Performance otimizada

### v1.0.0
- ✅ Sistema básico de notas
- ✅ Autenticação simples
- ✅ Interface básica

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

---

**Desenvolvido com ❤️ para organização pessoal** 