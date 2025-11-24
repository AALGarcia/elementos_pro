const { pool } = require('./src/config/conexion');

async function verEsquemaCompleto() {
  try {
    const tablas = ['persona', 'rol', 'rol_persona', 'elemento', 'marca', 'ambiente', 'asignacion'];
    
    for (const tabla of tablas) {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`TABLA: ${tabla.toUpperCase()}`);
      console.log('='.repeat(60));
      
      const query = `
        SELECT 
          column_name, 
          data_type,
          character_maximum_length,
          is_nullable,
          column_default
        FROM information_schema.columns
        WHERE table_name = $1
        ORDER BY ordinal_position;
      `;
      
      const result = await pool.query(query, [tabla]);
      
      if (result.rows.length === 0) {
        console.log('  ⚠️  Tabla no encontrada');
      } else {
        result.rows.forEach(row => {
          const nullable = row.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
          const length = row.character_maximum_length ? `(${row.character_maximum_length})` : '';
          const defaultVal = row.column_default ? ` DEFAULT ${row.column_default}` : '';
          console.log(`  ${row.column_name.padEnd(40)} ${row.data_type}${length} ${nullable}${defaultVal}`);
        });
      }
    }
    
    console.log('\n' + '='.repeat(60));
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

verEsquemaCompleto();
