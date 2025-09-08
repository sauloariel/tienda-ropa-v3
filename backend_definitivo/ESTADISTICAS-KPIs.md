# Módulo de Estadísticas - KPIs Implementados

Este módulo ha sido completamente renovado para incluir 8 KPIs específicos y útiles para el análisis de ventas de ropa.

## KPIs Disponibles

### 1. Top 10 Productos Más Vendidos (por unidades)
**Endpoint:** `GET /estadisticas/top-productos-vendidos`

**Parámetros:**
- `limite` (opcional): Número de productos a mostrar (default: 10)

**Respuesta:**
```json
[
  {
    "id_producto": 1,
    "descripcion": "Camiseta Básica",
    "unidades_vendidas": 150,
    "precio_venta": 25.99
  }
]
```

### 2. Ingresos por Día/Semana/Mes
**Endpoint:** `GET /estadisticas/ingresos-por-periodo`

**Parámetros:**
- `periodo` (opcional): "dia", "semana", "mes" (default: "dia")
- `limite` (opcional): Número de períodos a mostrar (default: 30)

**Respuesta:**
```json
[
  {
    "periodo": "2024-01-15",
    "ingresos": 1250.50,
    "tipo_periodo": "dia"
  }
]
```

### 3. Cantidad de Clientes por Día/Semana/Mes
**Endpoint:** `GET /estadisticas/clientes-por-periodo`

**Parámetros:**
- `periodo` (opcional): "dia", "semana", "mes" (default: "dia")
- `limite` (opcional): Número de períodos a mostrar (default: 30)

**Respuesta:**
```json
[
  {
    "periodo": "2024-01-15",
    "clientes_unicos": 25,
    "tipo_periodo": "dia"
  }
]
```

### 4. Crecimiento de Ventas % vs. Período Anterior
**Endpoint:** `GET /estadisticas/crecimiento-ventas`

**Parámetros:**
- `periodo` (opcional): Días del período a analizar (default: 30)

**Respuesta:**
```json
{
  "ventas_actual": 15000.00,
  "ventas_anterior": 12000.00,
  "crecimiento_porcentual": 25.0,
  "periodo_dias": 30
}
```

### 5. Pedidos por Día/Semana/Mes
**Endpoint:** `GET /estadisticas/pedidos-por-periodo`

**Parámetros:**
- `periodo` (opcional): "dia", "semana", "mes" (default: "dia")
- `limite` (opcional): Número de períodos a mostrar (default: 30)

**Respuesta:**
```json
[
  {
    "periodo": "2024-01-15",
    "total_pedidos": 45,
    "tipo_periodo": "dia"
  }
]
```

### 6. Ticket Promedio (AOV - Average Order Value)
**Endpoint:** `GET /estadisticas/ticket-promedio`

**Parámetros:**
- `periodo` (opcional): Días del período a analizar (default: 30)

**Respuesta:**
```json
{
  "ticket_promedio": 85.50,
  "total_pedidos": 150,
  "ingresos_totales": 12825.00,
  "periodo_dias": 30
}
```

### 7. Tasa de Repetición (Clientes que compraron ≥2 veces)
**Endpoint:** `GET /estadisticas/tasa-repeticion`

**Parámetros:**
- `periodo` (opcional): Días del período a analizar (default: 30)

**Respuesta:**
```json
{
  "total_clientes": 100,
  "clientes_con_repeticion": 35,
  "tasa_repeticion": 35.0,
  "periodo_dias": 30
}
```

### 8. Nuevos vs. Recurrentes
**Endpoint:** `GET /estadisticas/nuevos-vs-recurrentes`

**Parámetros:**
- `periodo` (opcional): Días del período a analizar (default: 30)

**Respuesta:**
```json
{
  "total_clientes": 100,
  "clientes_nuevos": 40,
  "clientes_recurrentes": 60,
  "porcentaje_nuevos": 40.0,
  "porcentaje_recurrentes": 60.0,
  "periodo_dias": 30
}
```

### 9. Resumen General de KPIs
**Endpoint:** `GET /estadisticas/`

**Parámetros:**
- `periodo` (opcional): Días del período a analizar (default: 30)

**Respuesta:**
```json
{
  "periodo_dias": 30,
  "ingresos_totales": 15000.00,
  "total_pedidos": 150,
  "total_clientes": 100,
  "ticket_promedio": 100.00,
  "kpis_disponibles": [
    "top-productos-vendidos",
    "ingresos-por-periodo",
    "clientes-por-periodo",
    "crecimiento-ventas",
    "pedidos-por-periodo",
    "ticket-promedio",
    "tasa-repeticion",
    "nuevos-vs-recurrentes"
  ]
}
```

## Ejemplos de Uso

### Obtener los 5 productos más vendidos:
```
GET /estadisticas/top-productos-vendidos?limite=5
```

### Obtener ingresos por semana de los últimos 12 períodos:
```
GET /estadisticas/ingresos-por-periodo?periodo=semana&limite=12
```

### Obtener crecimiento de ventas de los últimos 7 días:
```
GET /estadisticas/crecimiento-ventas?periodo=7
```

### Obtener clientes por mes de los últimos 6 meses:
```
GET /estadisticas/clientes-por-periodo?periodo=mes&limite=6
```

## Notas Importantes

1. **Estados de Pedidos:** Todos los KPIs consideran solo pedidos con estado 'COMPLETADO' o 'ENTREGADO'
2. **Fechas:** Los períodos se calculan desde la fecha actual hacia atrás
3. **Formato de Fechas:** 
   - Día: YYYY-MM-DD
   - Semana: YYYY-WW (año-semana)
   - Mes: YYYY-MM (año-mes)
4. **Redondeo:** Los porcentajes se redondean a 2 decimales
5. **Performance:** Las consultas están optimizadas para manejar grandes volúmenes de datos

## Beneficios de estos KPIs

- **Top Productos:** Identifica qué ropa se vende más para optimizar inventario
- **Ingresos por Período:** Analiza tendencias de ventas temporales
- **Clientes por Período:** Mide el crecimiento de la base de clientes
- **Crecimiento:** Compara rendimiento vs. períodos anteriores
- **Pedidos por Período:** Analiza la actividad de pedidos
- **Ticket Promedio:** Optimiza estrategias de precios
- **Tasa de Repetición:** Mide la fidelización de clientes
- **Nuevos vs. Recurrentes:** Analiza la composición de la base de clientes




