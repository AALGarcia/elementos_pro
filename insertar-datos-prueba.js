// Script para insertar datos de prueba en la base de datos
const { pool } = require('./src/config/conexion');

async function insertarDatosPrueba() {
  const client = await pool.connect();
  
  try {
    console.log('Iniciando inserción de datos de prueba...\n');
    
    await client.query('BEGIN');
    
    // 1. Insertar Roles
    console.log('1. Insertando roles...');
    const roles = [
      { nombre: 'Administrador' },
      { nombre: 'Docente' },
      { nombre: 'Estudiante' },
      { nombre: 'Coordinador' }
    ];
    
    for (const rol of roles) {
      await client.query(
        'INSERT INTO rol (rol_nombre) VALUES ($1) ON CONFLICT DO NOTHING',
        [rol.nombre]
      );
    }
    console.log('✓ Roles insertados');
    
    // 2. Insertar Ambientes
    console.log('2. Insertando ambientes...');
    const ambientes = [
      { nombre: 'Laboratorio 1' },
      { nombre: 'Laboratorio 2' },
      { nombre: 'Sala de Sistemas' },
      { nombre: 'Oficina Administrativa' }
    ];
    
    for (const ambiente of ambientes) {
      await client.query(
        'INSERT INTO ambiente (amb_nombre) VALUES ($1) ON CONFLICT DO NOTHING',
        [ambiente.nombre]
      );
    }
    console.log('✓ Ambientes insertados');
    
    // 3. Insertar Marcas
    console.log('3. Insertando marcas...');
    const marcas = [
      { nombre: 'Dell' },
      { nombre: 'HP' },
      { nombre: 'Lenovo' },
      { nombre: 'Apple' },
      { nombre: 'Asus' }
    ];
    
    for (const marca of marcas) {
      await client.query(
        'INSERT INTO marca (marc_nombre) VALUES ($1) ON CONFLICT DO NOTHING',
        [marca.nombre]
      );
    }
    console.log('✓ Marcas insertadas');
    
    // 4. Insertar Personas de prueba
    console.log('4. Insertando personas de prueba...');
    const personas = [
      { documento: '1001', nombres: 'Juan', apellidos: 'Pérez', telefono: '3001234567' },
      { documento: '1002', nombres: 'María', apellidos: 'García', telefono: '3009876543' },
      { documento: '1003', nombres: 'Carlos', apellidos: 'López', telefono: '3005555555' }
    ];
    
    for (const persona of personas) {
      await client.query(
        'INSERT INTO persona (pers_documento, pers_nombres, pers_apellidos, pers_telefono) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
        [persona.documento, persona.nombres, persona.apellidos, persona.telefono]
      );
    }
    console.log('✓ Personas insertadas');
    
    // 5. Asignar roles a personas
    console.log('5. Asignando roles a personas...');
    const rolesResult = await client.query('SELECT rol_id FROM rol LIMIT 3');
    const personasResult = await client.query('SELECT pers_documento FROM persona LIMIT 3');
    
    if (rolesResult.rows.length > 0 && personasResult.rows.length > 0) {
      for (let i = 0; i < Math.min(rolesResult.rows.length, personasResult.rows.length); i++) {
        await client.query(
          'INSERT INTO rol_persona (rq_rol_id, persona_pers_documento) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [rolesResult.rows[i].rol_id, personasResult.rows[i].pers_documento]
        );
      }
      console.log('✓ Roles asignados a personas');
    }
    
    // 6. Insertar Elementos de prueba
    console.log('6. Insertando elementos de prueba...');
    const marcasResult = await client.query('SELECT marc_id FROM marca LIMIT 3');
    
    if (marcasResult.rows.length > 0) {
      const elementos = [
        { placa: '1001', descripcion: 'Laptop Dell', modelo: 'Latitude 5420', serial: 'SN001' },
        { placa: '1002', descripcion: 'Laptop HP', modelo: 'EliteBook 840', serial: 'SN002' },
        { placa: '1003', descripcion: 'Laptop Lenovo', modelo: 'ThinkPad X1', serial: 'SN003' }
      ];
      
      for (let i = 0; i < elementos.length && i < marcasResult.rows.length; i++) {
        await client.query(
          'INSERT INTO elemento (elem_placa, elem_descripcion, elem_modelo, marca_marc_id, elem_serial) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING',
          [elementos[i].placa, elementos[i].descripcion, elementos[i].modelo, marcasResult.rows[i].marc_id, elementos[i].serial]
        );
      }
      console.log('✓ Elementos insertados');
    }
    
    await client.query('COMMIT');
    
    console.log('\n✅ Datos de prueba insertados exitosamente\n');
    
    // Mostrar resumen
    const resumen = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM persona) as personas,
        (SELECT COUNT(*) FROM rol) as roles,
        (SELECT COUNT(*) FROM ambiente) as ambientes,
        (SELECT COUNT(*) FROM marca) as marcas,
        (SELECT COUNT(*) FROM elemento) as elementos,
        (SELECT COUNT(*) FROM rol_persona) as roles_asignados
    `);
    
    console.log('📊 Resumen de datos:');
    console.log(`   Personas: ${resumen.rows[0].personas}`);
    console.log(`   Roles: ${resumen.rows[0].roles}`);
    console.log(`   Ambientes: ${resumen.rows[0].ambientes}`);
    console.log(`   Marcas: ${resumen.rows[0].marcas}`);
    console.log(`   Elementos: ${resumen.rows[0].elementos}`);
    console.log(`   Roles asignados: ${resumen.rows[0].roles_asignados}`);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error al insertar datos:', error.message);
    console.error(error);
  } finally {
    client.release();
    await pool.end();
  }
}

insertarDatosPrueba();
