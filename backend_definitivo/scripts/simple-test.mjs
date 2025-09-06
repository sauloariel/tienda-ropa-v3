#!/usr/bin/env node

console.log('🧪 Iniciando test simple...');

try {
    const response = await fetch('http://localhost:4000/api/health');
    const data = await response.json();
    console.log('✅ Health check:', data);
} catch (error) {
    console.error('❌ Error:', error.message);
}

