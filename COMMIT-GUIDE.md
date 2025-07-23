# 🔒 Guia de Commits Seguros

## **🚨 ANTES de fazer commit:**

### **1. Verifique se não há credenciais reais**
```bash
# Verifique se os arquivos sensíveis estão no .gitignore
git status

# Se aparecer algum arquivo de credenciais, NÃO COMMITE!
```

### **2. Arquivos que NUNCA devem ser commitados:**
- ❌ `wrtmin-service-account.json` (credenciais reais)
- ❌ `config.env` (variáveis de ambiente reais)
- ❌ `*.key` (chaves privadas)
- ❌ `*.pem` (certificados)
- ❌ `secrets.json` (segredos)
- ❌ `.env` (variáveis de ambiente)

### **3. Arquivos que DEVEM ser commitados:**
- ✅ `wrtmin-service-account.example.json` (exemplo)
- ✅ `config.example.env` (exemplo)
- ✅ `.gitignore` (configuração)
- ✅ `README.md` (documentação)
- ✅ `SETUP.md` (guia de configuração)
- ✅ `COMMIT-GUIDE.md` (este arquivo)

## **📝 Como fazer commit seguro:**

### **1. Verificação inicial**
```bash
# Verifique o status
git status

# Verifique se há arquivos sensíveis
git diff --cached
```

### **2. Se houver arquivos sensíveis:**
```bash
# Remova do staging
git reset wrtmin-service-account.json
git reset config.env

# Adicione ao .gitignore se não estiver
echo "wrtmin-service-account.json" >> .gitignore
echo "config.env" >> .gitignore
```

### **3. Commit seguro**
```bash
# Adicione apenas arquivos seguros
git add .gitignore
git add *.example.json
git add *.example.env
git add README.md
git add SETUP.md
git add COMMIT-GUIDE.md
git add package.json
git add src/
git add routes/
git add models/
git add services/
git add middleware/

# Faça o commit
git commit -m "feat: initial commit - WRTmind backend setup

- Added Firebase configuration
- Added API routes for notes and links
- Added authentication system
- Added export utilities
- Added comprehensive documentation
- Added security guidelines"
```

## **🔍 Verificação final:**

### **1. Teste local**
```bash
# Verifique se o projeto funciona
npm install
npm start
```

### **2. Verifique o que será enviado**
```bash
# Veja o que será enviado para o GitHub
git diff --cached

# Verifique se não há credenciais
git log --oneline -1
```

### **3. Push seguro**
```bash
# Envie para o GitHub
git push origin main
```

## **🚨 Se você já commitou credenciais:**

### **1. Remova imediatamente**
```bash
# Remova do histórico
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch wrtmin-service-account.json" \
  --prune-empty --tag-name-filter cat -- --all

# Force push para remover do GitHub
git push origin --force --all
```

### **2. Revogue as credenciais**
- Vá para o Firebase Console
- Gere novas credenciais
- Delete as antigas

### **3. Atualize localmente**
- Substitua o arquivo de credenciais
- Teste se tudo funciona

## **✅ Checklist de Segurança:**

- [ ] Nenhum arquivo `.json` com credenciais reais
- [ ] Nenhum arquivo `.env` com variáveis reais
- [ ] `.gitignore` configurado corretamente
- [ ] Arquivos de exemplo incluídos
- [ ] Documentação atualizada
- [ ] Projeto funciona localmente
- [ ] Commit message descritiva
- [ ] Testado antes do push

## **📞 Em caso de dúvida:**

1. **NÃO COMMITE** se tiver dúvida
2. Verifique este guia novamente
3. Teste localmente primeiro
4. Peça ajuda se necessário

---

**🔐 Lembre-se: É melhor prevenir do que remediar!** 