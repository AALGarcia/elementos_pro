// Variables globales para almacenar las instancias de los modales
let modalCrearInstance = null;
let modalEditarInstance = null;
let modalEliminarInstance = null;
let placaAEliminar = null;

// Función para abrir el modal de crear
async function abrirModalCrear() {
  try {
    // Cargar marcas desde la API
    const marcasRes = await fetch('/api/marcas');
    
    if (!marcasRes.ok) {
      throw new Error('Error al cargar marcas');
    }
    
    const marcasData = await marcasRes.json();
    const marcas = marcasData.data || marcasData;

    // Limpiar formulario
    document.getElementById('formCrear').reset();

    // Llenar select de marcas
    const selectMarca = document.getElementById('createMarca');
    selectMarca.innerHTML = '<option value="">Seleccione una marca</option>';
    marcas.forEach(marca => {
      const option = document.createElement('option');
      option.value = marca.marc_id;
      option.textContent = marca.marc_nombre;
      selectMarca.appendChild(option);
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
async function abrirModalEditar(elem_placa) {
  try {
    // Obtener datos de la fila seleccionada
    const filas = document.querySelectorAll('#tablaElementos tbody tr');
    let elementoActual = null;
    
    filas.forEach(fila => {
      const placaCell = fila.cells[0].textContent;
      if (placaCell === elem_placa) {
        elementoActual = {
          elem_placa: placaCell,
          elem_descripcion: fila.cells[1].textContent,
          elem_modelo: fila.cells[2].textContent,
          marc_id: fila.dataset.marcId,
          elem_serial: fila.dataset.serial
        };
      }
    });

    if (!elementoActual) {
      mostrarMensaje('danger', 'No se encontró el elemento seleccionado');
      return;
    }

    // Cargar marcas desde la API
    const marcasRes = await fetch('/api/marcas');
    
    if (!marcasRes.ok) {
      throw new Error('Error al cargar marcas');
    }
    
    const marcasData = await marcasRes.json();
    const marcas = marcasData.data || marcasData;

    // Pre-llenar el formulario
    document.getElementById('editPlaca').value = elementoActual.elem_placa;
    document.getElementById('editDescripcion').value = elementoActual.elem_descripcion || '';
    document.getElementById('editModelo').value = elementoActual.elem_modelo;
    document.getElementById('editSerial').value = elementoActual.elem_serial || '';

    // Llenar select de marcas
    const selectMarca = document.getElementById('editMarca');
    selectMarca.innerHTML = '<option value="">Seleccione una marca</option>';
    marcas.forEach(marca => {
      const option = document.createElement('option');
      option.value = marca.marc_id;
      option.textContent = marca.marc_nombre;
      if (marca.marc_id == elementoActual.marc_id) {
        option.selected = true;
      }
      selectMarca.appendChild(option);
    });

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
function abrirModalEliminar(elem_placa) {
  try {
    // Guardar la placa para usar en la confirmación
    placaAEliminar = elem_placa;
    
    // Obtener datos de la fila seleccionada
    const filas = document.querySelectorAll('#tablaElementos tbody tr');
    let elementoActual = null;
    
    filas.forEach(fila => {
      const placaCell = fila.cells[0].textContent;
      if (placaCell === elem_placa) {
        elementoActual = {
          elem_placa: placaCell,
          elem_descripcion: fila.cells[1].textContent,
          elem_modelo: fila.cells[2].textContent,
          marc_nombre: fila.cells[3].textContent
        };
      }
    });

    if (!elementoActual) {
      mostrarMensaje('danger', 'No se encontró el elemento a eliminar');
      return;
    }

    // Mostrar información en el modal
    document.getElementById('deletePlaca').textContent = elementoActual.elem_placa;
    document.getElementById('deleteDescripcion').textContent = elementoActual.elem_descripcion;
    document.getElementById('deleteModelo').textContent = elementoActual.elem_modelo;
    document.getElementById('deleteMarca').textContent = elementoActual.marc_nombre;

    // Abrir el modal
    const modalElement = document.getElementById('modalEliminar');
    modalEliminarInstance = new bootstrap.Modal(modalElement);
    modalEliminarInstance.show();

  } catch (error) {
    console.error('Error al abrir modal de eliminación:', error);
    mostrarMensaje('danger', 'Error al abrir el modal de eliminación: ' + error.message);
  }
}

// Función para cargar elementos
async function cargarElementos() {
  try {
    const response = await fetch('/api/elementos');
    
    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || `Error del servidor: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.success && result.data) {
      renderizarTabla(result.data);
    } else {
      throw new Error(result.error || 'Error al cargar elementos');
    }
  } catch (error) {
    console.error('Error al cargar elementos:', error);
    if (error.message.includes('Failed to fetch')) {
      mostrarMensaje('danger', 'Error de conexión con el servidor');
    } else {
      mostrarMensaje('danger', 'Error al cargar los elementos: ' + error.message);
    }
  }
}

// Función para renderizar la tabla
function renderizarTabla(elementos) {
  try {
    const tbody = document.querySelector('#tablaElementos tbody');
    
    if (!tbody) {
      throw new Error('No se encontró el elemento de la tabla');
    }
    
    tbody.innerHTML = '';
    
    if (!elementos || elementos.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center">No hay elementos registrados</td></tr>';
      return;
    }
    
    elementos.forEach(elemento => {
      const fila = document.createElement('tr');
      
      // Almacenar marc_id y serial en dataset para uso posterior
      fila.dataset.marcId = elemento.marca_marc_id;
      fila.dataset.serial = elemento.elem_serial || '';
      
      fila.innerHTML = `
        <td>${elemento.elem_placa}</td>
        <td>${elemento.elem_descripcion || ''}</td>
        <td>${elemento.elem_modelo || ''}</td>
        <td>${elemento.marc_nombre}</td>
        <td>${elemento.elem_serial || ''}</td>
        <td class="text-center">
          <div class="btn-group" role="group" aria-label="Acciones">
            <button class="btn btn-sm btn-primary" onclick="abrirModalEditar('${elemento.elem_placa}')" title="Editar" aria-label="Editar elemento">
              <i class="bi bi-pencil-square"></i>
            </button>
            <button class="btn btn-sm btn-danger" onclick="abrirModalEliminar('${elemento.elem_placa}')" title="Eliminar" aria-label="Eliminar elemento">
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

// Función para guardar nuevo elemento
async function guardarElemento() {
  try {
    // Obtener valores del formulario
    const elem_placa = document.getElementById('createPlaca').value.trim();
    const elem_descripcion = document.getElementById('createDescripcion').value.trim();
    const elem_modelo = document.getElementById('createModelo').value.trim();
    const marc_id = document.getElementById('createMarca').value;
    const elem_serial = document.getElementById('createSerial').value.trim();

    // Validar datos del formulario
    if (!elem_placa || !elem_modelo || !marc_id) {
      mostrarMensaje('danger', 'Por favor complete todos los campos obligatorios');
      return;
    }

    // Enviar POST request a la API
    const response = await fetch('/api/elementos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        elem_placa,
        elem_descripcion: elem_descripcion || null,
        elem_modelo,
        marc_id: parseInt(marc_id),
        elem_serial: elem_serial || null
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
      mostrarMensaje('success', 'Elemento creado exitosamente');

      // Refrescar la tabla
      await cargarElementos();
    } else {
      throw new Error(result.error || 'Error al crear el elemento');
    }

  } catch (error) {
    console.error('Error al guardar elemento:', error);
    if (error.message.includes('Failed to fetch')) {
      mostrarMensaje('danger', 'Error de conexión con el servidor');
    } else {
      mostrarMensaje('danger', 'Error al guardar el elemento: ' + error.message);
    }
  }
}

// Función para guardar la edición
async function guardarEdicion() {
  try {
    // Obtener valores del formulario
    const elem_placa = document.getElementById('editPlaca').value;
    const elem_descripcion = document.getElementById('editDescripcion').value.trim();
    const elem_modelo = document.getElementById('editModelo').value.trim();
    const marc_id = document.getElementById('editMarca').value;
    const elem_serial = document.getElementById('editSerial').value.trim();

    // Validar datos del formulario
    if (!elem_modelo || !marc_id) {
      mostrarMensaje('danger', 'Por favor complete todos los campos obligatorios');
      return;
    }

    // Enviar PUT request a la API
    const response = await fetch(`/api/elementos/${elem_placa}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        elem_descripcion: elem_descripcion || null,
        elem_modelo,
        marc_id: parseInt(marc_id),
        elem_serial: elem_serial || null
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
      mostrarMensaje('success', 'Elemento actualizado exitosamente');

      // Refrescar la tabla
      await cargarElementos();
    } else {
      throw new Error(result.error || 'Error al actualizar el elemento');
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
    if (!placaAEliminar) {
      mostrarMensaje('danger', 'No hay elemento seleccionado para eliminar');
      return;
    }

    // Enviar DELETE request a la API
    const response = await fetch(`/api/elementos/${placaAEliminar}`, {
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
      mostrarMensaje('success', 'Elemento eliminado exitosamente');

      // Refrescar la tabla
      await cargarElementos();
    } else {
      throw new Error(result.error || 'Error al eliminar el elemento');
    }

  } catch (error) {
    console.error('Error al eliminar elemento:', error);
    if (error.message.includes('Failed to fetch')) {
      mostrarMensaje('danger', 'Error de conexión con el servidor');
    } else {
      mostrarMensaje('danger', 'Error al eliminar el elemento: ' + error.message);
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

// Cargar elementos al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  cargarElementos();
  
  // Agregar event listener para limpiar estado al cerrar modal de eliminación
  const modalEliminarElement = document.getElementById('modalEliminar');
  if (modalEliminarElement) {
    modalEliminarElement.addEventListener('hidden.bs.modal', () => {
      placaAEliminar = null;
    });
  }
});
