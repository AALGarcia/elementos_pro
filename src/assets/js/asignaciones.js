// Variables globales para almacenar las instancias de los modales
let modalCrearInstance = null;
let modalEditarInstance = null;
let modalEliminarInstance = null;
let placaAEliminar = null;
let elementosDisponibles = [];
let elementosSeleccionados = new Set();

// Función para abrir el modal de crear asignación
async function abrirModalCrear() {
  try {
    // Limpiar selecciones previas
    elementosSeleccionados.clear();
    
    // Cargar datos desde la API
    const [personasRes, ambientesRes, elementosRes] = await Promise.all([
      fetch('/api/personas').then(res => {
        if (!res.ok) throw new Error('Error al cargar personas');
        return res.json();
      }),
      fetch('/api/ambientes').then(res => {
        if (!res.ok) throw new Error('Error al cargar ambientes');
        return res.json();
      }),
      fetch('/api/elementos').then(res => {
        if (!res.ok) throw new Error('Error al cargar elementos');
        return res.json();
      })
    ]);
    
    const personas = personasRes.data || personasRes;
    const ambientes = ambientesRes.data || ambientesRes;
    elementosDisponibles = elementosRes.data || elementosRes;

    // Limpiar formulario
    document.getElementById('formCrear').reset();
    document.getElementById('resumenSeleccion').style.display = 'none';

    // Llenar select de personas
    const selectPersona = document.getElementById('createPersona');
    selectPersona.innerHTML = '<option value="">Seleccione un cuentadante</option>';
    personas.forEach(persona => {
      const option = document.createElement('option');
      option.value = persona.pers_documento;
      option.textContent = `${persona.pers_documento} - ${persona.pers_nombres} ${persona.pers_apellidos}`;
      selectPersona.appendChild(option);
    });

    // Llenar select de ambientes
    const selectAmbiente = document.getElementById('createAmbiente');
    selectAmbiente.innerHTML = '<option value="">Seleccione un ambiente</option>';
    ambientes.forEach(ambiente => {
      const option = document.createElement('option');
      option.value = ambiente.amb_id;
      option.textContent = ambiente.amb_nombre;
      selectAmbiente.appendChild(option);
    });

    // Renderizar lista de elementos
    renderizarListaElementos();

    // Abrir el modal
    const modalElement = document.getElementById('modalCrear');
    modalCrearInstance = new bootstrap.Modal(modalElement);
    modalCrearInstance.show();

  } catch (error) {
    console.error('Error al abrir modal de creación:', error);
    mostrarMensaje('danger', 'Error al cargar los datos: ' + error.message);
  }
}

// Función para cargar roles de la persona seleccionada
async function cargarRolesPersona() {
  try {
    const persDocumento = document.getElementById('createPersona').value;
    
    if (!persDocumento) {
      document.getElementById('createRol').innerHTML = '<option value="">Seleccione un rol</option>';
      return;
    }

    // Obtener roles de la persona
    const response = await fetch(`/api/personas/${persDocumento}/roles`);
    
    if (!response.ok) {
      // Si no existe el endpoint, cargar todos los roles
      const rolesRes = await fetch('/api/roles');
      const rolesData = await rolesRes.json();
      const roles = rolesData.data || rolesData;
      
      const selectRol = document.getElementById('createRol');
      selectRol.innerHTML = '<option value="">Seleccione un rol</option>';
      roles.forEach(rol => {
        const option = document.createElement('option');
        option.value = rol.rol_id;
        option.textContent = rol.rol_nombre;
        selectRol.appendChild(option);
      });
      return;
    }

    const result = await response.json();
    const roles = result.data || result;

    const selectRol = document.getElementById('createRol');
    selectRol.innerHTML = '<option value="">Seleccione un rol</option>';
    
    if (roles.length === 0) {
      selectRol.innerHTML = '<option value="">Esta persona no tiene roles asignados</option>';
      return;
    }

    roles.forEach(rol => {
      const option = document.createElement('option');
      option.value = rol.rol_id;
      option.textContent = rol.rol_nombre;
      selectRol.appendChild(option);
    });

  } catch (error) {
    console.error('Error al cargar roles:', error);
    mostrarMensaje('danger', 'Error al cargar los roles de la persona');
  }
}

// Función para renderizar la lista de elementos disponibles
function renderizarListaElementos() {
  const container = document.getElementById('listaElementos');
  
  if (!elementosDisponibles || elementosDisponibles.length === 0) {
    container.innerHTML = '<p class="text-muted text-center">No hay elementos disponibles</p>';
    return;
  }

  container.innerHTML = '';
  
  elementosDisponibles.forEach(elemento => {
    const div = document.createElement('div');
    div.className = 'form-check mb-2';
    
    const checkbox = document.createElement('input');
    checkbox.className = 'form-check-input';
    checkbox.type = 'checkbox';
    checkbox.id = `elemento_${elemento.elem_placa}`;
    checkbox.value = elemento.elem_placa;
    checkbox.onchange = () => toggleElemento(elemento.elem_placa);
    
    const label = document.createElement('label');
    label.className = 'form-check-label';
    label.htmlFor = `elemento_${elemento.elem_placa}`;
    label.textContent = `${elemento.elem_placa} - ${elemento.elem_descripcion || ''} ${elemento.elem_modelo || ''} (${elemento.marc_nombre})`;
    
    div.appendChild(checkbox);
    div.appendChild(label);
    container.appendChild(div);
  });
}

// Función para toggle de selección de elemento
function toggleElemento(placa) {
  if (elementosSeleccionados.has(placa)) {
    elementosSeleccionados.delete(placa);
  } else {
    elementosSeleccionados.add(placa);
  }
  
  actualizarResumenSeleccion();
}

// Función para actualizar el resumen de selección
function actualizarResumenSeleccion() {
  const resumen = document.getElementById('resumenSeleccion');
  const contador = document.getElementById('contadorElementos');
  
  if (elementosSeleccionados.size > 0) {
    resumen.style.display = 'block';
    contador.textContent = elementosSeleccionados.size;
  } else {
    resumen.style.display = 'none';
  }
}

// Función para guardar las asignaciones
async function guardarAsignaciones() {
  try {
    // Obtener valores del formulario
    const pers_documento = document.getElementById('createPersona').value;
    const rol_id = document.getElementById('createRol').value;
    const amb_id = document.getElementById('createAmbiente').value;

    // Validar datos del formulario
    if (!pers_documento || !rol_id || !amb_id) {
      mostrarMensaje('danger', 'Por favor complete todos los campos obligatorios');
      return;
    }

    if (elementosSeleccionados.size === 0) {
      mostrarMensaje('danger', 'Por favor seleccione al menos un elemento');
      return;
    }

    // Crear asignaciones para cada elemento seleccionado
    const promesas = [];
    
    for (const elem_placa of elementosSeleccionados) {
      const promesa = fetch('/api/asignaciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          elem_placa,
          pers_documento,
          rol_id: parseInt(rol_id),
          amb_id: parseInt(amb_id)
        })
      });
      
      promesas.push(promesa);
    }

    // Esperar a que todas las asignaciones se completen
    const resultados = await Promise.all(promesas);
    
    // Verificar si todas fueron exitosas
    let exitosas = 0;
    let fallidas = 0;
    
    for (const response of resultados) {
      if (response.ok) {
        exitosas++;
      } else {
        fallidas++;
      }
    }

    // Cerrar el modal
    if (modalCrearInstance) {
      modalCrearInstance.hide();
    }

    // Mostrar mensaje de resultado
    if (fallidas === 0) {
      mostrarMensaje('success', `${exitosas} asignación(es) creada(s) exitosamente`);
    } else {
      mostrarMensaje('warning', `${exitosas} asignación(es) creada(s), ${fallidas} fallida(s)`);
    }

    // Refrescar la tabla
    await cargarAsignaciones();

  } catch (error) {
    console.error('Error al guardar asignaciones:', error);
    if (error.message.includes('Failed to fetch')) {
      mostrarMensaje('danger', 'Error de conexión con el servidor');
    } else {
      mostrarMensaje('danger', 'Error al guardar las asignaciones: ' + error.message);
    }
  }
}

// Función para abrir el modal de edición
async function abrirModalEditar(elem_placa) {
  try {
    // Obtener datos de la fila seleccionada
    const filas = document.querySelectorAll('#tablaAsignaciones tbody tr');
    let asignacionActual = null;
    
    filas.forEach(fila => {
      const placaCell = fila.cells[6].textContent;
      if (placaCell === elem_placa) {
        asignacionActual = {
          elem_placa: placaCell,
          pers_documento: fila.cells[0].textContent,
          rol_id: fila.dataset.rolId,
          amb_id: fila.dataset.ambId
        };
      }
    });

    if (!asignacionActual) {
      mostrarMensaje('danger', 'No se encontró la asignación seleccionada');
      return;
    }

    // Cargar listas desde la API
    const [personasRes, rolesRes, ambientesRes] = await Promise.all([
      fetch('/api/personas').then(res => {
        if (!res.ok) throw new Error('Error al cargar personas');
        return res.json();
      }),
      fetch('/api/roles').then(res => {
        if (!res.ok) throw new Error('Error al cargar roles');
        return res.json();
      }),
      fetch('/api/ambientes').then(res => {
        if (!res.ok) throw new Error('Error al cargar ambientes');
        return res.json();
      })
    ]);
    
    const personas = personasRes.data || personasRes;
    const roles = rolesRes.data || rolesRes;
    const ambientes = ambientesRes.data || ambientesRes;

    // Pre-llenar el campo de placa (solo lectura)
    document.getElementById('editPlaca').value = elem_placa;

    // Llenar select de personas
    const selectPersona = document.getElementById('editPersona');
    selectPersona.innerHTML = '<option value="">Seleccione un cuentadante</option>';
    personas.forEach(persona => {
      const option = document.createElement('option');
      option.value = persona.pers_documento;
      option.textContent = `${persona.pers_documento} - ${persona.pers_nombres} ${persona.pers_apellidos}`;
      if (persona.pers_documento === asignacionActual.pers_documento) {
        option.selected = true;
      }
      selectPersona.appendChild(option);
    });

    // Llenar select de roles
    const selectRol = document.getElementById('editRol');
    selectRol.innerHTML = '<option value="">Seleccione un rol</option>';
    roles.forEach(rol => {
      const option = document.createElement('option');
      option.value = rol.rol_id;
      option.textContent = rol.rol_nombre;
      if (rol.rol_id == asignacionActual.rol_id) {
        option.selected = true;
      }
      selectRol.appendChild(option);
    });

    // Llenar select de ambientes
    const selectAmbiente = document.getElementById('editAmbiente');
    selectAmbiente.innerHTML = '<option value="">Seleccione un ambiente</option>';
    ambientes.forEach(ambiente => {
      const option = document.createElement('option');
      option.value = ambiente.amb_id;
      option.textContent = ambiente.amb_nombre;
      if (ambiente.amb_id == asignacionActual.amb_id) {
        option.selected = true;
      }
      selectAmbiente.appendChild(option);
    });

    // Abrir el modal usando Bootstrap Modal API
    const modalElement = document.getElementById('modalEditar');
    modalEditarInstance = new bootstrap.Modal(modalElement);
    modalEditarInstance.show();

  } catch (error) {
    console.error('Error al abrir modal de edición:', error);
    mostrarMensaje('danger', 'Error al cargar los datos para edición: ' + error.message);
  }
}

// Función para abrir el modal de eliminación
function abrirModalEliminar(elem_placa) {
  try {
    // Guardar la placa para usar en la confirmación
    placaAEliminar = elem_placa;
    
    // Obtener datos de la fila seleccionada
    const filas = document.querySelectorAll('#tablaAsignaciones tbody tr');
    let asignacionActual = null;
    
    filas.forEach(fila => {
      const placaCell = fila.cells[6].textContent;
      if (placaCell === elem_placa) {
        asignacionActual = {
          pers_documento: fila.cells[0].textContent,
          pers_nombres: fila.cells[1].textContent,
          pers_apellidos: fila.cells[2].textContent,
          rol_nombre: fila.cells[4].textContent,
          marc_nombre: fila.cells[5].textContent,
          elem_placa: placaCell,
          elem_modelo: fila.cells[7].textContent
        };
      }
    });

    if (!asignacionActual) {
      mostrarMensaje('danger', 'No se encontró la asignación a eliminar');
      return;
    }

    // Mostrar información en el modal
    document.getElementById('deleteDocumento').textContent = asignacionActual.pers_documento;
    document.getElementById('deleteNombre').textContent = `${asignacionActual.pers_nombres} ${asignacionActual.pers_apellidos}`;
    document.getElementById('deleteRol').textContent = asignacionActual.rol_nombre;
    document.getElementById('deletePlaca').textContent = asignacionActual.elem_placa;
    document.getElementById('deleteMarca').textContent = asignacionActual.marc_nombre;
    document.getElementById('deleteModelo').textContent = asignacionActual.elem_modelo;

    // Abrir el modal usando Bootstrap Modal API
    const modalElement = document.getElementById('modalEliminar');
    modalEliminarInstance = new bootstrap.Modal(modalElement);
    modalEliminarInstance.show();

  } catch (error) {
    console.error('Error al abrir modal de eliminación:', error);
    mostrarMensaje('danger', 'Error al abrir el modal de eliminación: ' + error.message);
  }
}

// Función para cargar asignaciones
async function cargarAsignaciones() {
  try {
    // Hacer fetch a GET /api/asignaciones
    const response = await fetch('/api/asignaciones');
    
    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || `Error del servidor: ${response.status}`);
    }
    
    // Procesar respuesta JSON
    const result = await response.json();
    
    if (result.success && result.data) {
      // Renderizar la tabla con los datos obtenidos
      renderizarTabla(result.data);
    } else {
      throw new Error(result.error || 'Error al cargar asignaciones');
    }
  } catch (error) {
    console.error('Error al cargar asignaciones:', error);
    if (error.message.includes('Failed to fetch')) {
      mostrarMensaje('danger', 'Error de conexión con el servidor');
    } else {
      mostrarMensaje('danger', 'Error al cargar las asignaciones: ' + error.message);
    }
  }
}

// Función para renderizar la tabla con botones de acción
function renderizarTabla(asignaciones) {
  try {
    const tbody = document.querySelector('#tablaAsignaciones tbody');
    
    if (!tbody) {
      throw new Error('No se encontró el elemento de la tabla');
    }
    
    tbody.innerHTML = '';
    
    if (!asignaciones || asignaciones.length === 0) {
      tbody.innerHTML = '<tr><td colspan="9" class="text-center">No hay asignaciones registradas</td></tr>';
      return;
    }
    
    // Generar filas HTML dinámicamente con datos de asignaciones
    asignaciones.forEach(asignacion => {
      const fila = document.createElement('tr');
      
      // Almacenar rol_id y amb_id en dataset para uso posterior
      fila.dataset.rolId = asignacion.rq_persona_rol_rol_id;
      fila.dataset.ambId = asignacion.ambiente_amb_id;
      
      // Crear contenido de la fila con todas las columnas
      fila.innerHTML = `
        <td>${asignacion.pers_documento}</td>
        <td>${asignacion.pers_nombres}</td>
        <td>${asignacion.pers_apellidos}</td>
        <td>${asignacion.pers_telefono || ''}</td>
        <td>${asignacion.rol_nombre}</td>
        <td>${asignacion.marc_nombre}</td>
        <td>${asignacion.elem_placa}</td>
        <td>${asignacion.elem_modelo}</td>
        <td class="text-center">
          <div class="btn-group" role="group" aria-label="Acciones">
            <button class="btn btn-sm btn-primary" onclick="abrirModalEditar('${asignacion.elem_placa}')" title="Editar" aria-label="Editar asignación">
              <i class="bi bi-pencil-square"></i>
            </button>
            <button class="btn btn-sm btn-danger" onclick="abrirModalEliminar('${asignacion.elem_placa}')" title="Eliminar" aria-label="Eliminar asignación">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </td>
      `;
      
      // Insertar fila en tbody de la tabla
      tbody.appendChild(fila);
    });
  } catch (error) {
    console.error('Error al renderizar tabla:', error);
    mostrarMensaje('danger', 'Error al mostrar los datos en la tabla');
  }
}

// Función para confirmar la eliminación
async function confirmarEliminacion() {
  try {
    if (!placaAEliminar) {
      mostrarMensaje('danger', 'No hay asignación seleccionada para eliminar');
      return;
    }

    // Enviar DELETE request a la API
    const response = await fetch(`/api/asignaciones/${placaAEliminar}`, {
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
      placaAEliminar = null;

      // Mostrar mensaje de éxito
      mostrarMensaje('success', 'Asignación eliminada exitosamente');

      // Refrescar la tabla de asignaciones
      await cargarAsignaciones();
    } else {
      throw new Error(result.error || 'Error al eliminar la asignación');
    }

  } catch (error) {
    console.error('Error al eliminar asignación:', error);
    if (error.message.includes('Failed to fetch')) {
      mostrarMensaje('danger', 'Error de conexión con el servidor');
    } else {
      mostrarMensaje('danger', 'Error al eliminar la asignación: ' + error.message);
    }
  }
}

// Función para guardar la edición
async function guardarEdicion() {
  try {
    // Obtener valores del formulario
    const elem_placa = document.getElementById('editPlaca').value;
    const pers_documento = document.getElementById('editPersona').value;
    const rol_id = document.getElementById('editRol').value;
    const amb_id = document.getElementById('editAmbiente').value;

    // Validar datos del formulario
    if (!pers_documento || !rol_id || !amb_id) {
      mostrarMensaje('danger', 'Por favor complete todos los campos');
      return;
    }

    // Enviar PUT request a la API
    const response = await fetch(`/api/asignaciones/${elem_placa}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pers_documento,
        rol_id: parseInt(rol_id),
        amb_id: parseInt(amb_id)
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
      mostrarMensaje('success', 'Asignación actualizada exitosamente');

      // Refrescar la tabla de asignaciones
      await cargarAsignaciones();
    } else {
      throw new Error(result.error || 'Error al actualizar la asignación');
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

// Función para mostrar mensajes
function mostrarMensaje(tipo, texto) {
  // Buscar o crear contenedor de mensajes
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
  
  // Crear elemento de alerta
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${tipo} alert-dismissible fade show shadow-sm`;
  alertDiv.setAttribute('role', 'alert');
  
  // Agregar icono según el tipo
  const icon = tipo === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill';
  alertDiv.innerHTML = `
    <i class="bi ${icon} me-2"></i>
    ${texto}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
  `;
  
  container.appendChild(alertDiv);
  
  // Auto-cerrar después de 3 segundos
  setTimeout(() => {
    alertDiv.classList.remove('show');
    setTimeout(() => alertDiv.remove(), 150);
  }, 3000);
}

// Cargar asignaciones al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  cargarAsignaciones();
  
  // Agregar event listener para limpiar estado al cerrar modal de eliminación
  const modalEliminarElement = document.getElementById('modalEliminar');
  if (modalEliminarElement) {
    modalEliminarElement.addEventListener('hidden.bs.modal', () => {
      placaAEliminar = null;
    });
  }
});
