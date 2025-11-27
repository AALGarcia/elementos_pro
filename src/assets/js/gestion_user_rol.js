
        // Datos simulados (reemplaza con llamadas a tu API)
        const usuarios = [
            { id: 1, documento: '12345678', nombre: 'Juan García', roles: ['coordinador'] },
            { id: 2, documento: '87654321', nombre: 'María López', roles: ['instructor', 'almacenista'] },
            { id: 3, documento: '11111111', nombre: 'Carlos Rodríguez', roles: ['administrador'] },
            { id: 4, documento: '22222222', nombre: 'Ana Martínez', roles: ['vigilante'] },
            { id: 5, documento: '33333333', nombre: 'Pedro Sánchez', roles: ['instructor'] },
            { id: 6, documento: '44444444', nombre: 'Laura Gómez', roles: ['coordinador', 'instructor'] },
        ];

        const rolesDisponibles = [
            { id: 'coordinador', nombre: '👨‍💼 Coordinador' },
            { id: 'instructor', nombre: '🎓 Instructor' },
            { id: 'administrador', nombre: '⚙️ Administrador' },
            { id: 'almacenista', nombre: '📦 Almacenista' },
            { id: 'vigilante', nombre: '👮 Vigilante' },
        ];

        let usuarioSeleccionado = null;
        let rolesSeleccionados = [];

        // Filtrar usuarios con los roles especificados
        function usuariosConRolesEspecificos() {
            const rolesValidos = ['coordinador', 'instructor', 'administrador', 'almacenista', 'vigilante'];
            return usuarios.filter(u => u.roles.some(r => rolesValidos.includes(r)));
        }

        // Buscar usuarios
        function buscarUsuarios() {
            const doc = document.getElementById('searchDoc').value.toLowerCase();
            const nombre = document.getElementById('searchName').value.toLowerCase();
            
            let resultados = usuariosConRolesEspecificos();
            
            if (doc) {
                resultados = resultados.filter(u => u.documento.includes(doc));
            }
            
            if (nombre) {
                resultados = resultados.filter(u => u.nombre.toLowerCase().includes(nombre));
            }
            
            mostrarUsuarios(resultados);
        }

        // Mostrar lista de usuarios
        function mostrarUsuarios(usuarios) {
            const usersList = document.getElementById('usersList');
            
            if (usuarios.length === 0) {
                usersList.innerHTML = '<div class="empty-state">No se encontraron usuarios</div>';
                return;
            }
            
            usersList.innerHTML = usuarios.map(usuario => `
                <div class="user-item" data-id="${usuario.id}">
                    <input type="checkbox" class="user-checkbox" data-id="${usuario.id}">
                    <div class="user-info">
                        <div class="user-name">${usuario.nombre}</div>
                        <div class="user-doc">📋 ${usuario.documento}</div>
                    </div>
                </div>
            `).join('');
            
            // Event listeners para selección
            document.querySelectorAll('.user-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    if (e.target.type !== 'checkbox') {
                        const checkbox = item.querySelector('.user-checkbox');
                        checkbox.checked = !checkbox.checked;
                    }
                    seleccionarUsuario(item.dataset.id);
                });
            });
        }

        // Seleccionar usuario
        function seleccionarUsuario(usuarioId) {
            usuarioSeleccionado = usuarios.find(u => u.id == usuarioId);
            rolesSeleccionados = [...usuarioSeleccionado.roles];
            
            // Actualizar UI
            document.querySelectorAll('.user-item').forEach(item => {
                item.classList.remove('selected');
            });
            document.querySelector(`[data-id="${usuarioId}"]`).classList.add('selected');
            
            actualizarInfoUsuario();
            mostrarRoles();
        }

        // Actualizar información del usuario seleccionado
        function actualizarInfoUsuario() {
            const info = document.getElementById('selectedUserInfo');
            if (usuarioSeleccionado) {
                info.innerHTML = `<strong>${usuarioSeleccionado.nombre}</strong><br><small>📋 ${usuarioSeleccionado.documento}</small>`;
            } else {
                info.innerHTML = 'Ninguno';
            }
        }

        // Mostrar roles disponibles
        function mostrarRoles() {
            const rolesList = document.getElementById('rolesList');
            
            if (!usuarioSeleccionado) {
                rolesList.innerHTML = '<div class="empty-state">Selecciona un usuario primero</div>';
                return;
            }
            
            rolesList.innerHTML = rolesDisponibles.map(rol => `
                <div class="role-item ${rolesSeleccionados.includes(rol.id) ? 'selected' : ''}" data-role="${rol.id}">
                    <input type="checkbox" class="role-checkbox" data-role="${rol.id}" 
                           ${rolesSeleccionados.includes(rol.id) ? 'checked' : ''}>
                    <label class="role-label">${rol.nombre}</label>
                </div>
            `).join('');
            
            // Event listeners para roles
            document.querySelectorAll('.role-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    if (e.target.type !== 'checkbox') {
                        const checkbox = item.querySelector('.role-checkbox');
                        checkbox.checked = !checkbox.checked;
                    }
                    toggleRol(item.dataset.role);
                });
            });
        }

        // Alternar selección de rol
        function toggleRol(rolId) {
            const index = rolesSeleccionados.indexOf(rolId);
            if (index > -1) {
                rolesSeleccionados.splice(index, 1);
            } else {
                rolesSeleccionados.push(rolId);
            }
            
            mostrarRoles();
        }

        // Guardar cambios
        document.getElementById('saveBtn').addEventListener('click', () => {
            if (!usuarioSeleccionado) {
                alert('⚠️ Selecciona un usuario primero');
                return;
            }
            if (rolesSeleccionados.length === 0) {
                alert('⚠️ Selecciona al menos un rol');
                return;
            }
            console.log('Guardando:', {
                usuario: usuarioSeleccionado.nombre,
                roles: rolesSeleccionados
            });
            alert(`✅ Roles actualizados para ${usuarioSeleccionado.nombre}`);
        });

        // Cancelar
        document.getElementById('cancelBtn').addEventListener('click', () => {
            usuarioSeleccionado = null;
            rolesSeleccionados = [];
            actualizarInfoUsuario();
            mostrarRoles();
            document.querySelectorAll('.user-item').forEach(item => {
                item.classList.remove('selected');
                item.querySelector('.user-checkbox').checked = false;
            });
        });

        // Event listeners para búsqueda
        document.getElementById('searchDoc').addEventListener('input', buscarUsuarios);
        document.getElementById('searchName').addEventListener('input', buscarUsuarios);
  