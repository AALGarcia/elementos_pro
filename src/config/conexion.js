// Conexión a la base de datos PostgreSQL bd_elementos
const { Pool } = require('pg');

// Configuración del pool de conexiones
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'bd_elementos',
  user: 'postgres',
  password: '1'
});

// Evento para manejar errores de conexión
pool.on('error', (err, client) => {
  console.error('Error inesperado en el cliente de PostgreSQL', err);
  process.exit(-1);
});

// Función para verificar la conexión
const verificarConexion = async () => {
  try {
    const client = await pool.connect();
    console.log('Conexión exitosa a PostgreSQL');
    client.release();
    return true;
  } catch (error) {
    console.error('Error al conectar a PostgreSQL:', error.message);
    return false;
  }
};

module.exports = {
  pool,
  verificarConexion
};
