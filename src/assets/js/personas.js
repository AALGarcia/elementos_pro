// Variables globales para almacenar las instancias de los modales
let modalCrearInstance = null;
let modalEditarInstance = null;
let modalEliminarInstance = null;
let documentoAEliminar = null;

// Función para abrir el modal de crear
async function abrirModalCrear() {
  try {
    // Cargar roles desde la API
    const rolesRes = await fetch('/api/roles');
    
    if (!rolesRes.ok) {
      throw new Error('Error al cargar roles');
    }
    
    const rolesData = await rolesRes.json();
    const roles = rolesData.data || rolesData;

    // Limpiar formulario
    document.getElementById('formCrear').reset();

    // Llenar select de roles
    const selectRol = document.getElementById('createRol');
    selectRol.innerHTML = '<option value="">Seleccione un rol</option>';
    roles.forEach(rol => {
      const option = document.createElement('option');
      option.value = rol.rol_id;
      option.textContent = rol.rol_nombre;
      selectRol.appendChild(option);
    });

    // Abrir el modal
    const modalElement = document.getElementById('modalCrear');
    modalCrearInstance = new bootstrap.Modal(modalElement);
    modalCrearInstance.show();

  } catch (error) {
    console.error('Error al abrir modal de creación:', error);
    mostrarMensaje('danger', 'Error al cargar los datos: ' + error.message);
  }
}

// Función para abrir el modal de edición
function abrirModalEditar(pers_documento) {
  try {
    // Obtener datos de la fila seleccionada
    const filas = document.querySelectorAll('#tablaPersonas tbody tr');
    let personaActual = null;
    
    filas.forEach(fila => {
      const docCell = fila.cells[0].textContent;
      if (docCell === pers_documento) {
        personaActual = {
          pers_documento: docCell,
          pers_nombres: fila.cells[1].textContent,
          pers_apellidos: fila.cells[2].textContent,
          pers_telefono: fila.cells[3].textContent
        };
      }
    });

    if (!personaActual) {
      mostrarMensaje('danger', 'No se encontró la persona seleccionada');
      return;
    }

    // Pre-llenar el formulario
    document.getElementById('editDocumento').value = personaActual.pers_documento;
    document.getElementById('editNombres').value = personaActual.pers_nombres;
    document.getElementById('editApellidos').value = personaActual.pers_apellidos;
    document.getElementById('editTelefono').value = personaActual.pers_telefono;

    // Abrir el modal
    const modalElement = document.getElementById('modalEditar');
    modalEditarInstance = new bootstrap.Modal(modalElement);
    modalEditarInstance.show();

  } catch (error) {
    console.error('Error al abrir modal de edición:', error);
    mostrarMensaje('danger', 'Error al abrir el modal de edición: ' + error.message);
  }
}

// Función para abrir el modal de eliminación
function abrirModalEliminar(pers_documento) {
  try {
    // Guardar el documento para usar en la confirmación
    documentoAEliminar = pers_documento;
    
    // Obtener datos de la fila seleccionada
    const filas = document.querySelectorAll('#tablaPersonas tbody tr');
    let personaActual = null;
    
    filas.forEach(fila => {
      const docCell = fila.cells[0].textContent;
      if (docCell === pers_documento) {
        personaActual = {
          pers_documento: docCell,
          pers_nombres: fila.cells[1].textContent,
          pers_apellidos: fila.cells[2].textContent,
          pers_telefono: fila.cells[3].textContent
        };
      }
    });

    if (!personaActual) {
      mostrarMensaje('danger', 'No se encontró la persona a eliminar');
      return;
    }

    // Mostrar información en el modal
    document.getElementById('deleteDocumento').textContent = personaActual.pers_documento;
    document.getElementById('deleteNombre').textContent = `${personaActual.pers_nombres} ${personaActual.pers_apellidos}`;
    document.getElementById('deleteTelefono').textContent = personaActual.pers_telefono || 'N/A';

    // Abrir el modal
    const modalElement = document.getElementById('modalEliminar');
    modalEliminarInstance = new bootstrap.Modal(modalElement);
    modalEliminarInstance.show();

  } catch (error) {
    console.error('Error al abrir modal de eliminación:', error);
    mostrarMensaje('danger', 'Error al abrir el modal de eliminación: ' + error.message);
  }
}

// Función para cargar personas
async function cargarPersonas() {
  try {
    const response = await fetch('/api/personas');
    
    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || `Error del servidor: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.success && result.data) {
      renderizarTabla(result.data);
    } else {
      throw new Error(result.error || 'Error al cargar personas');
    }
  } catch (error) {
    console.error('Error al cargar personas:', error);
    if (error.message.includes('Failed to fetch')) {
      mostrarMensaje('danger', 'Error de conexión con el servidor');
    } else {
      mostrarMensaje('danger', 'Error al cargar las personas: ' + error.message);
    }
  }
}

// Función para renderizar la tabla
function renderizarTabla(personas) {
  try {
    const tbody = document.querySelector('#tablaPersonas tbody');
    
    if (!tbody) {
      throw new Error('No se encontró el elemento de la tabla');
    }
    
    tbody.innerHTML = '';
    
    if (!personas || personas.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center">No hay personas registradas</td></tr>';
      return;
    }
    
    personas.forEach(persona => {
      const fila = document.createElement('tr');
      
      fila.innerHTML = `
        <td>${persona.pers_documento}</td>
        <td>${persona.pers_nombres}</td>
        <td>${persona.pers_apellidos}</td>
        <td>${persona.pers_telefono || ''}</td>
        <td>${persona.roles || 'Sin roles'}</td>
        <td class="text-center">
          <div class="btn-group" role="group" aria-label="Acciones">
            <button class="btn btn-sm btn-primary" onclick="abrirModalEditar('${persona.pers_documento}')" title="Editar" aria-label="Editar persona">
              <i class="bi bi-pencil-square"></i>
            </button>
            <button class="btn btn-sm btn-danger" onclick="abrirModalEliminar('${persona.pers_documento}')" title="Eliminar" aria-label="Eliminar persona">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </td>
      `;
      
      tbody.appendChild(fila);
    });
  } catch (error) {
    console.error('Error al renderizar tabla:', error);
    mostrarMensaje('danger', 'Error al mostrar los datos en la tabla');
  }
}

// Función para guardar nueva persona
async function guardarPersona() {
  try {
    // Obtener valores del formulario
    const pers_documento = document.getElementById('createDocumento').value.trim();
    const pers_nombres = document.getElementById('createNombres').value.trim();
    const pers_apellidos = document.getElementById('createApellidos').value.trim();
    const pers_telefono = document.getElementById('createTelefono').value.trim();
    const rol_id = document.getElementById('createRol').value;

    // Validar datos del formulario
    if (!pers_documento || !pers_nombres || !pers_apellidos || !rol_id) {
      mostrarMensaje('danger', 'Por favor complete todos los campos obligatorios');
      return;
    }

    // Enviar POST request a la API
    const response = await fetch('/api/personas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pers_documento,
        pers_nombres,
        pers_apellidos,
        pers_telefono: pers_telefono || null,
        rol_id: parseInt(rol_id)
      })
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || `Error del servidor: ${response.status}`);
    }

    const result = await response.json();

    if (result.success) {
      // Cerrar el modal
      if (modalCrearInstance) {
        modalCrearInstance.hide();
      }

      // Mostrar mensaje de éxito
      mostrarMensaje('success', 'Persona creada exitosamente');

      // Refrescar la tabla
      await cargarPersonas();
    } else {
      throw new Error(result.error || 'Error al crear la persona');
    }

  } catch (error) {
    console.error('Error al guardar persona:', error);
    if (error.message.includes('Failed to fetch')) {
      mostrarMensaje('danger', 'Error de conexión con el servidor');
    } else {
      mostrarMensaje('danger', 'Error al guardar la persona: ' + error.message);
    }
  }
}

// Función para guardar la edición
async function guardarEdicion() {
  try {
    // Obtener valores del formulario
    const pers_documento = document.getElementById('editDocumento').value;
    const pers_nombres = document.getElementById('editNombres').value.trim();
    const pers_apellidos = document.getElementById('editApellidos').value.trim();
    const pers_telefono = document.getElementById('editTelefono').value.trim();

    // Validar datos del formulario
    if (!pers_nombres || !pers_apellidos) {
      mostrarMensaje('danger', 'Por favor complete todos los campos obligatorios');
      return;
    }

    // Enviar PUT request a la API
    const response = await fetch(`/api/personas/${pers_documento}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pers_nombres,
        pers_apellidos,
        pers_telefono: pers_telefono || null
      })
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || `Error del servidor: ${response.status}`);
    }

    const result = await response.json();

    if (result.success) {
      // Cerrar el modal
      if (modalEditarInstance) {
        modalEditarInstance.hide();
      }

      // Mostrar mensaje de éxito
      mostrarMensaje('success', 'Persona actualizada exitosamente');

      // Refrescar la tabla
      await cargarPersonas();
    } else {
      throw new Error(result.error || 'Error al actualizar la persona');
    }

  } catch (error) {
    console.error('Error al guardar edición:', error);
    if (error.message.includes('Failed to fetch')) {
      mostrarMensaje('danger', 'Error de conexión con el servidor');
    } else {
      mostrarMensaje('danger', 'Error al guardar los cambios: ' + error.message);
    }
  }
}

// Función para confirmar la eliminación
async function confirmarEliminacion() {
  try {
    if (!documentoAEliminar) {
      mostrarMensaje('danger', 'No hay persona seleccionada para eliminar');
      return;
    }

    // Enviar DELETE request a la API
    const response = await fetch(`/api/personas/${documentoAEliminar}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || `Error del servidor: ${response.status}`);
    }

    const result = await response.json();

    if (result.success) {
      // Cerrar el modal
      if (modalEliminarInstance) {
        modalEliminarInstance.hide();
      }

      // Limpiar la variable
      documentoAEliminar = null;

      // Mostrar mensaje de éxito
      mostrarMensaje('success', 'Persona eliminada exitosamente');

      // Refrescar la tabla
      await cargarPersonas();
    } else {
      throw new Error(result.error || 'Error al eliminar la persona');
    }

  } catch (error) {
    console.error('Error al eliminar persona:', error);
    if (error.message.includes('Failed to fetch')) {
      mostrarMensaje('danger', 'Error de conexión con el servidor');
    } else {
      mostrarMensaje('danger', 'Error al eliminar la persona: ' + error.message);
    }
  }
}

// Función para mostrar mensajes
function mostrarMensaje(tipo, texto) {
  let container = document.getElementById('mensajesContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'mensajesContainer';
    container.className = 'position-fixed top-0 start-50 translate-middle-x mt-3';
    container.style.zIndex = '9999';
    container.style.minWidth = '300px';
    container.style.maxWidth = '90%';
    document.body.appendChild(container);
  }
  
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${tipo} alert-dismissible fade show shadow-sm`;
  alertDiv.setAttribute('role', 'alert');
  
  const icon = tipo === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill';
  alertDiv.innerHTML = `
    <i class="bi ${icon} me-2"></i>
    ${texto}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
  `;
  
  container.appendChild(alertDiv);
  
  setTimeout(() => {
    alertDiv.classList.remove('show');
    setTimeout(() => alertDiv.remove(), 150);
  }, 3000);
}

// Cargar personas al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  cargarPersonas();
  
  // Agregar event listener para limpiar estado al cerrar modal de eliminación
  const modalEliminarElement = document.getElementById('modalEliminar');
  if (modalEliminarElement) {
    modalEliminarElement.addEventListener('hidden.bs.modal', () => {
      documentoAEliminar = null;
    });
  }
});
