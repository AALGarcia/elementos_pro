const { pool } = require('./src/config/conexion');

async function checkRolPersona() {
  try {
    const query = `
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'rol_persona'
      ORDER BY ordinal_position;
    `;
    
    const result = await pool.query(query);
    
    console.log('Columnas de la tabla rol_persona:');
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name} (${row.data_type})`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkRolPersona();
