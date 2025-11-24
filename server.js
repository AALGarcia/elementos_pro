// Servidor Express para el Sistema de Gestión de Asignaciones
const express = require('express');
const path = require('path');
const { verificarConexion } = require('./src/config/conexion');
const asignacionesRouter = require('./src/api/asignaciones');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname)));
app.use('/src', express.static(path.join(__dirname, 'src')));

// Rutas de la API
app.use('/api', asignacionesRouter);

// Ruta principal - página de inicio
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Rutas específicas
app.get('/asignaciones', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'asignaciones', 'listar_asignaciones.html'));
});

app.get('/personas', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'persona', 'listar_persona.html'));
});

app.get('/elementos', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'elemento', 'listar_elemento.html'));
});

// Iniciar servidor
const iniciarServidor = async () => {
  try {
    // Verificar conexión a la base de datos
    const conexionExitosa = await verificarConexion();
    
    if (!conexionExitosa) {
      console.error('No se pudo conectar a la base de datos. Verifique la configuración.');
      process.exit(1);
    }
    
    // Iniciar servidor Express
    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
      console.log(`Página de asignaciones: http://localhost:${PORT}/src/asignaciones/listar_asignaciones.html`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

iniciarServidor();
