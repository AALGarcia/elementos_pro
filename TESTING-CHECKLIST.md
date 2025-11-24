# Lista de Verificación de Pruebas de Integración

## Requisitos Previos
- [ ] Base de datos PostgreSQL configurada y en ejecución
- [ ] Dependencias instaladas (`npm install`)
- [ ] Servidor iniciado (`npm start`)

## Pruebas Automatizadas

### Ejecutar Script de Pruebas
```bash
npm test
```

El script verificará:
- ✓ Conexión a la base de datos
- ✓ Existencia de todas las tablas necesarias
- ✓ Consulta GET de asignaciones
- ✓ Consultas auxiliares (personas, roles, ambientes)
- ✓ Actualización PUT de asignaciones
- ✓ Eliminación DELETE de asignaciones

## Pruebas Manuales en el Navegador

### 1. Carga Inicial de la Tabla
**Requisito: 1.1, 1.2**

- [ ] Abrir `http://localhost:3000/src/asignaciones/listar_asignaciones.html`
- [ ] Verificar que la tabla carga correctamente
- [ ] Verificar que se muestran todas las columnas:
  - Documento
  - Nombres
  - Apellidos
  - Teléfono
  - Rol
  - Marca
  - Placa
  - Modelo
  - Acciones
- [ ] Verificar que los datos se cargan desde la API
- [ ] Verificar que no hay errores en la consola del navegador

**Resultado esperado:** Tabla con todas las asignaciones de la base de datos

---

### 2. Edición de Asignación
**Requisitos: 2.1, 2.2, 2.3, 2.4, 2.5, 4.2, 4.3**

#### 2.1 Abrir Modal de Edición
- [ ] Hacer clic en el botón de editar (icono de lápiz) en cualquier fila
- [ ] Verificar que el modal se abre correctamente
- [ ] Verificar que el título es "Editar Asignación"
- [ ] Verificar que el campo de placa está pre-llenado y es de solo lectura
- [ ] Verificar que los selectores de persona, rol y ambiente están cargados
- [ ] Verificar que los valores actuales están pre-seleccionados

**Resultado esperado:** Modal abierto con datos correctos

#### 2.2 Guardar Edición
- [ ] Cambiar el cuentadante seleccionado
- [ ] Cambiar el rol seleccionado
- [ ] Cambiar el ambiente seleccionado
- [ ] Hacer clic en "Guardar"
- [ ] Verificar que aparece mensaje de éxito
- [ ] Verificar que el modal se cierra automáticamente
- [ ] Verificar que la tabla se actualiza con los nuevos datos
- [ ] Verificar que los cambios persisten al recargar la página

**Resultado esperado:** Asignación actualizada correctamente

#### 2.3 Cancelar Edición
- [ ] Abrir modal de edición
- [ ] Cambiar algunos valores
- [ ] Hacer clic en "Cancelar"
- [ ] Verificar que el modal se cierra
- [ ] Verificar que no se realizaron cambios en la tabla

**Resultado esperado:** Sin cambios realizados

#### 2.4 Validación de Formulario
- [ ] Abrir modal de edición
- [ ] Dejar un campo vacío
- [ ] Intentar guardar
- [ ] Verificar que aparece mensaje de error

**Resultado esperado:** Mensaje "Por favor complete todos los campos"

---

### 3. Eliminación de Asignación
**Requisitos: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 4.2, 4.3**

#### 3.1 Abrir Modal de Eliminación
- [ ] Hacer clic en el botón de eliminar (icono de basura) en cualquier fila
- [ ] Verificar que el modal se abre correctamente
- [ ] Verificar que el título es "Eliminar Asignación"
- [ ] Verificar que se muestra la información del cuentadante:
  - Documento
  - Nombre completo
  - Rol
- [ ] Verificar que se muestra la información del elemento:
  - Placa
  - Marca
  - Modelo
- [ ] Verificar que hay un mensaje de advertencia
- [ ] Verificar que dice "Esta acción no se puede deshacer"

**Resultado esperado:** Modal con información correcta de la asignación

#### 3.2 Confirmar Eliminación
- [ ] Hacer clic en "Confirmar"
- [ ] Verificar que aparece mensaje de éxito
- [ ] Verificar que el modal se cierra automáticamente
- [ ] Verificar que la fila desaparece de la tabla
- [ ] Verificar que los cambios persisten al recargar la página

**Resultado esperado:** Asignación eliminada correctamente

#### 3.3 Cancelar Eliminación
- [ ] Abrir modal de eliminación
- [ ] Hacer clic en "Cancelar"
- [ ] Verificar que el modal se cierra
- [ ] Verificar que la asignación sigue en la tabla

**Resultado esperado:** Sin cambios realizados

---

### 4. Mensajes de Éxito/Error
**Requisitos: 2.5, 3.5**

#### 4.1 Mensajes de Éxito
- [ ] Editar una asignación exitosamente
- [ ] Verificar que aparece alerta verde con icono de check
- [ ] Verificar que el mensaje dice "Asignación actualizada exitosamente"
- [ ] Verificar que el mensaje desaparece después de 3 segundos
- [ ] Eliminar una asignación exitosamente
- [ ] Verificar que aparece mensaje "Asignación eliminada exitosamente"

**Resultado esperado:** Mensajes claros y auto-cerrados

#### 4.2 Mensajes de Error
- [ ] Desconectar la base de datos o detener el servidor
- [ ] Intentar cargar la página
- [ ] Verificar que aparece mensaje de error de conexión
- [ ] Intentar editar una asignación
- [ ] Verificar que aparece mensaje de error apropiado

**Resultado esperado:** Mensajes de error informativos

---

### 5. Diseño Responsivo
**Requisitos: 5.1, 5.2, 5.3, 5.4**

#### 5.1 Vista Desktop (> 992px)
- [ ] Abrir en pantalla grande
- [ ] Verificar que la tabla se ve completa
- [ ] Verificar que todos los botones son visibles
- [ ] Verificar que los modales están centrados

**Resultado esperado:** Diseño óptimo en desktop

#### 5.2 Vista Tablet (768px - 992px)
- [ ] Redimensionar ventana a tamaño tablet
- [ ] Verificar que la tabla tiene scroll horizontal si es necesario
- [ ] Verificar que los botones son accesibles
- [ ] Verificar que los modales se adaptan

**Resultado esperado:** Diseño funcional en tablet

#### 5.3 Vista Mobile (< 768px)
- [ ] Redimensionar ventana a tamaño móvil
- [ ] Verificar que la tabla tiene scroll horizontal
- [ ] Verificar que los botones son táctiles (suficientemente grandes)
- [ ] Verificar que los modales ocupan la pantalla apropiadamente
- [ ] Verificar que los formularios son usables

**Resultado esperado:** Diseño funcional en móvil

---

### 6. Iconos y Estilos Bootstrap
**Requisitos: 5.1, 5.2**

- [ ] Verificar que el icono de lápiz aparece en botón de editar
- [ ] Verificar que el icono de basura aparece en botón de eliminar
- [ ] Verificar que la tabla tiene estilos striped y hover
- [ ] Verificar que los botones tienen colores apropiados:
  - Editar: azul (btn-primary)
  - Eliminar: rojo (btn-danger)
  - Cancelar: gris (btn-secondary)
- [ ] Verificar que los modales tienen estilos Bootstrap

**Resultado esperado:** Interfaz consistente con Bootstrap

---

### 7. Manejo de Estados de Modal
**Requisitos: 4.1, 4.2, 4.3**

- [ ] Abrir modal de edición
- [ ] Cerrar con X
- [ ] Abrir modal de eliminación
- [ ] Cerrar con X
- [ ] Verificar que solo un modal está visible a la vez
- [ ] Abrir modal de edición
- [ ] Cerrar con "Cancelar"
- [ ] Abrir modal de eliminación
- [ ] Verificar que no hay datos del modal anterior

**Resultado esperado:** Modales independientes sin conflictos

---

### 8. Flujo Completo: Cargar → Editar → Eliminar
**Requisitos: 1.1, 2.3, 3.3**

- [ ] Cargar la página
- [ ] Verificar que la tabla carga correctamente
- [ ] Seleccionar una asignación y editarla
- [ ] Verificar que se actualiza correctamente
- [ ] Seleccionar la misma asignación y eliminarla
- [ ] Verificar que se elimina correctamente
- [ ] Recargar la página
- [ ] Verificar que los cambios persisten

**Resultado esperado:** Flujo completo funcional

---

## Pruebas de Errores y Edge Cases

### 9.1 Error de Conexión
- [ ] Detener el servidor
- [ ] Intentar cargar la página
- [ ] Verificar mensaje: "Error de conexión con el servidor"

### 9.2 Asignación No Encontrada
- [ ] Editar una asignación
- [ ] Mientras el modal está abierto, eliminar la asignación desde otro navegador
- [ ] Intentar guardar
- [ ] Verificar mensaje de error apropiado

### 9.3 Datos Inválidos
- [ ] Intentar editar con valores inválidos
- [ ] Verificar que se muestra mensaje de error

---

## Resumen de Resultados

### Pruebas Pasadas: _____ / _____
### Pruebas Fallidas: _____

### Notas Adicionales:
```
[Espacio para notas sobre problemas encontrados o mejoras sugeridas]
```

---

## Firma de Aprobación

**Probado por:** ___________________  
**Fecha:** ___________________  
**Estado:** [ ] Aprobado  [ ] Requiere correcciones
