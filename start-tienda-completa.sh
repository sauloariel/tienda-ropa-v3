#!/bin/bash

echo "========================================"
echo "    Iniciando Tienda de Ropa Completa"
echo "========================================"
echo ""
echo "Este script iniciara tanto el backend como el frontend"
echo ""

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js no está instalado"
    echo "Por favor, instala Node.js 18+ y vuelve a intentar"
    exit 1
fi

# Verificar si npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm no está instalado"
    echo "Por favor, instala npm y vuelve a intentar"
    exit 1
fi

echo "1. Iniciando Backend en puerto 4000..."
echo ""

# Iniciar backend en segundo plano
cd backend_definitivo
npm run init-db &
npm run dev &
BACKEND_PID=$!

echo ""
echo "2. Esperando 5 segundos para que el backend se inicie..."
sleep 5

echo ""
echo "3. Iniciando Frontend en puerto 5173..."
echo ""

# Iniciar frontend en segundo plano
cd ../tienda-ropa
npm run dev &
FRONTEND_PID=$!

echo ""
echo "========================================"
echo "    Ambos servicios estan iniciando"
echo "========================================"
echo ""
echo "Backend: http://localhost:4000"
echo "Frontend: http://localhost:5173"
echo ""
echo "Para detener los servicios, presiona Ctrl+C"
echo ""

# Función para limpiar procesos al salir
cleanup() {
    echo ""
    echo "🛑 Deteniendo servicios..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servicios detenidos"
    exit 0
}

# Capturar Ctrl+C
trap cleanup SIGINT

# Mantener el script ejecutándose
wait
