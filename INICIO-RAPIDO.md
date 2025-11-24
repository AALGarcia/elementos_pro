# 🚀 Inicio Rápido

## Pasos para ejecutar el sistema

### 1️⃣ Instalar dependencias
```bash
npm install
```

### 2️⃣ Configurar base de datos
Edite `src/config/conexion.js` con sus credenciales de PostgreSQL:
```javascript
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'bd_elementos',  // ← Su base de datos
  user: 'postgres',           // ← Su usuario
  password: 'password'        // ← Su contraseña
});
```

### 3️⃣ Verificar configuración (opcional)
```bash
npm test
```

### 4️⃣ Iniciar servidor
```bash
npm start
```

### 5️⃣ Abrir en navegador
```
http://localhost:3000
```

### 6️⃣ Acceder a los módulos
- **Página principal:** `http://localhost:3000`
- **Gestión de Personas:** `http://localhost:3000/personas`
- **Gestión de Elementos:** `http://localhost:3000/elementos`
- **Gestión de Asignaciones:** `http://localhost:3000/asignaciones`

---

## ✅ Checklist Rápido

- [ ] PostgreSQL instalado y corriendo
- [ ] Base de datos `bd_elementos` creada
- [ ] Tablas creadas (PERSONA, ROL, ELEMENTO, MARCA, AMBIENTE, ASIGNACION, ROL_PERSONA)
- [ ] Dependencias instaladas (`npm install`)
- [ ] Credenciales configuradas en `src/config/conexion.js`
- [ ] Servidor iniciado (`npm start`)
- [ ] Navegador abierto en `http://localhost:3000`

---

## 📚 Documentación Adicional

- **Configuración detallada:** [CONFIGURACION.md](CONFIGURACION.md)
- **Pruebas manuales:** [TESTING-CHECKLIST.md](TESTING-CHECKLIST.md)
- **Documentación completa:** [README.md](README.md)

---

## ⚠️ Problemas Comunes

### "Cannot find module 'pg'"
```bash
npm install
```

### "Error al conectar a PostgreSQL"
1. Verificar que PostgreSQL está corriendo
2. Verificar credenciales en `src/config/conexion.js`
3. Verificar que la base de datos existe

### "EADDRINUSE: address already in use"
El puerto 3000 está ocupado. Cambiar puerto en `server.js` o detener el proceso que lo usa.

---

## 🎯 Funcionalidades Principales

### Gestión de Personas
1. **Crear personas** - Con asignación de rol
2. **Editar personas** - Actualizar información
3. **Eliminar personas** - Con confirmación
4. **Ver roles** - Roles asignados a cada persona

### Gestión de Elementos
1. **Crear elementos** - Con marca y estado
2. **Editar elementos** - Actualizar información
3. **Eliminar elementos** - Con confirmación
4. **Ver inventario** - Estado de cada elemento

### Gestión de Asignaciones
1. **Ver asignaciones** - Tabla con todas las asignaciones
2. **Editar asignación** - Botón azul con icono de lápiz
3. **Eliminar asignación** - Botón rojo con icono de basura
4. **Diseño responsivo** - Funciona en móvil, tablet y desktop

---

## 💡 Comandos Útiles

```bash
# Iniciar en modo producción
npm start

# Iniciar en modo desarrollo (auto-reload)
npm run dev

# Ejecutar pruebas de integración
npm test
```
