# Script para iniciar o backend WRTmind
Write-Host "🚀 Iniciando backend WRTmind..." -ForegroundColor Green

# Navegar para o diretório do backend
Set-Location "WRT-Back-Clean"

# Verificar se o package.json existe
if (Test-Path "package.json") {
    Write-Host "✅ Package.json encontrado" -ForegroundColor Green
    
    # Instalar dependências se necessário
    if (-not (Test-Path "node_modules")) {
        Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
        npm install
    }
    
    # Iniciar o servidor
    Write-Host "🔄 Iniciando servidor na porta 5000..." -ForegroundColor Yellow
    Write-Host "📡 URL: http://localhost:5000/api" -ForegroundColor Cyan
    npm start
} else {
    Write-Host "❌ Package.json não encontrado no diretório WRT-Back-Clean" -ForegroundColor Red
    Write-Host "💡 Verifique se você está no diretório correto" -ForegroundColor Yellow
} 