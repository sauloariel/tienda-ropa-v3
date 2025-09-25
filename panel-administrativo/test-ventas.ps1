# Test del Módulo de Ventas
# Script de PowerShell para probar la conexión con la base de datos

Write-Host "========================================" -ForegroundColor Blue
Write-Host "    TEST DEL MODULO DE VENTAS" -ForegroundColor Blue
Write-Host "========================================" -ForegroundColor Blue
Write-Host ""

# Verificar si Node.js está instalado
Write-Host "Verificando si Node.js está instalado..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ Node.js no está instalado" -ForegroundColor Red
    Write-Host "💡 Instala Node.js desde https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Presiona Enter para salir"
    exit 1
}

Write-Host ""

# Verificar si axios está instalado
Write-Host "Verificando dependencias..." -ForegroundColor Yellow
try {
    node -e "require('axios')" 2>$null
    Write-Host "✅ Dependencias listas" -ForegroundColor Green
}
catch {
    Write-Host "📦 Instalando axios..." -ForegroundColor Yellow
    npm install axios
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error instalando axios" -ForegroundColor Red
        Read-Host "Presiona Enter para salir"
        exit 1
    }
}

Write-Host ""

# Ejecutar el test
Write-Host "🚀 Ejecutando test del módulo de ventas..." -ForegroundColor Green
Write-Host ""

node test-ventas-simple.js

Write-Host ""
Write-Host "========================================" -ForegroundColor Blue
Write-Host "    TEST COMPLETADO" -ForegroundColor Blue
Write-Host "========================================" -ForegroundColor Blue
Write-Host ""
Read-Host "Presiona Enter para salir"








