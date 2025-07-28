# 🔍 Debug do Erro 401 no Login

## 🚨 Problema Reportado
```
POST https://wrt-back.vercel.app/api/auth/login 401 (Unauthorized)
Email: kallebe@g2telecom.com.br
```

## 🔍 Possíveis Causas

### 1. **Usuário não existe no Firebase**
- O email `kallebe@g2telecom.com.br` pode não estar cadastrado
- Verificar se o usuário foi criado corretamente

### 2. **Senha incorreta**
- A senha `Amsterda309061` pode estar errada
- Verificar se a senha foi cadastrada corretamente

### 3. **Problema com Firebase**
- Configuração do Firebase pode estar com problema
- Variáveis de ambiente podem estar incorretas

### 4. **Problema de hash da senha**
- A senha pode não estar sendo hasheada corretamente
- Problema na comparação com bcrypt

## 🧪 Como Testar

### 1. **Teste de Verificação de Usuário**
```bash
curl -X POST https://wrt-back.vercel.app/api/test-user-exists \
  -H "Content-Type: application/json" \
  -d '{"email":"kallebe@g2telecom.com.br"}'
```

### 2. **Teste no Frontend**
Abra o arquivo `test-api-simple.html` e use o botão "Verificar se Usuário Existe"

### 3. **Teste de Login Simples**
```bash
curl -X POST https://wrt-back.vercel.app/api/test-login \
  -H "Content-Type: application/json" \
  -d '{"email":"kallebe@g2telecom.com.br","senha":"Amsterda309061"}'
```

## 🔧 Soluções

### **Se o usuário não existir:**
1. Criar o usuário via cadastro
2. Ou inserir manualmente no Firebase

### **Se o usuário existir mas a senha estiver errada:**
1. Resetar a senha
2. Ou recriar o usuário

### **Se for problema do Firebase:**
1. Verificar variáveis de ambiente no Vercel
2. Verificar configuração do Firebase

## 📝 Logs do Backend

O backend deve mostrar logs como:
```
🔐 Tentativa de login: { email: 'kallebe@g2telecom.com.br', senha: '***' }
🔍 Usuário encontrado: { email: 'kallebe@g2telecom.com.br', id: '...' }
✅ Login bem-sucedido para: kallebe@g2telecom.com.br
```

Ou:
```
🔐 Tentativa de login: { email: 'kallebe@g2telecom.com.br', senha: '***' }
❌ Usuário não encontrado: kallebe@g2telecom.com.br
```

## 🎯 Próximos Passos

1. **Teste o endpoint `/api/test-user-exists`**
2. **Verifique se o usuário existe**
3. **Se não existir, crie o usuário**
4. **Se existir, verifique a senha**
5. **Teste novamente o login**

---

**Status**: 🔍 Em investigação
**Última atualização**: Janeiro 2025 