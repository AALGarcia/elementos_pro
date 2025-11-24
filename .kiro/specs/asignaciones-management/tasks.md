# Implementation Plan

- [x] 1. Configurar conexión a base de datos PostgreSQL





  - Implementar módulo de conexión en `src/config/conexion.js` con pool de conexiones
  - Configurar parámetros de conexión (host, port, database, user, password)
  - _Requirements: 1.2, 2.3, 3.3_

- [x] 2. Crear API REST para gestión de asignaciones






- [x] 2.1 Implementar endpoint GET /api/asignaciones

  - Crear archivo `src/api/asignaciones.js` con Express router
  - Escribir query SQL con JOINs para obtener datos de ASIGNACION, PERSONA, ROL, ELEMENTO y MARCA
  - Retornar JSON con todas las asignaciones
  - _Requirements: 1.1, 1.2_


- [x] 2.2 Implementar endpoint PUT /api/asignaciones/:elem_placa

  - Crear ruta PUT que reciba elem_placa como parámetro
  - Validar datos recibidos (pers_documento, rol_id, amb_id)
  - Ejecutar UPDATE query en tabla ASIGNACION
  - Retornar respuesta de éxito o error
  - _Requirements: 2.3, 2.4, 2.5_



- [x] 2.3 Implementar endpoint DELETE /api/asignaciones/:elem_placa




  - Crear ruta DELETE que reciba elem_placa como parámetro
  - Ejecutar DELETE query en tabla ASIGNACION
  - Retornar respuesta de éxito o error


  - _Requirements: 3.3, 3.4, 3.5_

- [x] 2.4 Implementar endpoints auxiliares para selectores





  - Crear GET /api/personas para obtener lista de cuentadantes
  - Crear GET /api/roles para obtener lista de roles
  - Crear GET /api/ambientes para obtener lista de ambientes
  - _Requirements: 2.2_

- [x] 3. Desarrollar página principal con tabla de asignaciones






- [x] 3.1 Crear estructura HTML en listar_asignaciones.html

  - Agregar enlaces a Bootstrap CSS y Bootstrap Icons
  - Crear contenedor con título "Gestión de Asignaciones"
  - Implementar tabla responsiva con columnas: Documento, Nombres, Apellidos, Teléfono, Rol, Marca, Placa, Modelo, Acciones
  - Agregar tbody vacío para carga dinámica de datos
  - _Requirements: 1.1, 1.3, 5.1, 5.3_


- [x] 3.2 Agregar botones de acción en tabla





  - Implementar columna "Acciones" con botones Editar y Eliminar
  - Usar iconos de Bootstrap (bi-pencil-square y bi-trash)
  - Agregar atributos onclick con funciones JavaScript
  - _Requirements: 1.4, 5.2_

- [x] 4. Implementar modal de edición integrado




- [x] 4.1 Crear estructura del modal de edición


  - Agregar modal Bootstrap con id "modalEditar" en listar_asignaciones.html
  - Crear formulario con campos: select de personas, select de roles, select de ambientes
  - Mostrar placa del elemento como campo de solo lectura
  - Agregar botones "Guardar" y "Cancelar"
  - _Requirements: 2.1, 2.2, 4.1_

- [x] 4.2 Implementar lógica de apertura del modal de edición


  - Crear función `abrirModalEditar(elem_placa)` en asignaciones.js
  - Obtener datos de la fila seleccionada
  - Cargar listas de personas, roles y ambientes desde API
  - Pre-llenar formulario con datos actuales
  - Abrir modal usando Bootstrap Modal API
  - _Requirements: 2.1, 4.2, 4.3_

- [x] 4.3 Implementar guardado de edición


  - Crear función `guardarEdicion()` en asignaciones.js
  - Validar datos del formulario
  - Enviar PUT request a /api/asignaciones/:elem_placa
  - Cerrar modal si la operación es exitosa
  - Refrescar tabla de asignaciones
  - Mostrar mensaje de éxito
  - _Requirements: 2.3, 2.4, 2.5_

- [x] 5. Implementar modal de eliminación integrado







- [x] 5.1 Crear estructura del modal de eliminación

  - Agregar modal Bootstrap con id "modalEliminar" en listar_asignaciones.html
  - Mostrar información del cuentadante y elemento a eliminar
  - Agregar mensaje de confirmación
  - Agregar botones "Confirmar" y "Cancelar"

  - _Requirements: 3.1, 3.2, 4.1_

- [x] 5.2 Implementar lógica de apertura del modal de eliminación

  - Crear función `abrirModalEliminar(elem_placa)` en asignaciones.js
  - Obtener datos de la fila seleccionada
  - Mostrar información en el modal
  - Abrir modal usando Bootstrap Modal API
  - _Requirements: 3.1, 3.2, 4.2, 4.3_

- [x] 5.3 Implementar confirmación de eliminación


  - Crear función `confirmarEliminacion()` en asignaciones.js
  - Enviar DELETE request a /api/asignaciones/:elem_placa
  - Cerrar modal si la operación es exitosa
  - Refrescar tabla de asignaciones
  - Mostrar mensaje de éxito
  - Implementar cancelación sin cambios
  - _Requirements: 3.3, 3.4, 3.5, 3.6_

- [x] 6. Implementar carga y renderizado de tabla





- [x] 6.1 Crear función de carga de asignaciones


  - Implementar función `cargarAsignaciones()` en asignaciones.js
  - Hacer fetch a GET /api/asignaciones
  - Procesar respuesta JSON
  - _Requirements: 1.1, 1.2_

- [x] 6.2 Renderizar datos en tabla


  - Crear función `renderizarTabla(asignaciones)` en asignaciones.js
  - Generar filas HTML dinámicamente con datos de asignaciones
  - Agregar botones de acción con eventos onclick
  - Insertar filas en tbody de la tabla
  - Llamar `cargarAsignaciones()` al cargar la página
  - _Requirements: 1.3, 1.4_

- [x] 7. Implementar sistema de mensajes y manejo de errores




- [x] 7.1 Crear función para mostrar mensajes


  - Implementar función `mostrarMensaje(tipo, texto)` en asignaciones.js
  - Usar alertas de Bootstrap (alert-success, alert-danger)
  - Agregar auto-cierre después de 3 segundos
  - _Requirements: 2.5, 3.5_


- [x] 7.2 Implementar manejo de errores

  - Agregar try-catch en todas las funciones async
  - Manejar errores de red (fetch failures)
  - Manejar errores de validación del servidor
  - Mostrar mensajes de error apropiados al usuario
  - _Requirements: 2.5, 3.5_

- [x] 8. Aplicar estilos y diseño responsivo






- [x] 8.1 Configurar estilos Bootstrap

  - Aplicar clases Bootstrap a tabla (table, table-striped, table-hover)
  - Aplicar clases a botones (btn, btn-primary, btn-danger)
  - Aplicar clases a modales y formularios
  - _Requirements: 4.4, 5.1, 5.4_


- [x] 8.2 Optimizar para dispositivos móviles

  - Agregar clase table-responsive al contenedor de tabla
  - Verificar que modales se adapten a pantallas pequeñas
  - Asegurar que botones sean táctiles en móviles
  - _Requirements: 5.3_

- [-] 9. Integrar y probar funcionalidad completa






- [x] 9.1 Conectar frontend con backend


  - Configurar URLs de API en asignaciones.js
  - Verificar que todas las llamadas fetch funcionen correctamente
  - Probar flujo completo: cargar → editar → eliminar

  - _Requirements: 1.1, 2.3, 3.3_

- [ ] 9.2 Realizar pruebas de integración



  - Verificar que la tabla carga correctamente al abrir la página
  - Probar edición de asignación y verificar actualización en tabla
  - Probar eliminación de asignación y verificar remoción de tabla
  - Verificar que mensajes de éxito/error se muestran correctamente
  - Probar cancelación en modales sin realizar cambios
  - _Requirements: 2.4, 2.5, 3.4, 3.5, 3.6, 4.3_
