const { pool } = require('./src/config/conexion');

async function debugElementos() {
  try {
    console.log('1. Verificando datos en tabla elemento...\n');
    
    const countQuery = 'SELECT COUNT(*) FROM elemento';
    const countResult = await pool.query(countQuery);
    console.log(`Total de elementos: ${countResult.rows[0].count}\n`);
    
    console.log('2. Intentando query simple...\n');
    const simpleQuery = 'SELECT * FROM elemento LIMIT 3';
    const simpleResult = await pool.query(simpleQuery);
    console.log('Elementos encontrados:', simpleResult.rows.length);
    if (simpleResult.rows.length > 0) {
      console.log('Primer elemento:', simpleResult.rows[0]);
    }
    
    console.log('\n3. Intentando query con JOIN (como en la API)...\n');
    const joinQuery = `
      SELECT 
        e.elem_placa,
        e.elem_descripcion,
        e.elem_modelo,
        e.elem_serial,
        e.marca_marc_id,
        m.marc_nombre
      FROM elemento e
      JOIN marca m ON e.marca_marc_id = m.marc_id
      ORDER BY e.elem_placa
      LIMIT 3;
    `;
    
    const joinResult = await pool.query(joinQuery);
    console.log('Elementos con JOIN:', joinResult.rows.length);
    if (joinResult.rows.length > 0) {
      console.log('Primer elemento con marca:', joinResult.rows[0]);
    }
    
  } catch (error) {
    console.error('ERROR:', error.message);
    console.error('Código:', error.code);
    console.error('Detalle:', error.detail);
  } finally {
    await pool.end();
  }
}

debugElementos();
