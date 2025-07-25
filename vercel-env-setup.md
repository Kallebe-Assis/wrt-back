# Configuração de Variáveis de Ambiente no Vercel

## Variáveis Necessárias

Configure as seguintes variáveis de ambiente no painel do Vercel:

### Firebase
- `GOOGLE_APPLICATION_CREDENTIALS`: `./wrtmin-service-account.json`
- `FIREBASE_PROJECT_ID`: `wrtmind`
- `FIREBASE_DATABASE_URL`: `https://wrtmind.firebaseio.com`
- `FIREBASE_API_KEY`: `AIzaSyCWsBJrqCCsm5LM70KX17VYKnT8ml_1KZQ`
- `FIREBASE_AUTH_DOMAIN`: `wrtmind.firebaseapp.com`
- `FIREBASE_STORAGE_BUCKET`: `wrtmind.firebasestorage.app`
- `FIREBASE_MESSAGING_SENDER_ID`: `86110752542`
- `FIREBASE_APP_ID`: `1:86110752542:web:6ee0a36d3e6f32da40c30f`
- `FIREBASE_MEASUREMENT_ID`: `G-9X9077B6WE`

### Servidor
- `NODE_ENV`: `production`
- `PORT`: `5000`

### Frontend
- `FRONTEND_URL`: `https://wrt-front.vercel.app`

### Segurança
- `RATE_LIMIT_WINDOW_MS`: `900000`
- `RATE_LIMIT_MAX_REQUESTS`: `100`

## Como Configurar

1. Acesse o painel do Vercel
2. Vá para o projeto `wrt-back`
3. Clique em "Settings"
4. Vá para "Environment Variables"
5. Adicione cada variável acima

## Importante

- O arquivo `wrtmin-service-account.json` deve estar na raiz do projeto
- As variáveis de ambiente são necessárias para o Firebase funcionar no Vercel
- Sem essas configurações, o login não funcionará 