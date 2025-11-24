# Design Document - Sistema de Gestión de Asignaciones

## Overview

El sistema de gestión de asignaciones es una aplicación web que permite visualizar, editar y eliminar asignaciones de elementos a cuentadantes. La aplicación utiliza una arquitectura cliente-servidor con frontend en HTML/JavaScript/Bootstrap y backend en Node.js con PostgreSQL.

## Architecture

### Technology Stack

- **Frontend**: HTML5, CSS3, Bootstrap 5, JavaScript (Vanilla)
- **Backend**: Node.js con Express.js
- **Database**: PostgreSQL
- **Communication**: REST API con JSON

### Application Structure

```
/
├── index.html                       # Página principal (opcional)
└── src/
    ├── api/
    │   └── asignaciones.js             # Endpoints REST para asignaciones
    ├── asignaciones/
    │   ├── listar_asignaciones.html    # Página principal con tabla y modales
    │   ├── editar_asignaciones.html    # (Ya existe - puede integrarse)
    │   ├── eliminar_asignaciones.html  # (Ya existe - puede integrarse)
    │   └── crear_asignaciones.html     # (Ya existe)
    ├── cuentadante/                    # Gestión de cuentadantes
    ├── elemento/                       # Gestión de elementos
    ├── ambiente/                       # Gestión de ambientes (futuro)
    ├── marca/                          # Gestión de marcas (futuro)
    ├── rol/                            # Gestión de roles (futuro)
    ├── config/
    │   └── conexion.js                 # Módulo de conexión a PostgreSQL
    └── assets/
        ├── css/                        # Estilos personalizados
        ├── js/
        │   └── asignaciones.js         # Lógica del cliente para asignaciones
        ├── img/                        # Imágenes
        └── icon/                       # Iconos
```

## Components and Interfaces

### 1. Database Layer

#### Connection Module (src/config/conexion.js)

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'bd_elementos',
  user: 'postgres',
  password: 'password'
});

module.exports = pool;
```

#### Database Schema

Tablas involucradas:
- **PERSONA**: pers_documento (PK), pers_nombres, pers_apellidos, pers_telefono
- **ROL**: rol_id (PK), rol_nombre
- **ROL_PERSONA**: Relación entre PERSONA y ROL
- **ELEMENTO**: elem_placa (PK), elem_modelo, MARCA_marc_id
- **MARCA**: marc_id (PK), marc_nombre
- **AMBIENTE**: amb_id (PK), amb_nombre
- **ASIGNACION**: ELEMENTO_elem_placa (FK), AMBIENTE_amb_id (FK), RQ_PERSONA_ROL_rol_id (FK), RQ_ASIGNACION_PERSONA_pers_documento (FK), fecha_asignacion

### 2. Backend API Layer

#### REST Endpoints

**GET /api/asignaciones**
- Retorna todas las asignaciones con información completa
- Query SQL:
```sql
SELECT 
  p.pers_documento,
  p.pers_nombres,
  p.pers_apellidos,
  p.pers_telefono,
  r.rol_nombre,
  m.marc_nombre,
  e.elem_placa,
  e.elem_modelo,
  a.AMBIENTE_amb_id,
  a.RQ_PERSONA_ROL_rol_id
FROM ASIGNACION a
JOIN PERSONA p ON a.RQ_ASIGNACION_PERSONA_pers_documento = p.pers_documento
JOIN ROL_PERSONA rp ON a.RQ_PERSONA_ROL_rol_id = rp.ROL_rol_id 
  AND rp.PERSONA_pers_documento = p.pers_documento
JOIN ROL r ON rp.ROL_rol_id = r.rol_id
JOIN ELEMENTO e ON a.ELEMENTO_elem_placa = e.elem_placa
JOIN MARCA m ON e.MARCA_marc_id = m.marc_id
ORDER BY p.pers_apellidos, p.pers_nombres;
```

**PUT /api/asignaciones/:elem_placa**
- Actualiza una asignación existente
- Body: { pers_documento, rol_id, amb_id }
- Query SQL:
```sql
UPDATE ASIGNACION
SET RQ_ASIGNACION_PERSONA_pers_documento = $1,
    RQ_PERSONA_ROL_rol_id = $2,
    AMBIENTE_amb_id = $3
WHERE ELEMENTO_elem_placa = $4;
```

**DELETE /api/asignaciones/:elem_placa**
- Elimina una asignación
- Query SQL:
```sql
DELETE FROM ASIGNACION
WHERE ELEMENTO_elem_placa = $1;
```

**GET /api/personas**
- Retorna lista de personas para el selector del modal de edición

**GET /api/roles**
- Retorna lista de roles para el selector del modal de edición

**GET /api/ambientes**
- Retorna lista de ambientes para el selector del modal de edición

### 3. Frontend Layer

#### Implementation Approach

**Modales Integrados**: Todo en `listar_asignaciones.html`
- Los modales de edición y eliminación se definen como componentes Bootstrap dentro del mismo HTML
- Los botones "Editar" y "Eliminar" en cada fila de la tabla llaman funciones JavaScript que:
  1. Cargan los datos de la fila seleccionada
  2. Abren el modal correspondiente usando Bootstrap Modal API
  3. No requieren navegación a otras páginas
- Los archivos `editar_asignaciones.html` y `eliminar_asignaciones.html` pueden eliminarse o usarse para otras funcionalidades futuras

#### Main Page (src/asignaciones/listar_asignaciones.html)

**Structure:**
```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gestión de Asignaciones</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
</head>
<body>
  <div class="container mt-4">
    <h1>Gestión de Asignaciones</h1>
    
    <!-- Tabla de Asignaciones -->
    <div class="table-responsive">
      <table class="table table-striped table-hover" id="tablaAsignaciones">
        <thead>
          <tr>
            <th>Documento</th>
            <th>Nombres</th>
            <th>Apellidos</th>
            <th>Teléfono</th>
            <th>Rol</th>
            <th>Marca</th>
            <th>Placa</th>
            <th>Modelo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <!-- Datos cargados dinámicamente -->
        </tbody>
      </table>
    </div>
  </div>

  <!-- Modal de Edición -->
  <div class="modal fade" id="modalEditar" tabindex="-1">
    <!-- Contenido del modal -->
  </div>

  <!-- Modal de Eliminación -->
  <div class="modal fade" id="modalEliminar" tabindex="-1">
    <!-- Contenido del modal -->
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  <script src="../assets/js/asignaciones.js"></script>
</body>
</html>
```

#### Client-Side JavaScript (src/assets/js/asignaciones.js)

**Key Functions:**

1. **cargarAsignaciones()**: Carga y renderiza la tabla desde la API
2. **abrirModalEditar(elem_placa)**: 
   - Obtiene datos de la fila seleccionada
   - Carga listas de personas, roles y ambientes
   - Pre-llena el formulario del modal
   - Abre el modal usando `new bootstrap.Modal(document.getElementById('modalEditar')).show()`
3. **guardarEdicion()**: Envía PUT request a `/api/asignaciones/:elem_placa` y refresca tabla
4. **abrirModalEliminar(elem_placa)**: 
   - Obtiene datos de la fila seleccionada
   - Muestra información en el modal de confirmación
   - Abre el modal usando `new bootstrap.Modal(document.getElementById('modalEliminar')).show()`
5. **confirmarEliminacion()**: Envía DELETE request y refresca tabla
6. **mostrarMensaje(tipo, texto)**: Muestra alertas de éxito/error usando Bootstrap alerts

**Event Listeners:**
- Los botones en cada fila tienen `onclick="abrirModalEditar('12345')"` y `onclick="abrirModalEliminar('12345')"`
- Los botones de guardar/confirmar en modales tienen event listeners para submit

## Data Models

### Assignment Display Model
```javascript
{
  pers_documento: "123456789",
  pers_nombres: "Juan",
  pers_apellidos: "Pérez",
  pers_telefono: "3001234567",
  rol_nombre: "Docente",
  marc_nombre: "HP",
  elem_placa: "12345",
  elem_modelo: "Pavilion 15",
  amb_id: 7,
  rol_id: 2
}
```

### Edit Request Model
```javascript
{
  pers_documento: "987654321",
  rol_id: 3,
  amb_id: 5
}
```

## Error Handling

### Backend Error Responses

```javascript
{
  success: false,
  error: "Mensaje de error descriptivo"
}
```

### Frontend Error Handling

1. **Network Errors**: Mostrar mensaje "Error de conexión con el servidor"
2. **Validation Errors**: Mostrar mensaje específico del servidor
3. **Database Errors**: Mostrar mensaje genérico "Error al procesar la solicitud"

### Error Scenarios

- Asignación no encontrada (404)
- Violación de integridad referencial (409)
- Error de conexión a base de datos (500)
- Datos inválidos en formulario (400)

## Testing Strategy

### Unit Tests

1. **Database Connection**: Verificar conexión exitosa a PostgreSQL
2. **API Endpoints**: Probar cada endpoint con datos válidos e inválidos
3. **Query Validation**: Verificar que las queries SQL retornen datos correctos

### Integration Tests

1. **Full CRUD Flow**: Crear, leer, actualizar y eliminar una asignación
2. **Modal Interactions**: Verificar apertura/cierre de modales
3. **Table Refresh**: Verificar que la tabla se actualiza después de operaciones

### Manual Testing Checklist

- [ ] Tabla carga correctamente al abrir la página
- [ ] Botón editar abre modal con datos correctos
- [ ] Edición actualiza la asignación y refresca la tabla
- [ ] Botón eliminar abre modal de confirmación
- [ ] Eliminación remueve la asignación y refresca la tabla
- [ ] Cancelar en modales no realiza cambios
- [ ] Mensajes de éxito/error se muestran correctamente
- [ ] Diseño responsivo funciona en móvil, tablet y desktop
- [ ] Iconos de Bootstrap se muestran correctamente

## UI/UX Considerations

### Bootstrap Components Used

- **Table**: `.table`, `.table-striped`, `.table-hover`, `.table-responsive`
- **Buttons**: `.btn`, `.btn-primary`, `.btn-danger`, `.btn-secondary`
- **Icons**: `.bi-pencil-square`, `.bi-trash`
- **Modals**: `.modal`, `.modal-dialog`, `.modal-content`
- **Forms**: `.form-control`, `.form-select`, `.form-label`
- **Alerts**: `.alert`, `.alert-success`, `.alert-danger`

### Responsive Design

- Tabla con scroll horizontal en pantallas pequeñas
- Modales centrados y adaptables
- Botones de acción con iconos visibles en todos los tamaños

### Accessibility

- Labels asociados a inputs
- Atributos ARIA en modales
- Contraste de colores adecuado
- Navegación por teclado funcional

## Security Considerations

1. **SQL Injection Prevention**: Usar prepared statements con parámetros
2. **Input Validation**: Validar datos en backend antes de ejecutar queries
3. **Error Messages**: No exponer detalles de la base de datos al cliente
4. **CORS**: Configurar correctamente para permitir solo orígenes autorizados

## Performance Optimization

1. **Database Indexing**: Asegurar índices en claves foráneas
2. **Connection Pooling**: Usar pool de conexiones de pg
3. **Lazy Loading**: Cargar datos solo cuando sea necesario
4. **Caching**: Considerar cache para listas de personas, roles y ambientes
