// Script para verificar el esquema de la tabla ASIGNACION
const { pool } = require('./src/config/conexion');

async function checkSchema() {
  try {
    console.log('Verificando esquema de la tabla ASIGNACION...\n');
    
    const query = `
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'asignacion'
      ORDER BY ordinal_position;
    `;
    
    const result = await pool.query(query);
    
    if (result.rows.length === 0) {
      console.log('⚠️  No se encontró la tabla "asignacion" (minúsculas)');
      console.log('Intentando con mayúsculas...\n');
      
      const queryUpper = `
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'ASIGNACION'
        ORDER BY ordinal_position;
      `;
      
      const resultUpper = await pool.query(queryUpper);
      
      if (resultUpper.rows.length === 0) {
        console.log('❌ No se encontró la tabla ASIGNACION');
      } else {
        console.log('✅ Tabla encontrada: ASIGNACION (mayúsculas)\n');
        console.log('Columnas:');
        resultUpper.rows.forEach(row => {
          console.log(`  - ${row.column_name} (${row.data_type}) ${row.is_nullable === 'NO' ? '- NOT NULL' : ''}`);
        });
      }
    } else {
      console.log('✅ Tabla encontrada: asignacion (minúsculas)\n');
      console.log('Columnas:');
      result.rows.forEach(row => {
        console.log(`  - ${row.column_name} (${row.data_type}) ${row.is_nullable === 'NO' ? '- NOT NULL' : ''}`);
      });
    }
    
    // Verificar otras tablas
    console.log('\n\nVerificando otras tablas...\n');
    
    const tables = ['PERSONA', 'ROL', 'ELEMENTO', 'MARCA', 'AMBIENTE', 'ROL_PERSONA'];
    
    for (const table of tables) {
      const checkQuery = `
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = $1
        LIMIT 1;
      `;
      
      const checkResult = await pool.query(checkQuery, [table.toLowerCase()]);
      const checkResultUpper = await pool.query(checkQuery, [table]);
      
      if (checkResult.rows.length > 0) {
        console.log(`✅ ${table}: encontrada como "${table.toLowerCase()}"`);
      } else if (checkResultUpper.rows.length > 0) {
        console.log(`✅ ${table}: encontrada como "${table}"`);
      } else {
        console.log(`❌ ${table}: NO encontrada`);
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkSchema();
