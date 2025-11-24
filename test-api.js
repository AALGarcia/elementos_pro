// Script para probar las APIs directamente
const http = require('http');

function testAPI(path, description) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`TEST: ${description}`);
        console.log(`URL: http://localhost:3000${path}`);
        console.log(`Status: ${res.statusCode}`);
        console.log('='.repeat(60));
        
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            console.log('✓ Respuesta JSON válida');
            console.log('Success:', json.success);
            if (json.data) {
              console.log('Datos recibidos:', Array.isArray(json.data) ? `${json.data.length} registros` : 'Objeto');
              if (Array.isArray(json.data) && json.data.length > 0) {
                console.log('Primer registro:', JSON.stringify(json.data[0], null, 2));
              }
            }
          } catch (e) {
            console.log('✗ Error al parsear JSON:', e.message);
            console.log('Respuesta:', data.substring(0, 200));
          }
        } else {
          console.log('✗ Error HTTP:', res.statusCode);
          console.log('Respuesta:', data.substring(0, 200));
        }
        
        resolve();
      });
    });

    req.on('error', (error) => {
      console.log(`\n✗ Error en ${description}:`, error.message);
      resolve();
    });

    req.end();
  });
}

async function runTests() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║           PRUEBAS DE API - DIAGNÓSTICO                ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  
  await testAPI('/api/personas', 'GET /api/personas');
  await testAPI('/api/roles', 'GET /api/roles');
  await testAPI('/api/marcas', 'GET /api/marcas');
  await testAPI('/api/ambientes', 'GET /api/ambientes');
  await testAPI('/api/elementos', 'GET /api/elementos');
  await testAPI('/api/asignaciones', 'GET /api/asignaciones');
  
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║                  PRUEBAS COMPLETADAS                   ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');
}

runTests();
