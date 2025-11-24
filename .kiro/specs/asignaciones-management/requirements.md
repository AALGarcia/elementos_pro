# Requirements Document

## Introduction

Este documento define los requisitos para el sistema de gestión de asignaciones de elementos a cuentadantes. El sistema permitirá visualizar, editar y eliminar asignaciones de elementos (bienes) a personas con roles específicos, mostrando información completa del cuentadante y del elemento asignado en una tabla interactiva.

## Glossary

- **Sistema de Asignaciones**: La aplicación web que gestiona las asignaciones de elementos a cuentadantes
- **Cuentadante**: Persona responsable de un elemento o bien institucional (tabla PERSONA)
- **Elemento**: Bien o activo institucional que puede ser asignado a un cuentadante (tabla ELEMENTO)
- **Marca**: Fabricante o marca del elemento (tabla MARCA)
- **Rol**: Función o cargo de la persona en la institución (tabla ROL)
- **Ambiente**: Ubicación física donde se encuentra el elemento (tabla AMBIENTE)
- **Asignación**: Relación entre un elemento, un cuentadante, un rol y un ambiente (tabla ASIGNACION)
- **Modal de Edición**: Ventana emergente que permite modificar los datos de una asignación existente
- **Modal de Eliminación**: Ventana emergente que solicita confirmación antes de eliminar una asignación
- **Tabla de Asignaciones**: Componente visual que muestra todas las asignaciones en formato tabular

## Requirements

### Requirement 1

**User Story:** Como administrador del sistema, quiero visualizar todas las asignaciones en una tabla, para poder revisar qué elementos están asignados a cada cuentadante

#### Acceptance Criteria

1. THE Sistema de Asignaciones SHALL display a table containing all assignment records from the ASIGNACION table joined with PERSONA, ELEMENTO, MARCA, and ROL tables
2. WHEN the page loads, THE Sistema de Asignaciones SHALL execute a SELECT query retrieving pers_documento, pers_nombres, pers_apellidos, pers_telefono, rol_nombre, marc_nombre, elem_placa, and elem_modelo for each assignment
3. THE Sistema de Asignaciones SHALL display each assignment as a row in the table with columns for person information (documento, nombres, apellidos, telefono, rol) and element information (marca, placa, modelo)
4. THE Sistema de Asignaciones SHALL include action buttons (edit and delete) with Bootstrap icons in each table row

### Requirement 2

**User Story:** Como administrador del sistema, quiero editar una asignación existente mediante un modal, para poder actualizar el cuentadante responsable de un elemento

#### Acceptance Criteria

1. WHEN the user clicks the edit button on a table row, THE Sistema de Asignaciones SHALL open the Modal de Edición with the current assignment data pre-populated
2. THE Modal de Edición SHALL display form fields for selecting a new cuentadante (RQ_ASIGNACION_PERSONA_pers_documento), rol (RQ_PERSONA_ROL_rol_id), and ambiente (AMBIENTE_amb_id) while showing the element placa as read-only
3. WHEN the user submits the edit form, THE Sistema de Asignaciones SHALL execute an UPDATE query on the ASIGNACION table to modify RQ_ASIGNACION_PERSONA_pers_documento, RQ_PERSONA_ROL_rol_id, and AMBIENTE_amb_id for the specified ELEMENTO_elem_placa
4. IF the update is successful, THEN THE Sistema de Asignaciones SHALL close the modal and refresh the table to show the updated assignment
5. THE Sistema de Asignaciones SHALL display a success message after successfully updating an assignment

### Requirement 3

**User Story:** Como administrador del sistema, quiero eliminar una asignación mediante un modal de confirmación, para poder dar de baja elementos o corregir asignaciones incorrectas

#### Acceptance Criteria

1. WHEN the user clicks the delete button on a table row, THE Sistema de Asignaciones SHALL open the Modal de Eliminación showing the assignment details
2. THE Modal de Eliminación SHALL display the cuentadante name and element information for confirmation
3. WHEN the user confirms deletion, THE Sistema de Asignaciones SHALL execute a DELETE query for the specified ELEMENTO_elem_placa in the ASIGNACION table
4. IF the deletion is successful, THEN THE Sistema de Asignaciones SHALL close the modal and refresh the table to remove the deleted assignment
5. THE Sistema de Asignaciones SHALL display a success message after successfully deleting an assignment
6. WHEN the user cancels the deletion, THE Sistema de Asignaciones SHALL close the modal without making any changes

### Requirement 4

**User Story:** Como administrador del sistema, quiero que los modales de edición y eliminación sean independientes, para poder tener una interfaz clara y sin conflictos entre operaciones

#### Acceptance Criteria

1. THE Sistema de Asignaciones SHALL implement separate modal components for edit and delete operations
2. THE Sistema de Asignaciones SHALL ensure only one modal is visible at any given time
3. WHEN a modal is closed, THE Sistema de Asignaciones SHALL reset the modal state to prevent data leakage between operations
4. THE Sistema de Asignaciones SHALL use Bootstrap modal components for consistent styling and behavior

### Requirement 5

**User Story:** Como administrador del sistema, quiero que la tabla tenga un diseño responsivo con iconos de Bootstrap, para poder gestionar asignaciones desde cualquier dispositivo

#### Acceptance Criteria

1. THE Sistema de Asignaciones SHALL use Bootstrap classes for responsive table layout
2. THE Sistema de Asignaciones SHALL display a pencil icon for the edit button and a trash icon for the delete button
3. THE Sistema de Asignaciones SHALL ensure the table is readable on mobile, tablet, and desktop screen sizes
4. THE Sistema de Asignaciones SHALL apply consistent styling using Bootstrap components throughout the interface
