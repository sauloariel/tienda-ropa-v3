# Configuración de Email para Verificación de Cuentas
# Copia este archivo como .env y configura tus credenciales

# ============================================
# CONFIGURACIÓN SMTP (REQUERIDA)
# ============================================
# Para Gmail:
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-contraseña-de-aplicacion

# Para Outlook/Hotmail:
# SMTP_HOST=smtp-mail.outlook.com
# SMTP_PORT=587
# SMTP_USER=tu-email@outlook.com
# SMTP_PASS=tu-contraseña

# Para Yahoo:
# SMTP_HOST=smtp.mail.yahoo.com
# SMTP_PORT=587
# SMTP_USER=tu-email@yahoo.com
# SMTP_PASS=tu-contraseña-de-aplicacion

# ============================================
# CONFIGURACIÓN DE LA APLICACIÓN
# ============================================
# URL del frontend (donde se redirigirá después de verificar)
FRONTEND_URL=http://localhost:3000

# Nombre de la aplicación (aparecerá en los emails)
APP_NAME=Tienda de Ropa

# ============================================
# CONFIGURACIÓN DE LA BASE DE DATOS (YA EXISTENTE)
# ============================================
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce
DB_USER=postgres
DB_PASSWORD=123

# ============================================
# CONFIGURACIÓN DEL SERVIDOR (YA EXISTENTE)
# ============================================
PORT=4000
JWT_SECRET=tu-jwt-secret-aqui

# ============================================
# INSTRUCCIONES PARA CONFIGURAR GMAIL
# ============================================
# 1. Ve a tu cuenta de Gmail
# 2. Activa la verificación en 2 pasos
# 3. Genera una "Contraseña de aplicación" específica para esta app
# 4. Usa esa contraseña en SMTP_PASS (no tu contraseña normal)
# 5. Asegúrate de que SMTP_USER sea tu email completo de Gmail

