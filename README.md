# Sistema de Gestión de Asignaciones

Sistema web para gestionar asignaciones de elementos a cuentadantes con PostgreSQL.

## Requisitos Previos

- Node.js (v14 o superior)
- PostgreSQL (v12 o superior)
- Base de datos `bd_elementos` configurada

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar la base de datos:
   - Editar `src/config/conexion.js` con las credenciales correctas de PostgreSQL
   - Asegurarse de que la base de datos `bd_elementos` existe y tiene las tablas necesarias
   - Ver [CONFIGURACION.md](CONFIGURACION.md) para instrucciones detalladas

3. Verificar la configuración:
```bash
npm test
```

## Ejecución

### Modo Producción
```bash
npm start
```

### Modo Desarrollo (con auto-reload)
```bash
npm run dev
```

El servidor se ejecutará en `http://localhost:3000`

## Estructura del Proyecto

```
/
├── server.js                           # Servidor Express principal
├── package.json                        # Dependencias del proyecto
├── src/
│   ├── api/
│   │   └── asignaciones.js            # Endpoints REST
│   ├── asignaciones/
│   │   └── listar_asignaciones.html   # Interfaz principal
│   ├── assets/
│   │   ├── js/
│   │   │   └── asignaciones.js        # Lógica del cliente
│   │   └── css/
│   │       └── asignaciones.css       # Estilos personalizados
│   └── config/
│       └── conexion.js                # Configuración de PostgreSQL
```

## API Endpoints

### Asignaciones
- `GET /api/asignaciones` - Obtener todas las asignaciones
- `PUT /api/asignaciones/:elem_placa` - Actualizar una asignación
- `DELETE /api/asignaciones/:elem_placa` - Eliminar una asignación

### Personas
- `GET /api/personas` - Obtener lista de personas con roles
- `POST /api/personas` - Crear persona y asignar rol
- `PUT /api/personas/:pers_documento` - Actualizar persona
- `DELETE /api/personas/:pers_documento` - Eliminar persona

### Elementos
- `GET /api/elementos` - Obtener lista de elementos
- `POST /api/elementos` - Crear elemento
- `PUT /api/elementos/:elem_placa` - Actualizar elemento
- `DELETE /api/elementos/:elem_placa` - Eliminar elemento

### Catálogos
- `GET /api/roles` - Obtener lista de roles
- `GET /api/ambientes` - Obtener lista de ambientes
- `GET /api/marcas` - Obtener lista de marcas

## Funcionalidades

### Gestión de Personas
- Crear personas con asignación de rol
- Editar información de personas
- Eliminar personas
- Visualizar personas con sus roles

### Gestión de Elementos
- Crear elementos con marca y estado
- Editar información de elementos
- Eliminar elementos
- Visualizar inventario completo

### Gestión de Asignaciones
- Visualizar todas las asignaciones en una tabla responsiva
- Editar asignaciones mediante modal
- Eliminar asignaciones con confirmación
- Mensajes de éxito/error
- Diseño responsivo con Bootstrap 5

## Tecnologías

- Frontend: HTML5, CSS3, Bootstrap 5, JavaScript
- Backend: Node.js, Express.js
- Base de datos: PostgreSQL
