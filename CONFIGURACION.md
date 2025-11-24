# Guía de Configuración del Sistema

## 1. Configuración de la Base de Datos

### Paso 1: Verificar PostgreSQL
Asegúrese de que PostgreSQL está instalado y en ejecución:
```bash
# Windows
pg_ctl status

# O verificar el servicio
services.msc
# Buscar "postgresql" y verificar que está en ejecución
```

### Paso 2: Configurar Credenciales
Edite el archivo `src/config/conexion.js` con sus credenciales de PostgreSQL:

```javascript
const pool = new Pool({
  host: 'localhost',        // Cambiar si PostgreSQL está en otro servidor
  port: 5432,               // Puerto por defecto de PostgreSQL
  database: 'bd_elementos', // Nombre de su base de datos
  user: 'postgres',         // Su usuario de PostgreSQL
  password: 'password'      // Su contraseña de PostgreSQL
});
```

### Paso 3: Verificar la Base de Datos
La base de datos debe tener las siguientes tablas:

1. **PERSONA**
   - pers_documento (PK)
   - pers_nombres
   - pers_apellidos
   - pers_telefono

2. **ROL**
   - rol_id (PK)
   - rol_nombre

3. **ROL_PERSONA**
   - ROL_rol_id (FK)
   - PERSONA_pers_documento (FK)

4. **MARCA**
   - marc_id (PK)
   - marc_nombre

5. **ELEMENTO**
   - elem_placa (PK)
   - elem_modelo
   - MARCA_marc_id (FK)

6. **AMBIENTE**
   - amb_id (PK)
   - amb_nombre

7. **ASIGNACION**
   - ELEMENTO_elem_placa (FK)
   - AMBIENTE_amb_id (FK)
   - RQ_PERSONA_ROL_rol_id (FK)
   - RQ_ASIGNACION_PERSONA_pers_documento (FK)
   - fecha_asignacion

## 2. Instalación de Dependencias

```bash
npm install
```

Esto instalará:
- express: Framework web para Node.js
- pg: Cliente de PostgreSQL para Node.js
- nodemon: Herramienta de desarrollo (opcional)

## 3. Verificar la Configuración

Ejecute el script de pruebas de integración:
```bash
npm test
```

Este script verificará:
- ✓ Conexión a la base de datos
- ✓ Existencia de todas las tablas
- ✓ Consultas SQL funcionando correctamente
- ✓ Datos de prueba disponibles

## 4. Iniciar el Servidor

### Modo Producción
```bash
npm start
```

### Modo Desarrollo (con auto-reload)
```bash
npm run dev
```

El servidor estará disponible en: `http://localhost:3000`

## 5. Acceder a la Aplicación

Abra su navegador y vaya a:
```
http://localhost:3000/src/asignaciones/listar_asignaciones.html
```

O simplemente:
```
http://localhost:3000
```

## Solución de Problemas

### Error: "Cannot find module 'pg'"
**Solución:** Ejecute `npm install`

### Error: "Error al conectar a PostgreSQL"
**Posibles causas:**
1. PostgreSQL no está en ejecución
2. Credenciales incorrectas en `src/config/conexion.js`
3. Base de datos no existe
4. Firewall bloqueando la conexión

**Solución:**
1. Verificar que PostgreSQL está corriendo
2. Verificar credenciales en `src/config/conexion.js`
3. Crear la base de datos si no existe:
   ```sql
   CREATE DATABASE bd_elementos;
   ```

### Error: "Tabla no existe"
**Solución:** Crear las tablas necesarias en la base de datos según el esquema descrito arriba

### Error: "EADDRINUSE: address already in use"
**Solución:** El puerto 3000 ya está en uso. Opciones:
1. Detener el proceso que usa el puerto 3000
2. Cambiar el puerto en `server.js`:
   ```javascript
   const PORT = process.env.PORT || 3001; // Cambiar a otro puerto
   ```

### La tabla no carga datos
**Verificar:**
1. Abrir la consola del navegador (F12)
2. Ver si hay errores de red
3. Verificar que el servidor está corriendo
4. Verificar que hay datos en la tabla ASIGNACION

## Variables de Entorno (Opcional)

Para mayor seguridad, puede usar variables de entorno:

1. Crear archivo `.env` en la raíz del proyecto:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bd_elementos
DB_USER=postgres
DB_PASSWORD=su_contraseña_segura
PORT=3000
```

2. Instalar dotenv:
```bash
npm install dotenv
```

3. Modificar `src/config/conexion.js`:
```javascript
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});
```

4. Agregar `.env` al `.gitignore` para no subir credenciales al repositorio

## Contacto y Soporte

Si encuentra problemas adicionales, revise:
1. Los logs del servidor en la consola
2. Los logs de PostgreSQL
3. La consola del navegador (F12)
