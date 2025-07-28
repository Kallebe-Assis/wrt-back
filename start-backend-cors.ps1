# Script para iniciar o backend com configurações CORS corretas
Write-Host "🚀 Iniciando Backend WRTmind com CORS configurado..." -ForegroundColor Green

# Verificar se o Node.js está instalado
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js não encontrado. Instale o Node.js primeiro." -ForegroundColor Red
    exit 1
}

# Verificar se as dependências estão instaladas
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
    npm install
}

# Verificar se o arquivo de configuração do Firebase existe
if (-not (Test-Path "wrtmin-service-account.json")) {
    Write-Host "⚠️ Arquivo wrtmin-service-account.json não encontrado!" -ForegroundColor Yellow
    Write-Host "📝 Copie o arquivo de exemplo e configure suas credenciais do Firebase:" -ForegroundColor Cyan
    Write-Host "   cp wrtmin-service-account.example.json wrtmin-service-account.json" -ForegroundColor White
}

# Iniciar o servidor
Write-Host "🌐 Iniciando servidor na porta 5000..." -ForegroundColor Green
Write-Host "📡 URL: http://localhost:5000" -ForegroundColor Cyan
Write-Host "🧪 Teste: http://localhost:5000/api/test" -ForegroundColor Cyan
Write-Host "📋 Para testar CORS, abra: teste-cors.html" -ForegroundColor Cyan
Write-Host ""

# Iniciar o servidor
node backend-zero.js 