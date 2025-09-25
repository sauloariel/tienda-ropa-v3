# 🚀 Configuración de Puertos - Sistema E-commerce

## 📋 Puertos Configurados

| Servicio | Puerto | URL | Descripción |
|----------|--------|-----|-------------|
| **Backend** | 4000 | http://localhost:4000 | API REST del sistema |
| **Tienda de Ropa** | 5173 | http://localhost:5173 | Frontend para clientes |
| **Panel Administrativo** | 5174 | http://localhost:5174 | Frontend para administradores |

## 🎯 Cómo Ejecutar

### Opción 1: Ejecutar Todo Automáticamente
```bash
# Ejecutar todos los servicios a la vez
start-all.bat
```

### Opción 2: Ejecutar Servicios Individualmente

#### Backend (Requerido para ambos frontends)
```bash
start-backend.bat
# O manualmente:
cd backend_definitivo
npm run dev
```

#### Tienda de Ropa
```bash
start-tienda.bat
# O manualmente:
cd tienda-ropa
npm run dev
```

#### Panel Administrativo
```bash
start-panel.bat
# O manualmente:
cd panel-administrativo
npm run dev
```

## 🔧 Configuración Técnica

### Backend (Puerto 4000)
- **Archivo**: `backend_definitivo/src/index.ts`
- **Comando**: `npm run dev`
- **API Base**: `http://localhost:4000/api`

### Tienda de Ropa (Puerto 5173)
- **Archivo**: `tienda-ropa/vite.config.ts`
- **Comando**: `npm run dev`
- **URL**: `http://localhost:5173`

### Panel Administrativo (Puerto 5174)
- **Archivo**: `panel-administrativo/vite.config.web.ts`
- **Comando**: `npm run dev`
- **URL**: `http://localhost:5174`

## ✅ Verificación

1. **Backend**: Visita http://localhost:4000/api/health
2. **Tienda**: Visita http://localhost:5173
3. **Panel**: Visita http://localhost:5174

## 🐛 Solución de Problemas

### Puerto en Uso
Si un puerto está ocupado, puedes cambiarlo en:
- **Tienda**: `tienda-ropa/vite.config.ts` → `server.port`
- **Panel**: `panel-administrativo/vite.config.web.ts` → `server.port`
- **Backend**: `backend_definitivo/src/index.ts` → `PORT`

### Verificar Puertos Ocupados
```bash
# Windows
netstat -an | findstr :5173
netstat -an | findstr :5174
netstat -an | findstr :4000
```

## 📝 Notas Importantes

- **El backend debe ejecutarse primero** antes que los frontends
- **Ambos frontends pueden ejecutarse simultáneamente** sin conflictos
- **Las URLs de API están configuradas** para apuntar al backend en puerto 4000
- **Los archivos .bat** facilitan el inicio rápido de los servicios















